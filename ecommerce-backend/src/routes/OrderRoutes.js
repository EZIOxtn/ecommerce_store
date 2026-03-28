import express from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/OrderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// User routes (require authentication)
router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrderById);

export default router;