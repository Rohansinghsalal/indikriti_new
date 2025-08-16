/**
 * Admin Model
 * Stores admin-specific information separate from regular users
 */
const bcrypt = require('bcryptjs');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    access_level: {
      type: DataTypes.ENUM('limited', 'full', 'super'),
      defaultValue: 'limited'
    },
    is_super_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      }
    }
  }, {
    tableName: 'admins',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password) {
          admin.password = await bcrypt.hash(admin.password, 10);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('password')) {
          admin.password = await bcrypt.hash(admin.password, 10);
        }
      }
    },
    indexes: [
      { fields: ['email'] },
      { fields: ['role_id'] },
      { fields: ['company_id'] },
      { fields: ['department'] }
    ]
  });

  // Instance methods
  Admin.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };
  
  // Add comparePassword method for authentication
  Admin.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

// Associations will be defined after all models are loaded

module.exports = Admin;