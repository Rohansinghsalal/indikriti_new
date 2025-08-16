const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

async function up() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        logo VARCHAR(255),
        email VARCHAR(255) COMMENT 'Company email address',
        phone VARCHAR(50),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        postal_code VARCHAR(50),
        website VARCHAR(255),
        status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Companies table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating companies table:', error);
    return false;
  }
}

async function down() {
  try {
    await sequelize.query('DROP TABLE IF EXISTS companies;');
    console.log('Companies table dropped successfully');
    return true;
  } catch (error) {
    console.error('Error dropping companies table:', error);
    return false;
  }
}

module.exports = {
  up,
  down
}; 