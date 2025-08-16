const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

async function up() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        is_system BOOLEAN DEFAULT false COMMENT 'If true, this role cannot be modified or deleted by users',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Roles table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating roles table:', error);
    return false;
  }
}

async function down() {
  try {
    await sequelize.query('DROP TABLE IF EXISTS roles;');
    console.log('Roles table dropped successfully');
    return true;
  } catch (error) {
    console.error('Error dropping roles table:', error);
    return false;
  }
}

module.exports = {
  up,
  down
}; 