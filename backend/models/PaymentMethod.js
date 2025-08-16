const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const PaymentMethod = sequelize.define('PaymentMethod', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('cash', 'card', 'digital', 'bank_transfer', 'other'),
    defaultValue: 'cash'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  requires_reference: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'payment_methods',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
PaymentMethod.associate = (models) => {
  if (models.POSPayment) {
    PaymentMethod.hasMany(models.POSPayment, {
      foreignKey: 'payment_method_id',
      as: 'payments'
    });
  }
};

module.exports = PaymentMethod;
