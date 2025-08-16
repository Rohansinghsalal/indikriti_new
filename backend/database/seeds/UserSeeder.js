/**
 * User Seeder
 * Creates default admin users for the system
 */
'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    // Find Super Admin role ID
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'Super Admin'`
    );
    
    // Find Company Admin role ID
    const [companyAdminRoles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'Company Admin'`
    );

    // Find default company ID
    const [companies] = await queryInterface.sequelize.query(
      `SELECT id FROM companies LIMIT 1`
    );

    if (roles.length === 0 || companies.length === 0) {
      console.log('Required roles or companies not found. Skipping user seeding.');
      return Promise.resolve();
    }

    const superAdminRoleId = roles[0].id;
    const companyAdminRoleId = companyAdminRoles[0].id;
    const defaultCompanyId = companies[0].id;
    
    // Generate hashed password for users
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Create users
    return queryInterface.bulkInsert('users', [
      {
        first_name: 'Super',
        last_name: 'Admin',
        email: 'admin@example.com',
        password: passwordHash,
        role_id: superAdminRoleId,
        company_id: null, // Super admin is not tied to a specific company
        status: 'active',
        email_verified: true,
        created_at: now,
        updated_at: now
      },
      {
        first_name: 'Company',
        last_name: 'Admin',
        email: 'company@example.com',
        password: passwordHash,
        role_id: companyAdminRoleId,
        company_id: defaultCompanyId,
        status: 'active',
        email_verified: true,
        created_at: now,
        updated_at: now
      },
      {
        first_name: 'Demo',
        last_name: 'User',
        email: 'demo@example.com',
        password: passwordHash,
        role_id: companyAdminRoleId,
        company_id: defaultCompanyId,
        status: 'active',
        email_verified: true,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: ['admin@example.com', 'company@example.com', 'demo@example.com']
      }
    }, {});
  }
}; 