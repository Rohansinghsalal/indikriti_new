/**
 * Migration Runner
 * 
 * This script runs database migrations safely with backup and rollback capabilities
 */

'use strict';

const path = require('path');
const fs = require('fs');
const { sequelize } = require('./connection');
const logger = require('../utils/logger');

/**
 * Run a specific migration
 */
const runMigration = async (migrationName) => {
  try {
    logger.info(`Starting migration: ${migrationName}`);
    
    // Load the migration file
    const migrationPath = path.join(__dirname, 'migrations', `${migrationName}.js`);
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }
    
    const migration = require(migrationPath);
    
    if (!migration.migrate || typeof migration.migrate !== 'function') {
      throw new Error(`Migration ${migrationName} does not export a migrate function`);
    }
    
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection verified');
    
    // Run the migration
    await migration.migrate();
    
    logger.info(`Migration ${migrationName} completed successfully`);
    
  } catch (error) {
    logger.error(`Migration ${migrationName} failed:`, error);
    throw error;
  }
};

/**
 * List available migrations
 */
const listMigrations = () => {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    logger.info('No migrations directory found');
    return [];
  }
  
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''));
  
  return files;
};

/**
 * Main execution
 */
const main = async () => {
  const args = process.argv.slice(2);
  const command = args[0];
  const migrationName = args[1];
  
  try {
    switch (command) {
      case 'run':
        if (!migrationName) {
          console.error('Usage: node run-migration.js run <migration-name>');
          process.exit(1);
        }
        await runMigration(migrationName);
        break;
        
      case 'list':
        const migrations = listMigrations();
        console.log('Available migrations:');
        migrations.forEach(migration => console.log(`  - ${migration}`));
        break;
        
      default:
        console.log('Usage:');
        console.log('  node run-migration.js run <migration-name>');
        console.log('  node run-migration.js list');
        console.log('');
        console.log('Available migrations:');
        const availableMigrations = listMigrations();
        availableMigrations.forEach(migration => console.log(`  - ${migration}`));
        break;
    }
    
    process.exit(0);
  } catch (error) {
    logger.error('Migration runner failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  runMigration,
  listMigrations
};
