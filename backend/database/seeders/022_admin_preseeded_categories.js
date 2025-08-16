/**
 * Admin Pre-seeded Categories Seeder
 * Creates initial top-level categories for both brands:
 * - Handloom
 * - Handicraft  
 * - Jewelry
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    // Admin pre-seeded categories
    const adminCategories = [
      {
        name: 'Handloom',
        description: 'Traditional handwoven textiles and fabrics',
        status: 'active',
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Handicraft',
        description: 'Handmade crafts and artisanal products',
        status: 'active',
        sort_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Jewelry',
        description: 'Traditional and contemporary jewelry pieces',
        status: 'active',
        sort_order: 3,
        created_at: now,
        updated_at: now
      }
    ];

    try {
      console.log('Seeding admin pre-seeded categories for Indikriti...');
      
      // Insert categories for Indikriti brand
      await queryInterface.bulkInsert('indikriti_categories', adminCategories);
      
      console.log('Seeding admin pre-seeded categories for Winsome Lane...');
      
      // Insert categories for Winsome Lane brand
      await queryInterface.bulkInsert('winsomelane_categories', adminCategories);
      
      console.log('Admin pre-seeded categories seeded successfully for both brands!');
      
    } catch (error) {
      console.error('Error seeding admin pre-seeded categories:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      console.log('Removing admin pre-seeded categories...');
      
      // Remove categories from both brand tables
      await queryInterface.bulkDelete('indikriti_categories', {
        name: ['Handloom', 'Handicraft', 'Jewelry']
      });
      
      await queryInterface.bulkDelete('winsomelane_categories', {
        name: ['Handloom', 'Handicraft', 'Jewelry']
      });
      
      console.log('Admin pre-seeded categories removed successfully!');
      
    } catch (error) {
      console.error('Error removing admin pre-seeded categories:', error);
      throw error;
    }
  }
};
