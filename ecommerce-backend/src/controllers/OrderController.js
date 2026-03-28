import { Order, OrderItem, Product, User, Payment } from '../models/index.js';
import sequelize from '../config/database.js';

export const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { items, shipping_address, total_amount, external_reference } = req.body;
    const user_id = req.user?.id || null;
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        statusCode: 400,
        message: 'Items are required and must be a non-empty array'
      });
    }
    
    if (!total_amount || total_amount <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        statusCode: 400,
        message: 'Valid total amount is required'
      });
    }
    
    // Validate and fetch products
    const productIds = items.map(item => item.id || item.product_id);
    const products = await Product.findAll({
      where: { id: productIds, is_active: true },
      transaction
    });
    
    if (products.length !== productIds.length) {
      await transaction.rollback();
      return res.status(400).json({
        statusCode: 400,
        message: 'Some products are not available'
      });
    }
    
    // Check stock availability
    const stockErrors = [];
    const productMap = {};
    products.forEach(product => {
      productMap[product.id] = product;
    });
    
    items.forEach(item => {
      const product = productMap[item.id || item.product_id];
      if (product && product.stock < item.quantity) {
        stockErrors.push(`${product.name} has only ${product.stock} items in stock`);
      }
    });
    
    if (stockErrors.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        statusCode: 400,
        message: 'Insufficient stock',
        errors: stockErrors
      });
    }
    
    // Calculate total and verify
    let calculatedTotal = 0;
    const orderItemsData = items.map(item => {
      const product = productMap[item.id || item.product_id];
      const unitPrice = parseFloat(product.price);
      const quantity = parseInt(item.quantity);
      const totalPrice = unitPrice * quantity;
      
      calculatedTotal += totalPrice;
      
      return {
        product_id: product.id,
        quantity: quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        product_name: product.name,
        product_image: product.image
      };
    });
    
    // Verify total amount
    if (Math.abs(calculatedTotal - parseFloat(total_amount)) > 0.01) {
      await transaction.rollback();
      return res.status(400).json({
        statusCode: 400,
        message: `Total amount mismatch. Expected: ${calculatedTotal.toFixed(2)}, Received: ${total_amount}`
      });
    }
    
    // Create order
    const order = await Order.create({
      user_id,
      total_amount: calculatedTotal,
      status: 'pending',
      shipping_address: typeof shipping_address === 'object' ? shipping_address : JSON.parse(shipping_address),
      items: JSON.stringify(items), // Keep for backward compatibility
      external_reference: external_reference || `ORD-${Date.now()}`,
      created_at: new Date(),
      updated_at: new Date()
    }, { transaction });
    
    // Create order items
    const orderItems = await OrderItem.bulkCreate(
      orderItemsData.map(item => ({
        ...item,
        order_id: order.id,
        created_at: new Date(),
        updated_at: new Date()
      })),
      { transaction }
    );
    
    // Update product stock
    await Promise.all(items.map(item => {
      const product = productMap[item.id || item.product_id];
      return Product.update(
        { 
          stock: product.stock - item.quantity,
          updated_at: new Date()
        },
        { 
          where: { id: product.id },
          transaction 
        }
      );
    }));
    
    await transaction.commit();
    
    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'category', 'image']
            }
          ]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    res.status(201).json({
      statusCode: 201,
      message: 'Order created successfully',
      data: {
        order: completeOrder,
        orderItems: orderItems
      }
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user_id = req.user.id;
    
    const orders = await Order.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'category', 'image', 'is_active']
            }
          ]
        },
        {
          model: Payment,
          attributes: ['id', 'status', 'payment_method', 'amount']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    res.json({
      statusCode: 200,
      message: 'Orders fetched successfully',
      data: {
        orders: orders.rows,
        pagination: {
          total: orders.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(orders.count / parseInt(limit))
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;
    
    const whereClause = { id: parseInt(id) };
    if (user_id) {
      whereClause.user_id = user_id; // Users can only see their own orders
    }
    
    const order = await Order.findOne({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'category', 'image', 'is_active']
            }
          ]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Payment,
          attributes: ['id', 'status', 'payment_method', 'amount', 'mollie_payment_id']
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Order not found'
      });
    }
    
    res.json({
      statusCode: 200,
      message: 'Order fetched successfully',
      data: order
    });
    
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};