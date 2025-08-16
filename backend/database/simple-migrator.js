/**
 * Simple Database Migrator for MySQL
 * This script handles database migrations for MySQL database
 */
'use strict';

const path = require('path');
const { sequelize } = require('./connection');
const logger = require('../utils/logger');

// MySQL-compatible schemas
const createTables = async () => {
  try {
    // Create roles table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    logger.info('Roles table created or already exists');

    // Create permissions table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    logger.info('Permissions table created or already exists');

    // Create companies table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        phone VARCHAR(50),
        email VARCHAR(255),
        website VARCHAR(255),
        logo VARCHAR(255),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    logger.info('Companies table created or already exists');

    // Create role_permissions table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    logger.info('Role_permissions table created or already exists');

    // Create admins table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        department VARCHAR(255),
        status ENUM('active', 'inactive') DEFAULT 'active',
        access_level ENUM('limited', 'full', 'super') DEFAULT 'limited',
        is_super_admin TINYINT(1) DEFAULT 0,
        role_id INT NULL,
        company_id INT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);
    logger.info('Admins table created or already exists');

    // Create users table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        avatar VARCHAR(255),
        status ENUM('pending', 'active', 'inactive', 'suspended') DEFAULT 'pending',
        last_login DATETIME,
        company_id INT,
        role_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB;
    `);
    logger.info('Users table created or already exists');

    // Create customers table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        company_id INT,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);
    logger.info('Customers table created or already exists');

    // Note: Old generic tables (product_types, categories, subcategories) removed
    // Using brand-specific tables only for proper brand-first hierarchy

    // Create brand-specific category tables
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS indikriti_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        status ENUM('active', 'inactive') DEFAULT 'active',
        sort_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    logger.info('Indikriti categories table created or already exists');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS winsomelane_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        status ENUM('active', 'inactive') DEFAULT 'active',
        sort_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    logger.info('Winsome Lane categories table created or already exists');

    // Create brand-specific subcategory tables
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS indikriti_subcategories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category_id INT NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        sort_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES indikriti_categories(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    logger.info('Indikriti subcategories table created or already exists');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS winsomelane_subcategories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category_id INT NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        sort_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES winsomelane_categories(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    logger.info('Winsome Lane subcategories table created or already exists');

    // Create brand-specific product type tables
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS indikriti_product_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        subcategory_id INT NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        sort_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (subcategory_id) REFERENCES indikriti_subcategories(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    logger.info('Indikriti product types table created or already exists');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS winsomelane_product_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        subcategory_id INT NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        sort_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (subcategory_id) REFERENCES winsomelane_subcategories(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    logger.info('Winsome Lane product types table created or already exists');

    // Create products table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(50) NOT NULL UNIQUE,
        sku VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        mrp DECIMAL(10,2) NOT NULL,
        selling_price DECIMAL(10,2),
        stock_quantity INT DEFAULT 0,
        batch_no VARCHAR(50),
        brand ENUM('indikriti', 'winsomeLane') NOT NULL,
        status ENUM('active', 'inactive', 'draft') DEFAULT 'draft',
        product_style VARCHAR(255),
        discount DECIMAL(10,2) DEFAULT 0,
        sale_price DECIMAL(10,2),
        special_discount DECIMAL(10,2) DEFAULT 0,
        final_price DECIMAL(10,2),
        referral_bonus DECIMAL(10,2) DEFAULT 0,
        loyalty_bonus DECIMAL(10,2) DEFAULT 0,
        hsn VARCHAR(50),
        gst DECIMAL(5,2) DEFAULT 0,
        long_description TEXT,
        usp1 VARCHAR(255),
        usp2 VARCHAR(255),
        usp3 VARCHAR(255),
        -- Brand-specific hierarchy columns
        indikriti_category_id INT,
        winsomelane_category_id INT,
        indikriti_subcategory_id INT,
        winsomelane_subcategory_id INT,
        indikriti_product_type_id INT,
        winsomelane_product_type_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (indikriti_category_id) REFERENCES indikriti_categories(id) ON DELETE SET NULL,
        FOREIGN KEY (winsomelane_category_id) REFERENCES winsomelane_categories(id) ON DELETE SET NULL,
        FOREIGN KEY (indikriti_subcategory_id) REFERENCES indikriti_subcategories(id) ON DELETE SET NULL,
        FOREIGN KEY (winsomelane_subcategory_id) REFERENCES winsomelane_subcategories(id) ON DELETE SET NULL,
        FOREIGN KEY (indikriti_product_type_id) REFERENCES indikriti_product_types(id) ON DELETE SET NULL,
        FOREIGN KEY (winsomelane_product_type_id) REFERENCES winsomelane_product_types(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);
    logger.info('Products table created or already exists');

    // Create inventory table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        location VARCHAR(255),
        company_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    logger.info('Inventory table created or already exists');

    // Create orders table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(255) NOT NULL,
        customer_id INT,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        payment_status ENUM('unpaid', 'paid', 'refunded', 'partial') DEFAULT 'unpaid',
        shipping_address TEXT,
        billing_address TEXT,
        notes TEXT,
        company_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    logger.info('Orders table created or already exists');

    // Create order_items table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB;
    `);
    logger.info('Order_items table created or already exists');

    // Create payments table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(255) NOT NULL,
        status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
        transaction_id VARCHAR(255),
        company_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    logger.info('Payments table created or already exists');

    // Create referrals table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS referrals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        referred_customer_id INT NOT NULL,
        status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
        reward_amount DECIMAL(10,2),
        company_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (referred_customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    logger.info('Referrals table created or already exists');

    // Create employees table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        position VARCHAR(255),
        department VARCHAR(255),
        admin_id INT,
        company_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    logger.info('Employees table created or already exists');

    // Note: Basic seeding moved to brand-specific tables
    // Use the migration script to populate brand-specific categories

    logger.info('All tables created successfully');
    return true;
  } catch (error) {
    logger.error('Error creating tables:', error);
    throw error;
  }
};

// Run the simple migrator
const run = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    // Create tables
    await createTables();
    
    logger.info('Simple database migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error in simple database migration:', error);
    process.exit(1);
  }
};

// Run if this script is called directly
if (require.main === module) {
  run();
}

module.exports = { run }; 