/**
 * Payments Table Migration
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
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
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded', 'partially_refunded'),
        defaultValue: 'pending'
      },
      payment_details: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON string containing payment gateway details'
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

    // Create refunds table
    await queryInterface.createTable('refunds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      payment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'payments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: false
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
      },
      refund_details: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON string containing refund gateway details'
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

    // Add indexes
    await queryInterface.addIndex('payments', ['order_id']);
    await queryInterface.addIndex('payments', ['customer_id']);
    await queryInterface.addIndex('payments', ['transaction_id']);
    await queryInterface.addIndex('payments', ['payment_method']);
    await queryInterface.addIndex('payments', ['status']);
    await queryInterface.addIndex('payments', ['company_id']);
    await queryInterface.addIndex('payments', ['created_at']);
    
    await queryInterface.addIndex('refunds', ['payment_id']);
    await queryInterface.addIndex('refunds', ['order_id']);
    await queryInterface.addIndex('refunds', ['transaction_id']);
    await queryInterface.addIndex('refunds', ['status']);
    await queryInterface.addIndex('refunds', ['company_id']);
    await queryInterface.addIndex('refunds', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('refunds');
    await queryInterface.dropTable('payments');
  }
}; 