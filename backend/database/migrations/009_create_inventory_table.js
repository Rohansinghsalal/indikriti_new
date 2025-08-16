/**
 * Inventory Table Migration
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('inventory', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      reorder_threshold: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
      },
      reorder_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      last_restock_date: {
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create inventory history table
    await queryInterface.createTable('inventory_history', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity_change: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      previous_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      new_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Reference to order, adjustment, etc.'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
      }
    });

    // Add indexes
    await queryInterface.addIndex('inventory', ['product_id']);
    await queryInterface.addIndex('inventory', ['company_id']);
    await queryInterface.addIndex('inventory', ['quantity']);
    
    await queryInterface.addIndex('inventory_history', ['product_id']);
    await queryInterface.addIndex('inventory_history', ['reference']);
    await queryInterface.addIndex('inventory_history', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('inventory_history');
    await queryInterface.dropTable('inventory');
  }
}; 