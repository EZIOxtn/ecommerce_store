import { Product } from '../models/index.js';
import { Op } from 'sequelize'; // Add this import

export const getAllProducts = async (req, res) => {
  const { page = 1, limit = 20, search, category } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;
  
  try {
    const whereClause = {};
    
    if (search) {
      whereClause.name = {
        [Op.iLike]: `%${search}%`
      };
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: limitNum,
      offset: offset
    });
    
    const totalPages = Math.ceil(count / limitNum);
    
    res.json({
      statusCode: 200,
      message: 'Products fetched successfully',
      data: {
        products,
        pagination: {
          total: count,
          page: pageNum,
          limit: limitNum,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};
export const returnRoute = async (req, res) => {
  const {jwt} = req.cookies;
  try {
    
  
    if(jwt){

      res.json({'msg': 'success',
        'route': '/azertyuiop12345azertyuiop'
      });
    }else{
      res.json({'msg':'failed'});
    }
  } catch (error) {
    console.log(error);
    res.json({'msg':'failed'});
  }
 



}
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Set defaults if not provided
    if (productData.is_featured === undefined) productData.is_featured = false;
    if (productData.is_exclusive === undefined) productData.is_exclusive = false;
    if (productData.is_active === undefined) productData.is_active = true;
    if (productData.stock === undefined) productData.stock = 0;
    if (productData.rating === undefined) productData.rating = 0;
    
    const product = await Product.create({
      ...productData,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    res.status(201).json({
      statusCode: 201,
      message: 'Product created successfully',
      data: product
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
      message: 'Failed to create product',
      error: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const productData = req.body;
  
  try {
    productData.updated_at = new Date();
    
    const [updatedRows] = await Product.update(productData, {
      where: { id: parseInt(id) }
    });
    
    if (updatedRows === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Product not found'
      });
    }
    
    const updatedProduct = await Product.findByPk(id);
    
    res.json({
      statusCode: 200,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedRows = await Product.destroy({
      where: { id: parseInt(id) }
    });
    
    if (deletedRows === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Product not found'
      });
    }
    
    res.json({
      statusCode: 200,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};