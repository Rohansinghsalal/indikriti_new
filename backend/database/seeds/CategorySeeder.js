/**
 * Category Seeder
 * Creates default product categories
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if categories table exists first
      const [tables] = await queryInterface.sequelize.query(
        `SHOW TABLES LIKE 'categories'`
      );

      if (tables.length === 0) {
        console.log('Categories table does not exist, skipping category seeder');
        return Promise.resolve();
      }

      // Check if categories already exist
      const [existingCategories] = await queryInterface.sequelize.query(
        `SELECT COUNT(*) as count FROM categories`
      );

      if (existingCategories[0].count > 0) {
        console.log('Categories already exist, skipping category seeder');
        return Promise.resolve();
      }

      const now = new Date();

      // Find default company ID
      const [companies] = await queryInterface.sequelize.query(
        `SELECT id FROM companies LIMIT 1`
      );

      if (companies.length === 0) {
        console.log('No companies found. Skipping category seeding.');
        return Promise.resolve();
      }

      const defaultCompanyId = companies[0].id;
    
      // Create parent categories first (removed slug column)
      const parentCategories = [
        {
          name: 'Electronics',
          description: 'Electronic devices and accessories',
          created_at: now,
          updated_at: now
        },
        {
          name: 'Clothing',
          description: 'Apparel and fashion items',
          created_at: now,
          updated_at: now
        },
        {
          name: 'Home & Kitchen',
          description: 'Products for home and kitchen use',
          created_at: now,
          updated_at: now
        },
        {
          name: 'Books',
          description: 'Books and publications',
          created_at: now,
          updated_at: now
        }
      ];
    
      await queryInterface.bulkInsert('categories', parentCategories);

      console.log('Category seeder executed successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Error in category seeder:', error);
      return Promise.reject(error);
    }
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories', null, {});
  }
};