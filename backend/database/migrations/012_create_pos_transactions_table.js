/**
 * POS Transactions Table Migration
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
      status: {
        type: Sequelize.ENUM('completed', 'voided', 'refunded', 'partially_refunded'),
        defaultValue: 'completed'
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      tax: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      payment_details: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON string containing payment details'
      },
      receipt_printed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      receipt_emailed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      receipt_email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      register_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      notes: {
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
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
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

    // Create POS transaction items table
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
        allowNull: true,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_sku: {
        type: Sequelize.STRING,
        allowNull: true
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      tax_rate: {
        type: Sequelize.DECIMAL(5, 2),
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
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      options: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON string of product options'
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

    // Create POS cash management table
    await queryInterface.createTable('pos_cash_management', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      register_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('open', 'close', 'count', 'payout', 'deposit'),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      expected_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      difference: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id'
        }
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

    // Add indexes
    await queryInterface.addIndex('pos_transactions', ['transaction_number']);
    await queryInterface.addIndex('pos_transactions', ['order_id']);
    await queryInterface.addIndex('pos_transactions', ['customer_id']);
    await queryInterface.addIndex('pos_transactions', ['status']);
    await queryInterface.addIndex('pos_transactions', ['payment_method']);
    await queryInterface.addIndex('pos_transactions', ['company_id']);
    await queryInterface.addIndex('pos_transactions', ['created_by']);
    await queryInterface.addIndex('pos_transactions', ['created_at']);
    
    await queryInterface.addIndex('pos_transaction_items', ['transaction_id']);
    await queryInterface.addIndex('pos_transaction_items', ['product_id']);
    
    await queryInterface.addIndex('pos_cash_management', ['register_id']);
    await queryInterface.addIndex('pos_cash_management', ['user_id']);
    await queryInterface.addIndex('pos_cash_management', ['type']);
    await queryInterface.addIndex('pos_cash_management', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pos_cash_management');
    await queryInterface.dropTable('pos_transaction_items');
    await queryInterface.dropTable('pos_transactions');
  }
}; 