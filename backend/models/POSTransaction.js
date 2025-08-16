const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const POSTransaction = sequelize.define('POSTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transaction_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
    allowNull: true
  },
  customer_phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  subtotal: {
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
    type: DataTypes.ENUM('pending', 'completed', 'cancelled', 'refunded'),
    defaultValue: 'pending'
  },
  payment_status: {
    type: DataTypes.ENUM('unpaid', 'paid', 'partially_paid', 'refunded'),
    defaultValue: 'unpaid'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cashier_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Made nullable for testing
    references: {
      model: 'admins',
      key: 'id'
    }
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Made nullable for testing
    references: {
      model: 'companies',
      key: 'id'
    }
  }
}, {
  tableName: 'pos_transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (transaction) => {
      if (!transaction.transaction_number) {
        const timestamp = Date.now();
        transaction.transaction_number = `TXN-${timestamp}`;
      }
    }
  }
});

// Define associations
POSTransaction.associate = (models) => {
  if (models.Customer) {
    POSTransaction.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer'
    });
  }

  if (models.Admin) {
    POSTransaction.belongsTo(models.Admin, {
      foreignKey: 'cashier_id',
      as: 'cashier'
    });
  }

  if (models.Company) {
    POSTransaction.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });
  }

  if (models.POSTransactionItem) {
    POSTransaction.hasMany(models.POSTransactionItem, {
      foreignKey: 'transaction_id',
      as: 'items'
    });
  }

  if (models.POSPayment) {
    POSTransaction.hasMany(models.POSPayment, {
      foreignKey: 'transaction_id',
      as: 'payments'
    });
  }

  if (models.Invoice) {
    POSTransaction.hasOne(models.Invoice, {
      foreignKey: 'transaction_id',
      as: 'invoice'
    });
  }
};

module.exports = POSTransaction;
