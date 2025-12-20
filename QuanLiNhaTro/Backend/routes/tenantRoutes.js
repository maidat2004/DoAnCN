import express from 'express';
import {
  getTenants,
  getTenant,
  createTenant,
  updateTenant,
  deleteTenant,
  getTenantByUser
} from '../controllers/tenantController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getTenants);
router.get('/user/:userId', protect, getTenantByUser);
router.get('/:id', protect, getTenant);
router.post('/', protect, authorize('admin'), createTenant);
router.put('/:id', protect, authorize('admin'), updateTenant);
router.delete('/:id', protect, authorize('admin'), deleteTenant);

export default router;
