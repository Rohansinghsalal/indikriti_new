/**
 * Seeder: Create Default Admin Account
 * Creates a default super admin account for initial system access
 */
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if any admin already exists
      const existingAdmins = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM admins WHERE is_super_admin = 1',
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (existingAdmins[0].count > 0) {
        console.log('Super admin already exists, skipping seeder...');
        return;
      }

      // Hash the default password
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Create default super admin
      await queryInterface.bulkInsert('admins', [
        {
          email: 'superadmin@example.com',
          password: hashedPassword,
          first_name: 'Super',
          last_name: 'Admin',
          role_id: 1, // Assuming role_id 1 exists for super admin
          company_id: null,
          status: 'active',
          access_level: 'super',
          is_super_admin: true,
          phone: null,
          department: 'Management',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      console.log('✅ Default super admin created successfully!');
      console.log('📧 Email: superadmin@example.com');
      console.log('🔑 Password: admin123');
      console.log('⚠️  Please change the default password after first login!');

    } catch (error) {
      console.error('❌ Error creating default admin:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('admins', {
      email: 'superadmin@example.com'
    });
  }
};
