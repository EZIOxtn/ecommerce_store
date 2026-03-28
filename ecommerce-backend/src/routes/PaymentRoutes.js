import express from 'express';
import { createPayment, handleWebhook, getPaymentStatus, getPaymentMethods } from '../controllers/PaymentController.js';
import { requireAuth } from '../middleware/auth.js';
import { verifyJWT } from '../config/jwt.js';


const router = express.Router();

// Create a payment (requires authentication)
router.post('/', verifyJWT(), createPayment);

// Webhook for Mollie payment updates (no auth required)
router.post('/webhook', handleWebhook);

// Get payment status
router.get('/status/:orderId', verifyJWT, getPaymentStatus);

// Get available payment methods
router.get('/methods', getPaymentMethods);

export default router;