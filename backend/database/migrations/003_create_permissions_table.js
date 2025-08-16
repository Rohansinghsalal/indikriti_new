const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

async function up() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        module VARCHAR(255) NOT NULL COMMENT 'The module this permission belongs to (e.g., users, products)',
        action VARCHAR(255) NOT NULL COMMENT 'The action this permission allows (e.g., create, read, update, delete)',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Permissions table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating permissions table:', error);
    return false;
  }
}

async function down() {
  try {
    await sequelize.query('DROP TABLE IF EXISTS permissions;');
    console.log('Permissions table dropped successfully');
    return true;
  } catch (error) {
    console.error('Error dropping permissions table:', error);
    return false;
  }
}

module.exports = {
  up,
  down
}; 