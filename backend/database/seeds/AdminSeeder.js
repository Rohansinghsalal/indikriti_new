/**
 * Admin Seeder
 */
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if super admin already exists
      const [existingAdmin] = await queryInterface.sequelize.query(
        `SELECT id FROM admins WHERE email = 'superadmin@example.com' LIMIT 1`
      );

      if (existingAdmin.length > 0) {
        console.log('Super admin already exists, skipping admin seeder');
        return Promise.resolve();
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      // Create super admin
      await queryInterface.bulkInsert(
        'admins',
        [
          {
            first_name: 'Super',
            last_name: 'Admin',
            email: 'superadmin@example.com',
            password: hashedPassword,
            role_id: 1, // Super Admin role ID
            company_id: 1, // Default company ID
            department: 'Management',
            status: 'active',
            access_level: 'full',
            is_super_admin: true,
            phone: '+1234567890',
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        {}
      );

      console.log('Admin seeder executed successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Error in admin seeder:', error);
      return Promise.reject(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('admins', null, {});
  }
}; 