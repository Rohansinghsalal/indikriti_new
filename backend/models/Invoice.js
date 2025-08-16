const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoice_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'pos_transactions',
      key: 'id'
    }
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  customer_phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  billing_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
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
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'draft'
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paid_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'admins',
      key: 'id'
    }
  }
}, {
  tableName: 'invoices',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeValidate: async (invoice) => {
      if (!invoice.invoice_number) {
        const timestamp = Date.now();
        const year = new Date().getFullYear();
        invoice.invoice_number = `INV-${year}-${timestamp}`;
      }
    }
  }
});

// Define associations
Invoice.associate = (models) => {
  if (models.POSTransaction) {
    Invoice.belongsTo(models.POSTransaction, {
      foreignKey: 'transaction_id',
      as: 'transaction'
    });
  }

  if (models.Order) {
    Invoice.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order'
    });
  }

  if (models.Customer) {
    Invoice.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer'
    });
  }

  if (models.Company) {
    Invoice.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });
  }

  if (models.Admin) {
    Invoice.belongsTo(models.Admin, {
      foreignKey: 'created_by',
      as: 'creator'
    });
  }

  if (models.InvoiceItem) {
    Invoice.hasMany(models.InvoiceItem, {
      foreignKey: 'invoice_id',
      as: 'items'
    });
  }
};

module.exports = Invoice;
