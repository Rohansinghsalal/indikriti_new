/**
 * Products Table Migration
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
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
      sku: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      cost_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      sale_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      tax_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0.00
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'draft', 'archived'),
        defaultValue: 'active'
      },
      barcode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      weight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      weight_unit: {
        type: Sequelize.ENUM('kg', 'g', 'lb', 'oz'),
        defaultValue: 'kg',
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING,
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
      updated_by: {
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
    await queryInterface.addIndex('products', ['sku']);
    await queryInterface.addIndex('products', ['name']);
    await queryInterface.addIndex('products', ['company_id']);
    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
}; 