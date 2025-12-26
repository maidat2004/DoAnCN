import Invoice from '../models/Invoice.js';
import Contract from '../models/Contract.js';
import Tenant from '../models/Tenant.js';
import Service from '../models/Service.js';
import { sendInvoiceEmail } from '../utils/mailer.js';

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private/Admin
export const getInvoices = async (req, res) => {
  try {
    const { status, room, tenant, month, year } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (room) query.room = room;
    if (tenant) query.tenant = tenant;
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const invoices = await Invoice.find(query)
      .populate('room', 'roomNumber floor')
      .populate('tenant', 'fullName phone email')
      .populate('services.service', 'name unitPrice unit');

    res.json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
export const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('room')
      .populate('tenant')
      .populate('contract')
      .populate('services.service');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hóa đơn'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create invoice
// @route   POST /api/invoices
// @access  Private/Admin
export const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);

    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create bulk draft invoices for all tenants
// @route   POST /api/invoices/bulk-draft
// @access  Private/Admin
export const createBulkDraftInvoices = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Get all active tenants (without populate first to avoid cast errors)
    const allTenants = await Tenant.find({
      room: { $exists: true, $ne: null }
    });
    
    // Filter out tenants with invalid room values
    const validTenantIds = allTenants
      .filter(t => t.room && t.room !== 'none' && t.room !== '' && t.room.toString().length === 24)
      .map(t => t._id);
    
    if (validTenantIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có người thuê nào đang có phòng'
      });
    }

    // Now get tenants with populated room
    const tenants = await Tenant.find({
      _id: { $in: validTenantIds }
    }).populate('room', 'roomNumber floor price');

    // Get electricity and water services
    const electricService = await Service.findOne({ name: /điện/i });
    const waterService = await Service.findOne({ name: /nước/i });

    const draftInvoices = [];
    const errors = [];

    for (const tenant of tenants) {
      try {
        // Double check room exists
        if (!tenant.room || !tenant.room._id) {
          errors.push({
            tenant: tenant.fullName,
            room: 'N/A',
            reason: 'Không có thông tin phòng'
          });
          continue;
        }

        // Check if invoice already exists for this month
        const existingInvoice = await Invoice.findOne({
          tenant: tenant._id,
          month,
          year
        });

        if (existingInvoice) {
          errors.push({
            tenant: tenant.fullName,
            room: tenant.room?.roomNumber,
            reason: 'Đã có hóa đơn tháng này'
          });
          continue;
        }

        // Calculate room price based on days
        let roomPrice = tenant.room?.price || 0;
        let daysInfo = '';

        // Get previous paid invoices
        const previousInvoices = await Invoice.find({
          tenant: tenant._id,
          status: 'paid',
          paidDate: { $exists: true }
        }).sort({ paidDate: -1 }).limit(1);

        const today = new Date();
        let startDate;

        if (previousInvoices.length > 0) {
          // Calculate from last paid date
          startDate = new Date(previousInvoices[0].paidDate);
          daysInfo = 'Từ ngày thanh toán HĐ trước';
        } else if (tenant.moveInDate) {
          // First invoice - calculate from move-in date
          startDate = new Date(tenant.moveInDate);
          daysInfo = 'Tháng đầu - từ ngày vào';
        } else {
          // Default: full month
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          daysInfo = 'Tính tháng đầy đủ';
        }

        // Calculate days and prorated price
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const pricePerDay = roomPrice / 30;
        const calculatedRoomPrice = Math.round(pricePerDay * diffDays);

        // Generate invoice number
        const invoiceCount = await Invoice.countDocuments();
        const invoiceNumber = `HD${year}${String(month).padStart(2, '0')}${String(invoiceCount + draftInvoices.length + 1).padStart(4, '0')}`;

        // Create draft invoice
        const invoiceData = {
          invoiceNumber,
          room: tenant.room._id,
          tenant: tenant._id,
          month,
          year,
          roomRent: calculatedRoomPrice,
          services: [],
          totalAmount: calculatedRoomPrice,
          status: 'pending',
          dueDate: new Date(year, month, 5), // Due on 5th of next month
          notes: `Tự động tạo - ${daysInfo} (${diffDays} ngày)`,
          isDraft: true // Mark as draft
        };

        const invoice = await Invoice.create(invoiceData);
        draftInvoices.push({
          invoice,
          tenant: tenant.fullName,
          room: tenant.room?.roomNumber,
          days: diffDays,
          info: daysInfo
        });
      } catch (error) {
        errors.push({
          tenant: tenant.fullName,
          room: tenant.room?.roomNumber || 'N/A',
          reason: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Đã tạo ${draftInvoices.length} hóa đơn draft`,
      data: {
        created: draftInvoices,
        errors,
        summary: {
          total: tenants.length,
          success: draftInvoices.length,
          failed: errors.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private/Admin
export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hóa đơn'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private/Admin
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hóa đơn'
      });
    }

    await invoice.deleteOne();

    res.json({
      success: true,
      message: 'Đã xóa hóa đơn thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get invoices by tenant
// @route   GET /api/invoices/tenant/:tenantId
// @access  Private
export const getInvoicesByTenant = async (req, res) => {
  try {
    const invoices = await Invoice.find({ tenant: req.params.tenantId })
      .populate('room', 'roomNumber floor')
      .populate('services.service', 'name unitPrice unit')
      .sort('-year -month');

    res.json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Pay invoice
// @route   PUT /api/invoices/:id/pay
// @access  Private/Admin
export const payInvoice = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hóa đơn'
      });
    }

    invoice.status = 'paid';
    invoice.paidDate = new Date();
    invoice.paymentMethod = paymentMethod || 'cash';

    await invoice.save();

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Send invoice via email
// @route   POST /api/invoices/:id/send
// @access  Private/Admin
export const sendInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('room', 'roomNumber floor')
      .populate('tenant', 'fullName phone email')
      .populate('services.service', 'name unitPrice unit');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hóa đơn'
      });
    }

    if (!invoice.tenant || !invoice.tenant.email) {
      return res.status(400).json({
        success: false,
        message: 'Người thuê không có email để gửi hóa đơn'
      });
    }

    // Gửi email hóa đơn
    const emailResult = await sendInvoiceEmail(
      invoice.tenant.email,
      invoice.tenant.fullName,
      {
        room: invoice.room,
        month: invoice.month,
        year: invoice.year,
        services: invoice.services,
        totalAmount: invoice.totalAmount,
        dueDate: invoice.dueDate
      }
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Không thể gửi email hóa đơn',
        error: emailResult.error
      });
    }

    // Cập nhật trạng thái đã gửi email
    invoice.emailSent = true;
    invoice.emailSentDate = new Date();
    await invoice.save();

    res.json({
      success: true,
      message: 'Đã gửi hóa đơn qua email thành công',
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
