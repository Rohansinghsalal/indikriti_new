/**
 * Database Migrator
 * Script to run database migrations
 */
'use strict';

const path = require('path');
const fs = require('fs');
const { sequelize } = require('./connection');
const logger = require('../utils/logger');
const { Umzug, SequelizeStorage } = require('umzug');

// Configure migration settings
const umzug = new Umzug({
  migrations: {
    glob: ['./migrations/*.js', { cwd: __dirname }],
    resolve: ({ name, path, context }) => {
      const migration = require(path);
      return {
        name,
        up: async () => migration.up(context.queryInterface, context.Sequelize),
        down: async () => migration.down(context.queryInterface, context.Sequelize)
      };
    }
  },
  context: {
    queryInterface: sequelize.getQueryInterface(),
    Sequelize: sequelize.Sequelize
  },
  storage: new SequelizeStorage({ sequelize }),
  logger: {
    info: (message) => logger.info(message),
    warn: (message) => logger.warn(message),
    error: (message) => logger.error(message),
    debug: (message) => logger.debug(message)
  }
});

// Run migrations up
const migrate = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    const migrations = await umzug.up();
    
    if (migrations.length === 0) {
      logger.info('No new migrations to run.');
    } else {
      logger.info(`Executed ${migrations.length} migrations: ${migrations.map(m => m.file || m.name).join(', ')}`);
    }
    
    return migrations;
  } catch (error) {
    logger.error('Error running migrations:', error);
    throw error;
  }
};

// Rollback migrations
const rollback = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    const migration = await umzug.down();
    
    if (migration) {
      logger.info(`Rolled back migration: ${migration.file || migration.name}`);
    } else {
      logger.info('No migrations to rollback.');
    }
    
    return migration;
  } catch (error) {
    logger.error('Error rolling back migration:', error);
    throw error;
  }
};

// Reset all migrations
const reset = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    const migrations = await umzug.down({ to: 0 });
    
    if (migrations.length === 0) {
      logger.info('No migrations to reset.');
    } else {
      logger.info(`Reset ${migrations.length} migrations.`);
    }
    
    return migrations;
  } catch (error) {
    logger.error('Error resetting migrations:', error);
    throw error;
  }
};

// Get pending migrations
const pending = async () => {
  try {
    const migrations = await umzug.pending();
    logger.info(`Pending migrations: ${migrations.length}`);
    migrations.forEach(migration => {
      logger.info(`- ${migration.file || migration.name}`);
    });
    return migrations;
  } catch (error) {
    logger.error('Error checking pending migrations:', error);
    throw error;
  }
};

// Get executed migrations
const executed = async () => {
  try {
    const migrations = await umzug.executed();
    logger.info(`Executed migrations: ${migrations.length}`);
    migrations.forEach(migration => {
      logger.info(`- ${migration.file || migration.name}`);
    });
    return migrations;
  } catch (error) {
    logger.error('Error checking executed migrations:', error);
    throw error;
  }
};

// Handle command line arguments
const command = process.argv[2];

if (require.main === module) {
  let promise;
  
  switch (command) {
    case 'up':
    case 'migrate':
      promise = migrate();
      break;
    case 'down':
    case 'rollback':
      promise = rollback();
      break;
    case 'reset':
      promise = reset();
      break;
    case 'pending':
      promise = pending();
      break;
    case 'executed':
      promise = executed();
      break;
    default:
      logger.error(`Unknown command: ${command}`);
      logger.info('Available commands: up/migrate, down/rollback, reset, pending, executed');
      process.exit(1);
  }
  
  promise
    .then(() => {
      logger.info('Migration command completed successfully');
      process.exit(0);
    })
    .catch(error => {
      logger.error(`Migration error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = {
  migrate,
  rollback,
  reset,
  pending,
  executed
}; 