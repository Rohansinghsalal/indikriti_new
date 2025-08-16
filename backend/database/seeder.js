/**
 * Database Seeder
 * Script to run database seeders
 */
'use strict';

const path = require('path');
const fs = require('fs');
const { sequelize } = require('./connection');
const logger = require('../utils/logger');

// List of seeders in order of execution
const seeders = [
  'CompanySeeder.js',
  'RoleSeeder.js',
  'PermissionSeeder.js',
  'AdminSeeder.js',
  'EmployeeSeeder.js',
  'UserSeeder.js',
  'CategorySeeder.js'
];

// Run all seeders
const seed = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    const seedersPath = path.join(__dirname, 'seeds');
    let successCount = 0;
    
    // Run each seeder in order
    for (const seederFile of seeders) {
      try {
        logger.info(`Running seeder: ${seederFile}`);
        const seederPath = path.join(seedersPath, seederFile);
        
        if (!fs.existsSync(seederPath)) {
          logger.error(`Seeder file not found: ${seederFile}`);
          continue;
        }
        
        const seeder = require(seederPath);
        
        // Check if seeder has up method (old style) or seed method (new style)
        if (typeof seeder.seed === 'function') {
          await seeder.seed(sequelize.getQueryInterface(), sequelize.Sequelize);
        } else if (typeof seeder.up === 'function') {
          await seeder.up(sequelize.getQueryInterface(), sequelize.Sequelize);
        } else {
          logger.warn(`Seeder ${seederFile} does not have a seed or up method`);
          continue;
        }
        
        logger.info(`Seeder ${seederFile} executed successfully`);
        successCount++;
      } catch (error) {
        logger.error(`Error executing seeder ${seederFile}:`, error);
      }
    }
    
    logger.info(`Seeding completed. ${successCount} of ${seeders.length} seeders executed successfully.`);
    return successCount;
  } catch (error) {
    logger.error('Error running seeders:', error);
    throw error;
  }
};

// Unseed (revert) all seeders in reverse order
const unseed = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    const seedersPath = path.join(__dirname, 'seeds');
    let successCount = 0;
    
    // Run each seeder in reverse order
    for (const seederFile of [...seeders].reverse()) {
      try {
        logger.info(`Reverting seeder: ${seederFile}`);
        const seederPath = path.join(seedersPath, seederFile);
        
        if (!fs.existsSync(seederPath)) {
          logger.error(`Seeder file not found: ${seederFile}`);
          continue;
        }
        
        const seeder = require(seederPath);
        
        // Check if seeder has down method (old style) or unseed method (new style)
        if (typeof seeder.unseed === 'function') {
          await seeder.unseed(sequelize.getQueryInterface(), sequelize.Sequelize);
        } else if (typeof seeder.down === 'function') {
          await seeder.down(sequelize.getQueryInterface(), sequelize.Sequelize);
        } else {
          logger.warn(`Seeder ${seederFile} does not have an unseed or down method`);
          continue;
        }
        
        logger.info(`Seeder ${seederFile} reverted successfully`);
        successCount++;
      } catch (error) {
        logger.error(`Error reverting seeder ${seederFile}:`, error);
      }
    }
    
    logger.info(`Unseeding completed. ${successCount} of ${seeders.length} seeders reverted successfully.`);
    return successCount;
  } catch (error) {
    logger.error('Error reverting seeders:', error);
    throw error;
  }
};

// Run specific seeder
const runSeeder = async (seederName) => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    const seederFile = `${seederName}.js`;
    const seederPath = path.join(__dirname, 'seeds', seederFile);
    
    if (!fs.existsSync(seederPath)) {
      logger.error(`Seeder file not found: ${seederFile}`);
      return false;
    }
    
    logger.info(`Running seeder: ${seederFile}`);
    const seeder = require(seederPath);
    
    // Check if seeder has up method (old style) or seed method (new style)
    if (typeof seeder.seed === 'function') {
      await seeder.seed(sequelize.getQueryInterface(), sequelize.Sequelize);
    } else if (typeof seeder.up === 'function') {
      await seeder.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    } else {
      logger.error(`Seeder ${seederFile} does not have a seed or up method`);
      return false;
    }
    
    logger.info(`Seeder ${seederFile} executed successfully`);
    return true;
  } catch (error) {
    logger.error(`Error running seeder ${seederName}:`, error);
    throw error;
  }
};

// Handle command line arguments
const command = process.argv[2];
const seederName = process.argv[3];

if (require.main === module) {
  let promise;
  
  switch (command) {
    case 'seed':
      promise = seed();
      break;
    case 'unseed':
      promise = unseed();
      break;
    case 'run':
      if (!seederName) {
        logger.error('Seeder name not specified');
        logger.info('Usage: node seeder.js run SeederName');
        process.exit(1);
      }
      promise = runSeeder(seederName);
      break;
    default:
      logger.error(`Unknown command: ${command}`);
      logger.info('Available commands: seed, unseed, run <SeederName>');
      process.exit(1);
  }
  
  promise
    .then(() => {
      logger.info('Seeder command completed successfully');
      process.exit(0);
    })
    .catch(error => {
      logger.error(`Seeder error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = {
  seed,
  unseed,
  runSeeder
}; 