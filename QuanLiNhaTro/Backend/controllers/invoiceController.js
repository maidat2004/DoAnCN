import Invoice from '../models/Invoice.js';
import Contract from '../models/Contract.js';

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
