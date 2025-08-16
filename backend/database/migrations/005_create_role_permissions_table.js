const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

async function up() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY role_permission_unique (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Role permissions table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating role permissions table:', error);
    return false;
  }
}

async function down() {
  try {
    await sequelize.query('DROP TABLE IF EXISTS role_permissions;');
    console.log('Role permissions table dropped successfully');
    return true;
  } catch (error) {
    console.error('Error dropping role permissions table:', error);
    return false;
  }
}

module.exports = {
  up,
  down
}; 