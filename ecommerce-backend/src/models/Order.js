import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  status: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'pending'
  },
  shipping_address: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('shipping_address');
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return value;
      }
    },
    set(value) {
      this.setDataValue('shipping_address', value ? JSON.stringify(value) : null);
    }
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  external_reference: {
    type: DataTypes.STRING(255),
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
  tableName: 'orders',
  timestamps: false,
  underscored: true
});

Order.belongsTo(User, { foreignKey: 'user_id' });

export default Order;