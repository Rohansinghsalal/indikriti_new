/**
 * Brand-Specific Category Restructure Migration
 * This migration:
 * 1. Drops existing categories and subcategories tables
 * 2. Creates brand-specific category tables
 * 3. Updates products table to reference brand-specific categories
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Step 1: Backup existing data (optional - for safety)
      console.log('Starting brand-specific category restructure...');
      
      // Step 2: Remove foreign key constraints from products table
      // Check and remove existing foreign key constraints
      try {
        await queryInterface.removeConstraint('products', 'products_ibfk_89', { transaction });
      } catch (error) {
        console.log('Constraint products_ibfk_89 does not exist, skipping...');
      }

      try {
        await queryInterface.removeConstraint('products', 'products_ibfk_90', { transaction });
      } catch (error) {
        console.log('Constraint products_ibfk_90 does not exist, skipping...');
      }
      
      // Step 3: Drop existing tables
      await queryInterface.dropTable('subcategories', { transaction });
      await queryInterface.dropTable('categories', { transaction });
      
      // Step 4: Create Indikriti Categories table
      await queryInterface.createTable('indikriti_categories', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        status: {
          type: Sequelize.ENUM('active', 'inactive'),
          defaultValue: 'active'
        },
        sort_order: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });
      
      // Step 5: Create Winsome Lane Categories table
      await queryInterface.createTable('winsomelane_categories', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        status: {
          type: Sequelize.ENUM('active', 'inactive'),
          defaultValue: 'active'
        },
        sort_order: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });
      
      // Step 6: Update products table structure
      // Remove subcategory_id column as we're simplifying the structure
      await queryInterface.removeColumn('products', 'subcategory_id', { transaction });
      
      // Add brand-specific category columns
      await queryInterface.addColumn('products', 'indikriti_category_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'indikriti_categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }, { transaction });
      
      await queryInterface.addColumn('products', 'winsomelane_category_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'winsomelane_categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }, { transaction });
      
      // Step 7: Remove the old category_id column
      await queryInterface.removeColumn('products', 'category_id', { transaction });
      
      // Step 8: Insert default categories for both brands
      await queryInterface.bulkInsert('indikriti_categories', [
        {
          name: 'Bedsheets',
          description: 'Premium bedsheets and bed linens',
          status: 'active',
          sort_order: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Runners',
          description: 'Table runners and decorative runners',
          status: 'active',
          sort_order: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Suits',
          description: 'Traditional and modern suits',
          status: 'active',
          sort_order: 3,
          created_at: new Date(),
          updated_at: new Date()
        }
      ], { transaction });
      
      await queryInterface.bulkInsert('winsomelane_categories', [
        {
          name: 'Shirts',
          description: 'Casual and formal shirts',
          status: 'active',
          sort_order: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Dresses',
          description: 'Elegant dresses for all occasions',
          status: 'active',
          sort_order: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Accessories',
          description: 'Fashion accessories and jewelry',
          status: 'active',
          sort_order: 3,
          created_at: new Date(),
          updated_at: new Date()
        }
      ], { transaction });
      
      await transaction.commit();
      console.log('Brand-specific category restructure completed successfully!');
      
    } catch (error) {
      await transaction.rollback();
      console.error('Error during brand-specific category restructure:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('Reverting brand-specific category restructure...');
      
      // Remove brand-specific category columns from products
      await queryInterface.removeColumn('products', 'indikriti_category_id', { transaction });
      await queryInterface.removeColumn('products', 'winsomelane_category_id', { transaction });
      
      // Drop brand-specific category tables
      await queryInterface.dropTable('indikriti_categories', { transaction });
      await queryInterface.dropTable('winsomelane_categories', { transaction });
      
      // Recreate original categories table
      await queryInterface.createTable('categories', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        product_type_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'product_types',
            key: 'id'
          }
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });
      
      // Recreate original subcategories table
      await queryInterface.createTable('subcategories', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        category_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'categories',
            key: 'id'
          }
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });
      
      // Add back original columns to products table
      await queryInterface.addColumn('products', 'category_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: {
          model: 'categories',
          key: 'id'
        }
      }, { transaction });
      
      await queryInterface.addColumn('products', 'subcategory_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'subcategories',
          key: 'id'
        }
      }, { transaction });
      
      await transaction.commit();
      console.log('Brand-specific category restructure reverted successfully!');
      
    } catch (error) {
      await transaction.rollback();
      console.error('Error reverting brand-specific category restructure:', error);
      throw error;
    }
  }
};
