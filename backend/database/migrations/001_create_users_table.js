const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

async function up() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        avatar VARCHAR(255),
        status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
        last_login DATETIME,
        company_id INT,
        role_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Users table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating users table:', error);
    return false;
  }
}

async function down() {
  try {
    await sequelize.query('DROP TABLE IF EXISTS users;');
    console.log('Users table dropped successfully');
    return true;
  } catch (error) {
    console.error('Error dropping users table:', error);
    return false;
  }
}

module.exports = {
  up,
  down
}; 