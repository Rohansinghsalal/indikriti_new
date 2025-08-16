/**
 * Test Models Script
 * This script tests the database models
 */
const { sequelize } = require('./database/connection');
const logger = require('./utils/logger');

// Import models
const User = require('./models/User')(sequelize, require('sequelize').DataTypes);
const Role = require('./models/Role')(sequelize, require('sequelize').DataTypes);
const Company = require('./models/Company')(sequelize, require('sequelize').DataTypes);

// Test connection and models
async function testModels() {
  try {
    // Test connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    // Test User model
    const users = await User.findAll({
      attributes: ['id', 'first_name', 'last_name', 'email', 'status'],
      limit: 5
    });
    logger.info(`Found ${users.length} users`);
    
    // Test Role model
    const roles = await Role.findAll({
      attributes: ['id', 'name', 'description']
    });
    logger.info(`Found ${roles.length} roles`);
    
    // Test Company model
    const companies = await Company.findAll({
      attributes: ['id', 'name', 'email', 'status']
    });
    logger.info(`Found ${companies.length} companies`);
    
    logger.info('All models tested successfully');
    return true;
  } catch (error) {
    logger.error(`Error testing models: ${error.message}`);
    return false;
  }
}

// Run the test
testModels()
  .then(success => {
    if (success) {
      logger.info('Models test completed successfully');
      process.exit(0);
    } else {
      logger.error('Models test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }); 