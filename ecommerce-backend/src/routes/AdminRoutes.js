import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { 
  getAllOrders, 
  getOrdersByUser,
  updateOrderStatus,
  getDashboardStats
} from '../controllers/AdminController.js';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  returnRoute
} from '../controllers/AdminProductController.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(requireAuth);
router.use(requireAdmin);

// Dashboard
router.get('/givemetheroute', returnRoute)
router.get('/dashboard', getDashboardStats);

// Product management
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order management
router.get('/orders', getAllOrders);
router.get('/orders/user', getOrdersByUser);
router.put('/orders/:id/status', updateOrderStatus);

export default router;