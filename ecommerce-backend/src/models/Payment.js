import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mollie_payment_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  order_id: {
    type: DataTypes.INTEGER, // Changed to INTEGER to match database
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'EUR'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'created'
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'payments',
  timestamps: false,
  underscored: true
});

export default Payment;