import Contract from '../models/Contract.js';
import Room from '../models/Room.js';
import Tenant from '../models/Tenant.js';

// @desc    Get all contracts
// @route   GET /api/contracts
// @access  Private/Admin
export const getContracts = async (req, res) => {
  try {
    const { status, room, tenant } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (room) query.room = room;
    if (tenant) query.tenant = tenant;

    const contracts = await Contract.find(query)
      .populate('room', 'roomNumber floor')
      .populate('tenant', 'fullName phone email');

    res.json({
      success: true,
      count: contracts.length,
      data: contracts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single contract
// @route   GET /api/contracts/:id
// @access  Private
export const getContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('room')
      .populate('tenant');

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hợp đồng'
      });
    }

    res.json({
      success: true,
      data: contract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create contract
// @route   POST /api/contracts
// @access  Private/Admin
export const createContract = async (req, res) => {
  try {
    const contract = await Contract.create(req.body);

    // Update tenant status
    await Tenant.findByIdAndUpdate(contract.tenant, {
      status: 'active',
      moveInDate: contract.startDate
    });

    res.status(201).json({
      success: true,
      data: contract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update contract
// @route   PUT /api/contracts/:id
// @access  Private/Admin
export const updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hợp đồng'
      });
    }

    res.json({
      success: true,
      data: contract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete contract
// @route   DELETE /api/contracts/:id
// @access  Private/Admin
export const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hợp đồng'
      });
    }

    await contract.deleteOne();

    res.json({
      success: true,
      message: 'Đã xóa hợp đồng thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get contracts by tenant
// @route   GET /api/contracts/tenant/:tenantId
// @access  Private
export const getContractsByTenant = async (req, res) => {
  try {
    const contracts = await Contract.find({ tenant: req.params.tenantId })
      .populate('room', 'roomNumber floor price');

    res.json({
      success: true,
      count: contracts.length,
      data: contracts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
