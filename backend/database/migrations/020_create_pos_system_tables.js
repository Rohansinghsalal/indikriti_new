/**
 * POS System Tables Migration
 * Creates tables for Point of Sale transactions, invoices, and payment methods
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create payment_methods table
    await queryInterface.createTable('payment_methods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      type: {
        type: Sequelize.ENUM('cash', 'card', 'digital', 'bank_transfer', 'other'),
        defaultValue: 'cash'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      requires_reference: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create pos_transactions table
    await queryInterface.createTable('pos_transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      customer_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customer_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customer_email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      tax_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      discount_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'cancelled', 'refunded'),
        defaultValue: 'pending'
      },
      payment_status: {
        type: Sequelize.ENUM('unpaid', 'paid', 'partially_paid', 'refunded'),
        defaultValue: 'unpaid'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cashier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'admins',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create pos_transaction_items table
    await queryInterface.createTable('pos_transaction_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pos_transactions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_sku: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      discount_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      line_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create pos_payments table
    await queryInterface.createTable('pos_payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pos_transactions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      payment_method_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'payment_methods',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      reference_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'cancelled'),
        defaultValue: 'pending'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create invoices table
    await queryInterface.createTable('invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'pos_transactions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      customer_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      customer_email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customer_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      billing_address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      tax_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      discount_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
        defaultValue: 'draft'
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      paid_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      terms: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'admins',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('pos_transactions', ['transaction_number']);
    await queryInterface.addIndex('pos_transactions', ['customer_id']);
    await queryInterface.addIndex('pos_transactions', ['cashier_id']);
    await queryInterface.addIndex('pos_transactions', ['company_id']);
    await queryInterface.addIndex('pos_transactions', ['status']);
    await queryInterface.addIndex('pos_transactions', ['created_at']);

    await queryInterface.addIndex('pos_transaction_items', ['transaction_id']);
    await queryInterface.addIndex('pos_transaction_items', ['product_id']);

    await queryInterface.addIndex('pos_payments', ['transaction_id']);
    await queryInterface.addIndex('pos_payments', ['payment_method_id']);

    await queryInterface.addIndex('invoices', ['invoice_number']);
    await queryInterface.addIndex('invoices', ['transaction_id']);
    await queryInterface.addIndex('invoices', ['order_id']);
    await queryInterface.addIndex('invoices', ['customer_id']);
    await queryInterface.addIndex('invoices', ['company_id']);
    await queryInterface.addIndex('invoices', ['status']);
    await queryInterface.addIndex('invoices', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('invoices');
    await queryInterface.dropTable('pos_payments');
    await queryInterface.dropTable('pos_transaction_items');
    await queryInterface.dropTable('pos_transactions');
    await queryInterface.dropTable('payment_methods');
  }
};
