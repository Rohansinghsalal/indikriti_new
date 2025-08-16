/**
 * Customers Table Migration
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'blocked'),
        defaultValue: 'active'
      },
      billing_address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      shipping_address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tax_exempt: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      tax_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      total_spent: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      total_orders: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      last_order_date: {
        type: Sequelize.DATE,
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

    // Create customer addresses table for multiple addresses
    await queryInterface.createTable('customer_addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address_line1: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address_line2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      type: {
        type: Sequelize.ENUM('billing', 'shipping', 'both'),
        defaultValue: 'both'
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
    await queryInterface.addIndex('customers', ['email']);
    await queryInterface.addIndex('customers', ['phone']);
    await queryInterface.addIndex('customers', ['user_id']);
    await queryInterface.addIndex('customers', ['company_id']);
    await queryInterface.addIndex('customers', ['status']);

    await queryInterface.addIndex('customer_addresses', ['customer_id']);
    await queryInterface.addIndex('customer_addresses', ['is_default']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('customer_addresses');
    await queryInterface.dropTable('customers');
  }
}; 