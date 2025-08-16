require('dotenv').config();
const { sequelize, syncModels } = require('./models');
const path = require('path');
const fs = require('fs');
const logger = require('./utils/logger');

// Import seed functions
const seedProductHierarchy = require('./database/seeds/ProductHierarchySeeder');

async function setupProductsDatabase() {
  try {
    logger.info('Starting product database setup...');
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'storage/uploads/products');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      logger.info(`Created uploads directory: ${uploadsDir}`);
    }
    
    // Sync database models
    logger.info('Syncing database models...');
    const synced = await syncModels();
    
    if (!synced) {
      logger.error('Failed to sync database models');
      process.exit(1);
    }
    
    logger.info('Database models synced successfully');
    
    // Seed product hierarchy data
    logger.info('Seeding product hierarchy data...');
    const hierarchySeeded = await seedProductHierarchy();
    
    if (!hierarchySeeded) {
      logger.error('Failed to seed product hierarchy data');
      process.exit(1);
    }
    
    logger.info('Product hierarchy data seeded successfully');
    
    logger.info('✅ Products database setup completed successfully!');
    logger.info('The database is now ready for use with the following structure:');
    logger.info('- Product Types (e.g., Handloom)');
    logger.info('- Categories (e.g., Bedsheets, Sarees, Suits)');
    logger.info('- Subcategories (e.g., Single Bedsheets, Cotton Sarees)');
    logger.info('- Products (ready for your product data)');
    
    logger.info('\nYou can now use the API to:');
    logger.info('1. Create products with the required hierarchy');
    logger.info('2. Upload product images (1 required, up to 3 total)');
    logger.info('3. Manage inventory, pricing, and other product details');
    
    process.exit(0);
  } catch (error) {
    logger.error('An error occurred during setup:', error);
    process.exit(1);
  }
}

// Run the setup
setupProductsDatabase(); 