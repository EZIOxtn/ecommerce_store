import { Order, User, Payment, Product } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Get basic stats
    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();
    
    // Get revenue stats
    const totalRevenue = await Payment.sum('amount', {
      where: { status: ['paid', 'completed'] }
    });
    
    // Get recent orders
    const recentOrders = await Order.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Payment,
          attributes: ['status', 'amount']
        }
      ]
    });
    
    // Get sales by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlySales = await Payment.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      where: {
        created_at: {
          [Op.gte]: sixMonthsAgo
        },
        status: ['paid', 'completed']
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'ASC']]
    });
    
    res.json({
      statusCode: 200,
      message: 'Dashboard stats retrieved successfully',
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue || 0
        },
        recentOrders,
        monthlySales
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to get dashboard stats',
      error: error.message
    });
  }
};

export const getAllOrders = async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    status, 
    startDate, 
    endDate 
  } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;
  
  try {
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
          required: false
        },
        {
          model: Payment,
          attributes: ['id', 'mollie_payment_id', 'status', 'payment_method', 'amount'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']],
      limit: limitNum,
      offset: offset
    });
    
    const totalPages = Math.ceil(count / limitNum);
    
    res.json({
      statusCode: 200,
      message: 'Orders fetched successfully',
      data: {
        orders,
        pagination: {
          total: count,
          page: pageNum,
          limit: limitNum,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

export const getOrdersByUser = async (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Email is required'
    });
  }
  
  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'name', 'email']
    });
    
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found'
      });
    }
    
    const orders = await Order.findAll({
      where: { user_id: user.id },
      include: [
        {
          model: Payment,
          attributes: ['id', 'mollie_payment_id', 'status', 'payment_method', 'amount'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      statusCode: 200,
      message: 'User orders fetched successfully',
      data: {
        user,
        orders
      }
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to fetch user orders',
      error: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Status is required'
    });
  }
  
  try {
    const [updatedRows] = await Order.update(
      { status, updated_at: new Date() },
      { where: { id: parseInt(id) } }
    );
    
    if (updatedRows === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Order not found'
      });
    }
    
    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
          required: false
        },
        {
          model: Payment,
          attributes: ['id', 'status', 'payment_method'],
          required: false
        }
      ]
    });
    
    res.json({
      statusCode: 200,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};