/**
 * Models Index - Standard Sequelize Model Loading
 */

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const logger = require('../utils/logger');

// Get database connection
const { sequelize } = require('../database/connection');

const db = {};

// Import all models in the directory
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) &&
           (file !== basename) &&
           (file.slice(-3) === '.js') &&
           (file !== 'index.js');
  })
  .forEach(file => {
    try {
      const model = require(path.join(__dirname, file));
      if (model.name) {
        db[model.name] = model;
      }
    } catch (error) {
      logger.error(`Error importing model from file ${file}:`, error);
    }
  });

// Import product models manually to ensure they're loaded correctly
try {
  // Note: Old ProductType model removed - using brand-specific models only
  db.IndikritiBrandCategory = require('./IndikritiBrandCategory');
  db.WinsomeLaneBrandCategory = require('./WinsomeLaneBrandCategory');
  db.IndikritiBrandSubcategory = require('./IndikritiBrandSubcategory');
  db.WinsomeLaneBrandSubcategory = require('./WinsomeLaneBrandSubcategory');
  db.IndikritiBrandProductType = require('./IndikritiBrandProductType');
  db.WinsomeLaneBrandProductType = require('./WinsomeLaneBrandProductType');
  db.Product = require('./Product');
  db.ProductImage = require('./ProductImage');

  logger.info('Product models imported successfully');
} catch (error) {
  logger.error('Error manually importing models:', error);
}

// Set up associations for all models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add database connection
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Function to sync all models
db.syncModels = async function syncModels() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    logger.info('All models were synchronized successfully.');
    
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database or sync models:', error);
    return false;
  }
};

module.exports = db;
