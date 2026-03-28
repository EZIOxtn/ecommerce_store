import sequelize, { Product } from '../models/index.js';
import { Op } from 'sequelize';
import { productCache, featuredProductCache } from '../utils/cache.js';
import { verifier } from '../auth/tokenizer.js';
import { sessionTokenMiddleware } from '../middleware/verifySessionTokenMiddleware.js';
// Input validation helper
function validateQueryParams(req, res) {
  const { page = '1', category, search, featured, exclusive, minPrice, maxPrice } = req.query;
  const pageNum = parseInt(page, 10);

  if (isNaN(pageNum) || pageNum < 1 || pageNum > 1000) {
    res.status(400).json({ error: 'Invalid page number' });
    return null;
  }
  if (category && category.length > 50) {
    res.status(400).json({ error: 'Category too long' });
    return null;
  }
  if (search && search.length > 100) {
    res.status(400).json({ error: 'Search query too long' });
    return null;
  }

  return { 
    pageNum, 
    category, 
    search, 
    featured: featured === 'true',
    exclusive: exclusive === 'true',
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
  };
}

// Get products with filters and pagination - Optimized version
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search } = req.query;
    
    const whereClause = { is_active: true };

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.name = {
        [Op.iLike]: `%${search}%`
      };
    }

    // Optimize by using separate count query with fewer attributes
    const countPromise = Product.count({ where: whereClause });
    
    // Main query for data
    const productsPromise = Product.findAll({
      where: whereClause,
      attributes: [
        'id', 'name', 'price', 'original_price', 'rating', 'stock',
        'short_description', 'image', 'category', 'is_featured', 'is_exclusive'
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    // Run both queries in parallel
    const [count, products] = await Promise.all([countPromise, productsPromise]);

    const totalPages = Math.ceil(count / limit);

    // In the getProducts function, ensure you're sending a consistent structure
    res.status(200).json({
      statusCode: 200,
      message: 'Products fetched successfully',
      data: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        totalCount: count,
        count: products.length,
        products: products, // Make sure this key exists and contains your products array
      },
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      data: [],
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
if (!verifier(req, req.headers['cf-turnstile-response'], req.headers['x-secure-next'])) {
  return res.status(400).json({
    statusCode: 400,
    error: 'Invalid request'
  });
}
  const productId = parseInt(id);
  if (!id || isNaN(productId) || productId <= 0) {
    return res.status(400).json({ 
      statusCode: 400,
      error: 'Invalid product ID' 
    });
  }

  try {
    const product = await Product.findByPk(productId, {
      attributes: [
        'id', 'name', 'price', 'original_price', 'rating', 'stock',
        'short_description', 'description', 'image', 'category',
        'is_featured', 'is_exclusive'
      ]
    });

    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Product not found',
        data: null,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Product fetched successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product by ID:',Date.now(), error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};


// Get featured products
// In getFeaturedProducts function
export const getFeaturedProducts = async (req, res) => {
  const { limit = 10 } = req.query;
  const productLimit = parseInt(limit);

  if (isNaN(productLimit) || productLimit < 1 || productLimit > 50) {
    return res.status(400).json({ 
      statusCode: 400,
      error: 'Invalid limit parameter' 
    });
  }

  try {
    // Check cache first
    const cacheKey = `featured_${productLimit}`;
    const cachedProducts = featuredProductCache.get(cacheKey);
    
    if (cachedProducts) {
      return res.status(200).json({
        statusCode: 200,
        message: 'Featured products fetched from cache',
        data: cachedProducts
      });
    }

    const products = await Product.scope('featured').findAll({
      attributes: [
        'id', 'name', 'price', 'original_price', 'rating', 'stock',
        'short_description', 'image', 'category', 'is_featured', 'is_exclusive'
      ],
      order: [['created_at', 'DESC']],
      limit: productLimit
    });

    const result = {
      count: products.length,
      products,
    };
    
    // Store in cache
    featuredProductCache.set(cacheKey, result);

    res.status(200).json({
      statusCode: 200,
      message: 'Featured products fetched successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching featured products:',Date.now().toLocaleString(), error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      data: [],
    });
  }
};

// Create product
export const createProduct = async (req, res) => {
  const productData = req.body;

  try {
    const product = await Product.create(productData);

    res.status(201).json({
      statusCode: 201,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        statusCode: 400,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    // Simpler approach using Sequelize ORM
    const products = await Product.findAll({
      attributes: ['category'],
      where: {
        is_active: true,
        category: {
          [Op.not]: null
        }
      },
      raw: true
    });
    
    // Extract unique categories using a Set
    const categories = [...new Set(products.map(p => p.category))];
    
    res.status(200).json({
      statusCode: 200,
      message: 'Categories fetched successfully',
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    console.error('Error details:', error.message, error.stack);
    
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      data: []
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q, category } = req.query;
    if (!verifier(req, req.headers['cf-turnstile-response'], req.headers['x-secure-next'])) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Invalid request'
      });
    }
    
    const whereClause = {};
    
    if (q) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } }
      ];
    }
    
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    
    const products = await Product.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      statusCode: 200,
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Search failed'
    });
  }
};