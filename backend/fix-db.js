/**
 * Fix Database Script
 * This script fixes database issues by directly creating the admin user
 */
'use strict';

const { sequelize } = require('./database/fixed-connection');
const logger = require('./utils/logger');
const bcrypt = require('bcryptjs');

// Using MySQL database

// Create admin user
const createAdmin = async () => {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Check if admin exists
    const adminExists = await sequelize.query(
      `SELECT * FROM admins WHERE email = 'admin@example.com'`,
      { type: sequelize.Sequelize.QueryTypes.SELECT }
    );

    if (adminExists.length === 0) {
      // Create admin user using MySQL syntax
      await sequelize.query(`
        INSERT INTO admins (
          first_name, last_name, email, password,
          department, status, access_level, is_super_admin,
          created_at, updated_at
        ) VALUES (
          'Admin', 'User', 'admin@example.com', '${hashedPassword}',
          'IT', 'active', 'full', 1,
          NOW(), NOW()
        )
      `);
      logger.info('Admin user created successfully');
    } else {
      logger.info('Admin user already exists');
    }

    return true;
  } catch (error) {
    logger.error('Error creating admin user:', error);
    throw error;
  }
};

// Run the script
const run = async () => {
  try {
    logger.info('Starting database fix script...');
    
    // Connect to database
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    // Create admin user
    await createAdmin();
    
    logger.info('Database fix script completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error in database fix script:', error);
    process.exit(1);
  }
};

run();