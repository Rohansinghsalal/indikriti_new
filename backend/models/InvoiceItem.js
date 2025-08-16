const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const InvoiceItem = sequelize.define('InvoiceItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'invoices',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tax_amount: {
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
  tableName: 'invoice_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeSave: (item) => {
      // Calculate line total
      const subtotal = parseFloat(item.unit_price) * item.quantity;
      const discount = parseFloat(item.discount_amount) || 0;
      const tax = parseFloat(item.tax_amount) || 0;
      item.line_total = subtotal - discount + tax;
    }
  }
});

// Define associations
InvoiceItem.associate = (models) => {
  if (models.Invoice) {
    InvoiceItem.belongsTo(models.Invoice, {
      foreignKey: 'invoice_id',
      as: 'invoice'
    });
  }

  if (models.Product) {
    InvoiceItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  }
};

module.exports = InvoiceItem;
