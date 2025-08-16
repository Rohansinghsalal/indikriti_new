/**
 * Setup Database Script
 * Creates the MySQL database if it doesn't exist
 */
'use strict';

const mysql = require('mysql2/promise');
const logger = require('./utils/logger');
require('dotenv').config();

// Database connection parameters without database name
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
};

// Database name to create
const dbName = process.env.DB_NAME || 'admin';

// Create database if it doesn't exist
const setupDatabase = async () => {
  let connection;

  try {
    logger.info('Setting up database...');
    
    // Create connection without database selection
    connection = await mysql.createConnection(dbConfig);
    
    // Check if database exists
    const [rows] = await connection.execute(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbName}'`
    );
    
    if (rows.length === 0) {
      // Create database if it doesn't exist
      logger.info(`Database '${dbName}' does not exist. Creating...`);
      await connection.execute(`CREATE DATABASE ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      logger.info(`Database '${dbName}' created successfully.`);
    } else {
      logger.info(`Database '${dbName}' already exists.`);
    }
    
    logger.info('Database setup completed successfully.');
    return true;
  } catch (error) {
    logger.error('Error setting up database:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Run the script
const run = async () => {
  try {
    await setupDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Database setup failed:', error);
    process.exit(1);
  }
};

// Run if this script is called directly
if (require.main === module) {
  run();
}

module.exports = { setupDatabase }; 