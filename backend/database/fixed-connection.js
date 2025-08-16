/**
 * Fixed Database connection
 * Handles database connections using Sequelize
 */
const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
require('dotenv').config();

// Use MySQL database configuration
logger.info('Using MySQL database for fixed connection');
const dbConfig = {
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'admin',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define,
    pool: dbConfig.pool
  }
);

// Test connection function
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  Sequelize
}; 