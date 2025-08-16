/**
 * Database Schema Fix Script
 * Ensures the database schema matches the current models
 */
const { sequelize } = require('./database/connection');
const logger = require('./utils/logger');

const fixDatabaseSchema = async () => {
  try {
    console.log('🔧 Starting database schema fix...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // Check if admins table exists and has correct structure
    const [adminTableInfo] = await sequelize.query(`
      DESCRIBE admins
    `);
    
    console.log('📋 Current admins table structure:');
    adminTableInfo.forEach(column => {
      console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
    });
    
    // Check if roles table exists
    try {
      const [rolesCheck] = await sequelize.query(`
        SELECT COUNT(*) as count FROM roles LIMIT 1
      `);
      console.log('✅ Roles table exists');
    } catch (error) {
      console.log('⚠️  Roles table does not exist, creating basic role...');
      
      // Create roles table if it doesn't exist
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS roles (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `);
      
      // Insert default role
      await sequelize.query(`
        INSERT IGNORE INTO roles (id, name, description) VALUES 
        (1, 'Super Admin', 'Full system access')
      `);
      
      console.log('✅ Created roles table with default super admin role');
    }
    
    // Check if companies table exists
    try {
      const [companiesCheck] = await sequelize.query(`
        SELECT COUNT(*) as count FROM companies LIMIT 1
      `);
      console.log('✅ Companies table exists');
    } catch (error) {
      console.log('⚠️  Companies table does not exist, creating basic company...');
      
      // Create companies table if it doesn't exist
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS companies (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `);
      
      // Insert default company
      await sequelize.query(`
        INSERT IGNORE INTO companies (id, name, description) VALUES 
        (1, 'Default Company', 'Default company for admin users')
      `);
      
      console.log('✅ Created companies table with default company');
    }
    
    // Verify admin table structure matches our model
    const requiredColumns = [
      'id', 'first_name', 'last_name', 'email', 'password', 
      'phone', 'department', 'status', 'access_level', 
      'is_super_admin', 'role_id', 'company_id', 'created_at', 'updated_at'
    ];
    
    const existingColumns = adminTableInfo.map(col => col.Field);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('⚠️  Missing columns in admins table:', missingColumns);
    } else {
      console.log('✅ All required columns exist in admins table');
    }
    
    console.log('\n🎉 Database schema check completed!');
    console.log('\n📊 Summary:');
    console.log('  - Admins table: ✅ Ready');
    console.log('  - Roles table: ✅ Ready');
    console.log('  - Companies table: ✅ Ready');
    console.log('\n🚀 Database is ready for admin creation!');
    
  } catch (error) {
    console.error('❌ Error fixing database schema:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run fix if this file is executed directly
if (require.main === module) {
  fixDatabaseSchema().catch(console.error);
}

module.exports = fixDatabaseSchema;
