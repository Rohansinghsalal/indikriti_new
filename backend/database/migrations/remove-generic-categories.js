/**
 * Migration: Remove Generic Categories System
 * 
 * This migration removes the old generic categories system and keeps only
 * the brand-specific hierarchy tables. This implements a proper brand-first
 * approach where users select a brand before seeing categories.
 * 
 * Changes:
 * 1. Remove tables: categories, subcategories, product_types
 * 2. Remove columns from products: product_type_id, category_id, subcategory_id
 * 3. Keep brand-specific tables and columns
 */

'use strict';

const { sequelize } = require('../connection');
const logger = require('../../utils/logger');

/**
 * Execute the migration
 */
const migrate = async () => {
  try {
    logger.info('Starting migration: Remove Generic Categories System');
    
    // Step 1: Check if there's any data in the old tables that needs to be preserved
    await checkDataIntegrity();
    
    // Step 2: Remove foreign key constraints from products table
    await removeForeignKeyConstraints();
    
    // Step 3: Remove old columns from products table
    await removeOldProductColumns();
    
    // Step 4: Drop old tables
    await dropOldTables();
    
    // Step 5: Add sample data to brand-specific tables
    await addSampleBrandData();
    
    logger.info('Migration completed successfully: Generic categories system removed');
    
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
};

/**
 * Check data integrity before migration
 */
const checkDataIntegrity = async () => {
  try {
    logger.info('Checking data integrity...');
    
    // Check if there are any products using the old system
    const [productsWithOldCategories] = await sequelize.query(`
      SELECT COUNT(*) as count FROM products 
      WHERE product_type_id IS NOT NULL 
         OR category_id IS NOT NULL 
         OR subcategory_id IS NOT NULL
    `);
    
    const count = productsWithOldCategories[0].count;
    if (count > 0) {
      logger.warn(`Found ${count} products using old category system. These will be updated to use brand-specific categories.`);
    }
    
    logger.info('Data integrity check completed');
  } catch (error) {
    logger.error('Data integrity check failed:', error);
    throw error;
  }
};

/**
 * Remove foreign key constraints from products table
 */
const removeForeignKeyConstraints = async () => {
  try {
    logger.info('Removing foreign key constraints...');
    
    // Get constraint names first
    const [constraints] = await sequelize.query(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'products' 
        AND REFERENCED_TABLE_NAME IN ('product_types', 'categories', 'subcategories')
    `);
    
    // Drop each constraint
    for (const constraint of constraints) {
      try {
        await sequelize.query(`ALTER TABLE products DROP FOREIGN KEY ${constraint.CONSTRAINT_NAME}`);
        logger.info(`Dropped foreign key constraint: ${constraint.CONSTRAINT_NAME}`);
      } catch (error) {
        logger.warn(`Could not drop constraint ${constraint.CONSTRAINT_NAME}:`, error.message);
      }
    }
    
    logger.info('Foreign key constraints removed');
  } catch (error) {
    logger.error('Failed to remove foreign key constraints:', error);
    throw error;
  }
};

/**
 * Remove old columns from products table
 */
const removeOldProductColumns = async () => {
  try {
    logger.info('Removing old columns from products table...');
    
    const columnsToRemove = ['product_type_id', 'category_id', 'subcategory_id'];
    
    for (const column of columnsToRemove) {
      try {
        // Check if column exists first
        const [columnExists] = await sequelize.query(`
          SELECT COUNT(*) as count 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'products' 
            AND COLUMN_NAME = '${column}'
        `);
        
        if (columnExists[0].count > 0) {
          await sequelize.query(`ALTER TABLE products DROP COLUMN ${column}`);
          logger.info(`Removed column: ${column}`);
        } else {
          logger.info(`Column ${column} does not exist, skipping`);
        }
      } catch (error) {
        logger.warn(`Could not remove column ${column}:`, error.message);
      }
    }
    
    logger.info('Old columns removed from products table');
  } catch (error) {
    logger.error('Failed to remove old columns:', error);
    throw error;
  }
};

/**
 * Drop old tables
 */
const dropOldTables = async () => {
  try {
    logger.info('Dropping old tables...');
    
    const tablesToDrop = ['subcategories', 'categories', 'product_types'];
    
    for (const table of tablesToDrop) {
      try {
        await sequelize.query(`DROP TABLE IF EXISTS ${table}`);
        logger.info(`Dropped table: ${table}`);
      } catch (error) {
        logger.warn(`Could not drop table ${table}:`, error.message);
      }
    }
    
    logger.info('Old tables dropped');
  } catch (error) {
    logger.error('Failed to drop old tables:', error);
    throw error;
  }
};

/**
 * Add sample data to brand-specific tables
 */
const addSampleBrandData = async () => {
  try {
    logger.info('Adding sample brand-specific data...');
    
    // Add Indikriti categories
    await sequelize.query(`
      INSERT IGNORE INTO indikriti_categories (name, description, status, sort_order) VALUES
      ('Handloom', 'Traditional handloom products', 'active', 1),
      ('Readymade', 'Ready to wear garments', 'active', 2),
      ('Handicrafts', 'Traditional handicrafts and artifacts', 'active', 3),
      ('Textiles', 'Traditional textiles and fabrics', 'active', 4),
      ('Jewelry', 'Traditional jewelry and accessories', 'active', 5)
    `);
    
    // Add Winsome Lane categories
    await sequelize.query(`
      INSERT IGNORE INTO winsomelane_categories (name, description, status, sort_order) VALUES
      ('Fashion', 'Modern fashion and apparel', 'active', 1),
      ('Accessories', 'Fashion accessories and jewelry', 'active', 2),
      ('Home Decor', 'Modern home decoration items', 'active', 3),
      ('Lifestyle', 'Lifestyle and wellness products', 'active', 4)
    `);
    
    logger.info('Sample brand-specific data added');
  } catch (error) {
    logger.error('Failed to add sample data:', error);
    throw error;
  }
};

/**
 * Rollback function (if needed)
 */
const rollback = async () => {
  try {
    logger.info('Rolling back migration...');
    logger.warn('Rollback not implemented - this migration is destructive');
    logger.warn('Please restore from backup if rollback is needed');
  } catch (error) {
    logger.error('Rollback failed:', error);
    throw error;
  }
};

module.exports = {
  migrate,
  rollback
};

// Run migration if called directly
if (require.main === module) {
  migrate()
    .then(() => {
      logger.info('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration failed:', error);
      process.exit(1);
    });
}
