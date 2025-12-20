import express from 'express';
import {
  getContracts,
  getContract,
  createContract,
  updateContract,
  deleteContract,
  getContractsByTenant
} from '../controllers/contractController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getContracts);
router.get('/tenant/:tenantId', protect, getContractsByTenant);
router.get('/:id', protect, getContract);
router.post('/', protect, authorize('admin'), createContract);
router.put('/:id', protect, authorize('admin'), updateContract);
router.delete('/:id', protect, authorize('admin'), deleteContract);

export default router;
