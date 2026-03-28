import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  google_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  picture: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'user',
    validate: {
      isIn: [['user', 'admin', 'moderator']]
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  jwt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  jwt_expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  jwt_created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  jwt_revoked : {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: false,
  underscored: true
});

export default User;