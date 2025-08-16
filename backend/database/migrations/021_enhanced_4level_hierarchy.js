/**
 * Enhanced 4-Level Hierarchy Migration
 * This migration creates a comprehensive 4-level hierarchy:
 * Brand → Category → Subcategory → Product Type
 * 
 * Structure:
 * - Brands (indikriti, winsomeLane) - already exists in products.brand enum
 * - Categories (brand-specific) - already exists (indikriti_categories, winsomelane_categories)
 * - Subcategories (category-specific, brand-specific)
 * - Product Types (subcategory-specific, brand-specific)
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('Creating enhanced 4-level hierarchy...');
      
      // Step 1: Create brand-specific subcategory tables
      await queryInterface.createTable('indikriti_subcategories', {
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
        category_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'indikriti_categories',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
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
      
      await queryInterface.createTable('winsomelane_subcategories', {
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
        category_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'winsomelane_categories',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
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
      
      // Step 2: Create brand-specific product type tables
      await queryInterface.createTable('indikriti_product_types', {
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
        subcategory_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'indikriti_subcategories',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
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
      
      await queryInterface.createTable('winsomelane_product_types', {
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
        subcategory_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'winsomelane_subcategories',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
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
      
      // Step 3: Update products table to include subcategory and brand-specific product type references
      await queryInterface.addColumn('products', 'indikriti_subcategory_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'indikriti_subcategories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }, { transaction });
      
      await queryInterface.addColumn('products', 'winsomelane_subcategory_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'winsomelane_subcategories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }, { transaction });
      
      await queryInterface.addColumn('products', 'indikriti_product_type_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'indikriti_product_types',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }, { transaction });
      
      await queryInterface.addColumn('products', 'winsomelane_product_type_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'winsomelane_product_types',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }, { transaction });
      
      // Step 4: Seed sample data for the hierarchy
      // Indikriti Subcategories
      await queryInterface.bulkInsert('indikriti_subcategories', [
        // Bedsheets subcategories
        { name: 'Cotton Bedsheets', description: 'Premium cotton bedsheets', category_id: 1, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Silk Bedsheets', description: 'Luxurious silk bedsheets', category_id: 1, sort_order: 2, created_at: new Date(), updated_at: new Date() },
        // Runners subcategories
        { name: 'Table Runners', description: 'Decorative table runners', category_id: 2, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Bed Runners', description: 'Elegant bed runners', category_id: 2, sort_order: 2, created_at: new Date(), updated_at: new Date() },
        // Suits subcategories
        { name: 'Traditional Suits', description: 'Traditional Indian suits', category_id: 3, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Modern Suits', description: 'Contemporary suit designs', category_id: 3, sort_order: 2, created_at: new Date(), updated_at: new Date() }
      ], { transaction });
      
      // Winsome Lane Subcategories
      await queryInterface.bulkInsert('winsomelane_subcategories', [
        // Shirts subcategories
        { name: 'Casual Shirts', description: 'Comfortable casual shirts', category_id: 1, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Formal Shirts', description: 'Professional formal shirts', category_id: 1, sort_order: 2, created_at: new Date(), updated_at: new Date() },
        // Dresses subcategories
        { name: 'Party Dresses', description: 'Elegant party wear dresses', category_id: 2, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Casual Dresses', description: 'Comfortable everyday dresses', category_id: 2, sort_order: 2, created_at: new Date(), updated_at: new Date() },
        // Accessories subcategories
        { name: 'Jewelry', description: 'Fashion jewelry and accessories', category_id: 3, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Bags', description: 'Stylish bags and purses', category_id: 3, sort_order: 2, created_at: new Date(), updated_at: new Date() }
      ], { transaction });

      // Step 5: Seed sample product types
      // Indikriti Product Types
      await queryInterface.bulkInsert('indikriti_product_types', [
        // Cotton Bedsheets product types
        { name: 'Single Cotton', description: 'Single bed cotton sheets', subcategory_id: 1, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Double Cotton', description: 'Double bed cotton sheets', subcategory_id: 1, sort_order: 2, created_at: new Date(), updated_at: new Date() },
        // Silk Bedsheets product types
        { name: 'Single Silk', description: 'Single bed silk sheets', subcategory_id: 2, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Double Silk', description: 'Double bed silk sheets', subcategory_id: 2, sort_order: 2, created_at: new Date(), updated_at: new Date() },
        // Table Runners product types
        { name: 'Short Runner', description: 'Short decorative table runners', subcategory_id: 3, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Long Runner', description: 'Long decorative table runners', subcategory_id: 3, sort_order: 2, created_at: new Date(), updated_at: new Date() },
        // Traditional Suits product types
        { name: 'Kurta Set', description: 'Traditional kurta with pajama', subcategory_id: 5, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Sherwani', description: 'Formal traditional sherwani', subcategory_id: 5, sort_order: 2, created_at: new Date(), updated_at: new Date() }
      ], { transaction });

      // Winsome Lane Product Types
      await queryInterface.bulkInsert('winsomelane_product_types', [
        // Casual Shirts product types
        { name: 'T-Shirt', description: 'Comfortable cotton t-shirts', subcategory_id: 1, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Polo Shirt', description: 'Casual polo shirts', subcategory_id: 1, sort_order: 2, created_at: new Date(), updated_at: new Date() },
        // Formal Shirts product types
        { name: 'Business Shirt', description: 'Professional business shirts', subcategory_id: 2, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Dress Shirt', description: 'Formal dress shirts', subcategory_id: 2, sort_order: 2, created_at: new Date(), updated_at: new Date() },
        // Party Dresses product types
        { name: 'Cocktail Dress', description: 'Elegant cocktail dresses', subcategory_id: 3, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Evening Gown', description: 'Formal evening gowns', subcategory_id: 3, sort_order: 2, created_at: new Date(), updated_at: new Date() },
        // Jewelry product types
        { name: 'Necklace', description: 'Fashion necklaces', subcategory_id: 5, sort_order: 1, created_at: new Date(), updated_at: new Date() },
        { name: 'Earrings', description: 'Stylish earrings', subcategory_id: 5, sort_order: 2, created_at: new Date(), updated_at: new Date() }
      ], { transaction });

      await transaction.commit();
      console.log('Enhanced 4-level hierarchy created successfully!');
      
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating enhanced 4-level hierarchy:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('Reverting enhanced 4-level hierarchy...');
      
      // Remove columns from products table
      await queryInterface.removeColumn('products', 'indikriti_subcategory_id', { transaction });
      await queryInterface.removeColumn('products', 'winsomelane_subcategory_id', { transaction });
      await queryInterface.removeColumn('products', 'indikriti_product_type_id', { transaction });
      await queryInterface.removeColumn('products', 'winsomelane_product_type_id', { transaction });
      
      // Drop tables
      await queryInterface.dropTable('indikriti_product_types', { transaction });
      await queryInterface.dropTable('winsomelane_product_types', { transaction });
      await queryInterface.dropTable('indikriti_subcategories', { transaction });
      await queryInterface.dropTable('winsomelane_subcategories', { transaction });
      
      await transaction.commit();
      console.log('Enhanced 4-level hierarchy reverted successfully!');
      
    } catch (error) {
      await transaction.rollback();
      console.error('Error reverting enhanced 4-level hierarchy:', error);
      throw error;
    }
  }
};
