const { sequelize } = require('../database/connection');
const { DataTypes } = require('sequelize');

// Import the Company model function and initialize it
const CompanyModel = require('../models/Company');
const Company = CompanyModel(sequelize, DataTypes);

async function createDefaultCompany() {
  try {
    // Create a default company if it doesn't exist
    const [company, created] = await Company.findOrCreate({
      where: { id: 2 },
      defaults: {
        id: 2,
        name: 'Default Company',
        email: 'admin@defaultcompany.com',
        phone: '1234567890',
        address: 'Default Address',
        status: 'active'
      }
    });

    if (created) {
      console.log('✅ Default company created successfully');
    } else {
      console.log('✅ Default company already exists');
    }

    console.log('Company details:', company.toJSON());
    
    // Also create company with ID 1 for safety
    const [company1, created1] = await Company.findOrCreate({
      where: { id: 1 },
      defaults: {
        id: 1,
        name: 'Primary Company',
        email: 'admin@primarycompany.com',
        phone: '1234567890',
        address: 'Primary Address',
        status: 'active'
      }
    });

    if (created1) {
      console.log('✅ Primary company created successfully');
    } else {
      console.log('✅ Primary company already exists');
    }

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error creating default company:', error);
    await sequelize.close();
    process.exit(1);
  }
}

createDefaultCompany();
