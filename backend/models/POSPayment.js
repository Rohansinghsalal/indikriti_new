const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const POSPayment = sequelize.define('POSPayment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pos_transactions',
      key: 'id'
    }
  },
  payment_method_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'payment_methods',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  reference_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'pos_payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
POSPayment.associate = (models) => {
  if (models.POSTransaction) {
    POSPayment.belongsTo(models.POSTransaction, {
      foreignKey: 'transaction_id',
      as: 'transaction'
    });
  }

  if (models.PaymentMethod) {
    POSPayment.belongsTo(models.PaymentMethod, {
      foreignKey: 'payment_method_id',
      as: 'paymentMethod'
    });
  }
};

module.exports = POSPayment;
