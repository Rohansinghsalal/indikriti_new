/**
 * Fix Missing last_login_at Column in Admins Table
 * This script adds the missing last_login_at column to resolve the Sequelize ORM error
 */

const { sequelize } = require('./database/connection');

async function fixMissingColumn() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // Check if last_login_at column exists
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'admins' 
      AND COLUMN_NAME = 'last_login_at' 
      AND TABLE_SCHEMA = DATABASE()
    `);
    
    if (results.length === 0) {
      console.log('➕ Adding last_login_at column to admins table...');
      
      // Add the missing column
      await sequelize.query(`
        ALTER TABLE admins 
        ADD COLUMN last_login_at DATETIME NULL 
        AFTER is_super_admin
      `);
      
      console.log('✅ Successfully added last_login_at column to admins table');
      
      // Verify the column was added
      const [verifyResults] = await sequelize.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'admins' 
        AND COLUMN_NAME = 'last_login_at' 
        AND TABLE_SCHEMA = DATABASE()
      `);
      
      if (verifyResults.length > 0) {
        console.log('✅ Verification successful: last_login_at column exists');
      } else {
        console.log('❌ Verification failed: last_login_at column not found');
      }
      
    } else {
      console.log('✅ last_login_at column already exists in admins table');
    }
    
    // Also check if avatar column exists (it might be missing too)
    const [avatarResults] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'admins' 
      AND COLUMN_NAME = 'avatar' 
      AND TABLE_SCHEMA = DATABASE()
    `);
    
    if (avatarResults.length === 0) {
      console.log('➕ Adding avatar column to admins table...');
      
      await sequelize.query(`
        ALTER TABLE admins 
        ADD COLUMN avatar VARCHAR(255) NULL 
        AFTER phone
      `);
      
      console.log('✅ Successfully added avatar column to admins table');
    } else {
      console.log('✅ avatar column already exists in admins table');
    }
    
    console.log('\n🎉 Database schema fix completed successfully!');
    console.log('The admins table now matches the Sequelize model definition.');
    
  } catch (error) {
    console.error('❌ Error fixing database schema:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the fix
if (require.main === module) {
  fixMissingColumn()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { fixMissingColumn };
