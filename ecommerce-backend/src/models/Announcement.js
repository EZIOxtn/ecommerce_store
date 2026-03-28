import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  photo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  link: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'announcement',
  timestamps: false,
  underscored: true
});

export default Announcement;