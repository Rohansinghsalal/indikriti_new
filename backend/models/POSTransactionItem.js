const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const POSTransactionItem = sequelize.define('POSTransactionItem', {
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
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  product_sku: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  line_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'pos_transaction_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeSave: (item) => {
      // Calculate line total
      const subtotal = parseFloat(item.quantity) * parseFloat(item.unit_price);
      item.line_total = subtotal - parseFloat(item.discount_amount || 0);
    }
  }
});

// Define associations
POSTransactionItem.associate = (models) => {
  if (models.POSTransaction) {
    POSTransactionItem.belongsTo(models.POSTransaction, {
      foreignKey: 'transaction_id',
      as: 'transaction'
    });
  }

  if (models.Product) {
    POSTransactionItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  }
};

module.exports = POSTransactionItem;
