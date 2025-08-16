/**
 * Database connection
 * Handles database connections using Sequelize
 */
const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Log the database configuration
console.log('Database Configuration:');
console.log(`Dialect: ${config.dialect}`);
console.log(`Host: ${config.host}`);
console.log(`Port: ${config.port}`);
console.log(`Database: ${config.database}`);
console.log(`Username: ${config.username}`);
console.log(`Password: ${config.password ? '******' : 'Not set'}`);

// Create Sequelize instance for MySQL
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging ? console.log : false,
    pool: config.pool,
    define: {
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      ...config.define
    },
    dialectOptions: config.dialectOptions
  }
);

// Test connection function
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

// Query function for raw SQL queries (temporary fix)
const query = async (sql, params = []) => {
  try {
    // For SELECT queries, use SELECT type and return results directly
    const sqlLower = sql.toLowerCase().trim();

    if (sqlLower.startsWith('select')) {
      const results = await sequelize.query(sql, {
        replacements: params,
        type: Sequelize.QueryTypes.SELECT
      });
      return results;
    } else if (sqlLower.startsWith('insert')) {
      // For INSERT queries, return metadata with insertId
      const [results] = await sequelize.query(sql, {
        replacements: params,
        type: Sequelize.QueryTypes.INSERT
      });
      return { insertId: results };
    } else {
      // For other non-SELECT queries, use RAW type
      const [results, metadata] = await sequelize.query(sql, {
        replacements: params,
        type: Sequelize.QueryTypes.RAW
      });
      return results;
    }
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  Sequelize,
  query
};