/**
 * Test MySQL Connection
 * Simple script to test the MySQL connection
 */
'use strict';

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Database connection parameters
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
};

// Test connection to MySQL server
async function testMySQLConnection() {
  let connection;
  
  try {
    logger.info('Testing MySQL connection...');
    logger.info('Connection parameters:');
    logger.info(`Host: ${dbConfig.host}`);
    logger.info(`Port: ${dbConfig.port}`);
    logger.info(`User: ${dbConfig.user}`);
    logger.info(`Password: ${dbConfig.password ? '******' : 'Not set'}`);
    
    // Connect to MySQL server without selecting a database
    connection = await mysql.createConnection(dbConfig);
    logger.info('Successfully connected to MySQL server!');
    
    // Check which databases exist
    const [databases] = await connection.execute('SHOW DATABASES');
    logger.info('Available databases:');
    databases.forEach(db => {
      logger.info(`- ${db.Database}`);
    });
    
    // Check if our database exists
    const dbName = process.env.DB_NAME || 'admin';
    const dbExists = databases.some(db => db.Database === dbName);
    
    if (dbExists) {
      logger.info(`Database '${dbName}' exists.`);
      
      // Connect to the database
      await connection.changeUser({ database: dbName });
      
      // Check tables
      const [tables] = await connection.execute('SHOW TABLES');
      
      if (tables.length === 0) {
        logger.info(`Database '${dbName}' has no tables.`);
      } else {
        logger.info(`Tables in '${dbName}':`, tables);
      }
    } else {
      logger.info(`Database '${dbName}' does not exist.`);
    }
    
    return true;
  } catch (error) {
    logger.error('Failed to connect to MySQL:', error);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the test
(async () => {
  try {
    // Print environment variables
    logger.info('Environment variables:');
    logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
    logger.info(`DB_DIALECT: ${process.env.DB_DIALECT}`);
    logger.info(`DB_HOST: ${process.env.DB_HOST}`);
    logger.info(`DB_PORT: ${process.env.DB_PORT}`);
    logger.info(`DB_NAME: ${process.env.DB_NAME}`);
    logger.info(`DB_USER: ${process.env.DB_USER}`);
    
    const connected = await testMySQLConnection();
    
    if (connected) {
      logger.info('MySQL connection test completed successfully.');
      process.exit(0);
    } else {
      logger.error('MySQL connection test failed.');
      process.exit(1);
    }
  } catch (error) {
    logger.error('Error during MySQL connection test:', error);
    process.exit(1);
  }
})(); 