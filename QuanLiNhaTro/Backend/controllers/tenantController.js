import Tenant from '../models/Tenant.js';
import User from '../models/User.js';
import Room from '../models/Room.js';

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Private/Admin
export const getTenants = async (req, res) => {
  try {
    const { status, room } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (room) query.room = room;

    const tenants = await Tenant.find(query)
      .populate('user', 'name email phone')
      .populate('room', 'roomNumber floor');

    res.json({
      success: true,
      count: tenants.length,
      data: tenants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single tenant
// @route   GET /api/tenants/:id
// @access  Private
export const getTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('room', 'roomNumber floor price');

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người thuê'
      });
    }

    res.json({
      success: true,
      data: tenant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create tenant
// @route   POST /api/tenants
// @access  Private/Admin
export const createTenant = async (req, res) => {
  try {
    const { userId, roomId, ...tenantData } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Create tenant
    const tenant = await Tenant.create({
      user: userId,
      room: roomId,
      ...tenantData
    });

    // Update user's tenantId
    user.tenantId = tenant._id;
    await user.save();

    // Update room if provided
    if (roomId) {
      const room = await Room.findById(roomId);
      if (room) {
        room.currentTenants.push(tenant._id);
        if (room.currentTenants.length >= room.capacity) {
          room.status = 'occupied';
        }
        await room.save();
      }
    }

    res.status(201).json({
      success: true,
      data: tenant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update tenant
// @route   PUT /api/tenants/:id
// @access  Private/Admin
export const updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người thuê'
      });
    }

    res.json({
      success: true,
      data: tenant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete tenant
// @route   DELETE /api/tenants/:id
// @access  Private/Admin
export const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người thuê'
      });
    }

    // Remove tenant from room
    if (tenant.room) {
      const room = await Room.findById(tenant.room);
      if (room) {
        room.currentTenants = room.currentTenants.filter(
          t => t.toString() !== tenant._id.toString()
        );
        if (room.currentTenants.length === 0) {
          room.status = 'available';
        }
        await room.save();
      }
    }

    // Update user
    const user = await User.findById(tenant.user);
    if (user) {
      user.tenantId = null;
      await user.save();
    }

    await tenant.deleteOne();

    res.json({
      success: true,
      message: 'Đã xóa người thuê thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get tenant by user ID
// @route   GET /api/tenants/user/:userId
// @access  Private
export const getTenantByUser = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ user: req.params.userId })
      .populate('user', 'name email phone')
      .populate('room', 'roomNumber floor price');

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người thuê'
      });
    }

    res.json({
      success: true,
      data: tenant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
