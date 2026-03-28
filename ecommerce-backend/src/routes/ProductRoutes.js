import express from 'express';
import { getProducts, getProductById, getFeaturedProducts, createProduct, getAllCategories } from '../controllers/ProductController.js';
import { sessionTokenMiddleware } from '../middleware/verifySessionTokenMiddleware.js';
import { verifier } from '../auth/tokenizer.js';

const router = express.Router();

// Get all unique categories
router.get('/categories', getAllCategories);

// Get all products with filters, applying session and request token middleware
router.get('/', sessionTokenMiddleware, (req, res, next) => verifier(req, req.headers['cf-turnstile-response'], req.headers['x-secure-next']) ? next() : res.status(400).json({ statusCode: 400, error: 'Invalid request' }), getProducts);

// Get featured products
router.get('/featured', (req, res, next) => verifier(req, req.headers['cf-turnstile-response'], req.headers['x-secure-next']) ? next() : res.status(400).json({ statusCode: 400, error: 'Invalid request' }), getFeaturedProducts);  // Specific route first

// Get a single product by ID
router.get('/:id', getProductById);            // Generic parameter route last

// Create a new product
router.post('/', createProduct);

export default router;