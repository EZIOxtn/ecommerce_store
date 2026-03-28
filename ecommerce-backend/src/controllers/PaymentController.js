import { createMollieClient } from '@mollie/api-client';
import { Payment, User, Order, Product } from '../models/index.js';
import sequelize from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const mollieClient = createMollieClient({ 
  apiKey: process.env.MOLLIE_API_KEY || 'test_tftaKnF6D3ajtR38F6KBCxzQnyC7Nj'
});

console.log('Mollie client initialized in test mode');

export const createPayment = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { orderId, amount, description, items = [], customerName, customerEmail } = req.body;
    
    if (!orderId || !amount || !description) {
      await transaction.rollback();
      return res.status(400).json({
        statusCode: 400,
        message: 'Missing required fields'
      });
    }

   
    const productIds = items.map(item => item.id);
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

    // Check stock
    const productMap = {};
    products.forEach(product => {
      productMap[product.id] = product;
    });

    const stockErrors = [];
    items.forEach(item => {
      const product = productMap[item.id];
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

    // Calculate and verify total
    let calculatedTotal = 0;
    items.forEach(item => {
      const product = productMap[item.id];
      calculatedTotal += parseFloat(product.price) * item.quantity;
    });

    if (Math.abs(calculatedTotal - parseFloat(amount)) > 0.01) {
      await transaction.rollback();
      return res.status(400).json({
        statusCode: 400,
        message: `Total amount mismatch. Expected: ${calculatedTotal.toFixed(2)}, Received: ${amount}`
      });
    }

    // Create order with proper structure
    const order = await Order.create({
      user_id: req.user?.id || null,
      total_amount: calculatedTotal,
      status: 'pending',
      shipping_address: {
        name: customerName,
        email: customerEmail
      },
      items: items,
      external_reference: orderId,
      created_at: new Date(),
      updated_at: new Date()
    }, { transaction });

    // Update product stock
    await Promise.all(items.map(item => {
      const product = productMap[item.id];
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

    // Create payment in Mollie
    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: calculatedTotal.toFixed(2)
      },
      description: description,
      redirectUrl: `http://localhost:3000/checkout/result?order_id=${orderId}`,
      webhookUrl: `${process.env.WEBHOOK_URL || 'https://localhost:4000/api/payments/webhook'}`,
      metadata: { 
        orderId: orderId,
        databaseOrderId: order.id,
        customer: {
          name: customerName,
          email: customerEmail
        }
      }
    });

    // Create payment record
    await Payment.create({
      mollie_payment_id: payment.id,
      order_id: order.id,
      user_id: req.user?.id || null,
      amount: calculatedTotal,
      status: payment.status,
      created_at: new Date(),
      updated_at: new Date()
    }, { transaction });

    await transaction.commit();

    res.json({
      statusCode: 200,
      message: 'Payment created successfully',
      data: {
        paymentUrl: payment.getCheckoutUrl(),
        paymentId: payment.id,
        orderId: orderId,
        orderDatabaseId: order.id
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Payment creation failed:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Payment creation failed',
      error: error.message
    });
  }
};

export const handleWebhook = async (req, res) => {
  console.log('Webhook received from Mollie:', req.body, req.query, req.params);

  const paymentId = req.body?.id || req.query?.id;
  
  if (!paymentId) {
    console.error('No payment ID found in webhook request');
    return res.status(400).send('No payment ID provided');
  }
  
  try {
    console.log(`Processing webhook for payment ID: ${paymentId}`);
    
    const payment = await mollieClient.payments.get(paymentId);
    console.log(`Payment status from Mollie: ${payment.status}`);
    
    await Payment.update(
      { 
        status: payment.status,
        payment_method: payment.method,
        updated_at: new Date()
      },
      { where: { mollie_payment_id: paymentId } }
    );

    const paymentRecord = await Payment.findOne({
      where: { mollie_payment_id: paymentId }
    });

    // Fix: Check status directly instead of using isPaid() method
    if (paymentRecord && payment.status === 'paid') {
      await Order.update(
        { status: 'paid', updated_at: new Date() },
        { where: { id: paymentRecord.order_id } }
      );
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Webhook processing failed');
  }
};

export const getPaymentStatus = async (req, res) => {
  const { orderId } = req.params;
  
  try {
    const order = await Order.findOne({
      where: { external_reference: orderId }
    });
    
    if (!order) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Order not found'
      });
    }
    
    const payment = await Payment.findOne({
      where: { order_id: order.id }
    });
    
    if (!payment) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Payment not found'
      });
    }
    
    const molliePayment = await mollieClient.payments.get(payment.mollie_payment_id);
    
    if (payment.status !== molliePayment.status) {
      await Payment.update(
        { 
          status: molliePayment.status,
          payment_method: molliePayment.method || payment.payment_method,
          updated_at: new Date()
        },
        { where: { mollie_payment_id: payment.mollie_payment_id } }
      );
    }
    
    // Fix: Check status directly instead of using isPaid() method
    const isPaid = molliePayment.status === 'paid';
    
    res.json({
      statusCode: 200,
      message: 'Payment status retrieved',
      data: {
        orderId: orderId,
        status: molliePayment.status,
        amount: payment.amount,
        method: molliePayment.method || payment.payment_method,
        isPaid: isPaid
      }
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to get payment status',
      error: error.message
    });
  }
};

export const getPaymentMethods = async (req, res) => {
  try {
    const methods = await mollieClient.methods.list();
    
    res.json({
      statusCode: 200,
      message: 'Payment methods retrieved',
      data: methods
    });
  } catch (error) {
    console.error('Error getting payment methods:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to get payment methods',
      error: error.message
    });
  }
};