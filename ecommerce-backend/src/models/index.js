import sequelize from '../config/database.js';
import User from './User.js';
import Product from './Product.js';
import Announcement from './Announcement.js';
import Payment from './Payment.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';

// Define model associations
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });

// Order and OrderItem relationships
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'orderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// OrderItem and Product relationships
Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// Skip database operations entirely
export const syncDatabase = async () => {
  try {
    console.log('✅ Database models loaded (no connection test)');
  } catch (error) {
    console.error('❌ Model loading failed:', error);
  }
};

// Export all models
export { User, Product, Announcement, Payment, Order, OrderItem };
export default sequelize;