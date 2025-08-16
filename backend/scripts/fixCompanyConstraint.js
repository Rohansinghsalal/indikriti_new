const { sequelize } = require('../database/connection');

async function fixCompanyConstraint() {
  try {
    console.log('🔧 Fixing company constraint issue...');
    
    // First, let's check what companies exist
    const [companies] = await sequelize.query('SELECT * FROM companies');
    console.log('📋 Existing companies:', companies);
    
    // Check what company_id the admin with ID 16 has
    const [admins] = await sequelize.query('SELECT id, company_id FROM admins WHERE id = 16');
    console.log('👤 Admin 16 details:', admins);
    
    if (admins.length > 0) {
      const adminCompanyId = admins[0].company_id;
      console.log(`👤 Admin 16 has company_id: ${adminCompanyId}`);
      
      // Check if this company exists
      const [existingCompany] = await sequelize.query('SELECT * FROM companies WHERE id = ?', {
        replacements: [adminCompanyId]
      });
      
      if (existingCompany.length === 0) {
        console.log(`🏢 Company with ID ${adminCompanyId} doesn't exist. Creating it...`);
        
        // Create the missing company
        await sequelize.query(`
          INSERT INTO companies (id, name, address, phone, email, status, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, {
          replacements: [
            adminCompanyId,
            'Default Company',
            'Default Address',
            '1234567890',
            'admin@defaultcompany.com',
            'active'
          ]
        });
        
        console.log(`✅ Created company with ID ${adminCompanyId}`);
      } else {
        console.log(`✅ Company with ID ${adminCompanyId} already exists`);
      }
    }
    
    // Also create company with ID 1 as a fallback
    const [company1] = await sequelize.query('SELECT * FROM companies WHERE id = 1');
    if (company1.length === 0) {
      await sequelize.query(`
        INSERT INTO companies (id, name, address, phone, email, status, created_at, updated_at) 
        VALUES (1, 'Primary Company', 'Primary Address', '1234567890', 'admin@primarycompany.com', 'active', NOW(), NOW())
      `);
      console.log('✅ Created primary company with ID 1');
    }
    
    console.log('🎉 Company constraint issue fixed!');
    
  } catch (error) {
    console.error('❌ Error fixing company constraint:', error);
  } finally {
    await sequelize.close();
  }
}

fixCompanyConstraint();
