/**
 * Orders Table Migration
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First create the orders table
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_number: {
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
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'shipped', 'delivered', 'cancelled', 'refunded'),
        defaultValue: 'pending'
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'paid', 'partially_paid', 'refunded', 'failed'),
        defaultValue: 'pending'
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: true
      },
      shipping_address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      billing_address: {
        type: Sequelize.TEXT,
        allowNull: true
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
      shipping_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      discount_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD',
        allowNull: false
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tracking_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      shipping_method: {
        type: Sequelize.STRING,
        allowNull: true
      },
      source: {
        type: Sequelize.ENUM('web', 'pos', 'mobile', 'api', 'other'),
        defaultValue: 'web'
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

    // Then create order items table
    await queryInterface.createTable('order_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
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
        allowNull: false
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
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      options: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON string of product options/variations'
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

    // Add order status history table
    await queryInterface.createTable('order_status_history', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'shipped', 'delivered', 'cancelled', 'refunded'),
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      user_id: {
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
      }
    });

    // Add indexes
    await queryInterface.addIndex('orders', ['order_number']);
    await queryInterface.addIndex('orders', ['customer_id']);
    await queryInterface.addIndex('orders', ['status']);
    await queryInterface.addIndex('orders', ['payment_status']);
    await queryInterface.addIndex('orders', ['company_id']);
    await queryInterface.addIndex('orders', ['created_at']);
    
    await queryInterface.addIndex('order_items', ['order_id']);
    await queryInterface.addIndex('order_items', ['product_id']);
    
    await queryInterface.addIndex('order_status_history', ['order_id']);
    await queryInterface.addIndex('order_status_history', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order_status_history');
    await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('orders');
  }
}; 