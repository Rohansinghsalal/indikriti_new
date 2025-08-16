const { sequelize } = require('./database/connection');

async function fixAdminTable() {
  console.log('🔧 Fixing admin table schema...\n');
  
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // Check if role_id column exists
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'admins' 
      AND COLUMN_NAME = 'role_id' 
      AND TABLE_SCHEMA = 'admin'
    `);
    
    if (results.length === 0) {
      console.log('➕ Adding role_id column to admins table...');
      await sequelize.query(`
        ALTER TABLE admins 
        ADD COLUMN role_id INT NULL,
        ADD FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
      `);
      console.log('✅ Added role_id column to admins table');
    } else {
      console.log('✅ role_id column already exists in admins table');
    }
    
    // Check if company_id column exists
    const [companyResults] = await sequelize.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'admins'
      AND COLUMN_NAME = 'company_id'
      AND TABLE_SCHEMA = 'admin'
    `);

    if (companyResults.length === 0) {
      console.log('➕ Adding company_id column to admins table...');
      await sequelize.query(`
        ALTER TABLE admins
        ADD COLUMN company_id INT NULL,
        ADD FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
      `);
      console.log('✅ Added company_id column to admins table');
    } else {
      console.log('✅ company_id column already exists in admins table');
    }

    // Check if phone column exists
    const [phoneResults] = await sequelize.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'admins'
      AND COLUMN_NAME = 'phone'
      AND TABLE_SCHEMA = 'admin'
    `);

    if (phoneResults.length === 0) {
      console.log('➕ Adding phone column to admins table...');
      await sequelize.query(`
        ALTER TABLE admins
        ADD COLUMN phone VARCHAR(50) NULL
      `);
      console.log('✅ Added phone column to admins table');
    } else {
      console.log('✅ phone column already exists in admins table');
    }

    console.log('\n🎉 Admin table schema fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing admin table:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

fixAdminTable().catch(console.error);
