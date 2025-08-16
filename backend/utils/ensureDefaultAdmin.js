/**
 * Utility: Ensure Default Admin Exists
 * Creates a default super admin account if none exists
 */
const bcrypt = require('bcryptjs');
const { Admin } = require('../models');
const logger = require('./logger');

const ensureDefaultAdmin = async () => {
  try {
    // Check if any super admin exists
    const existingSuperAdmin = await Admin.findOne({
      where: { is_super_admin: true }
    });

    if (existingSuperAdmin) {
      logger.info('✅ Super admin already exists');
      return existingSuperAdmin;
    }

    // Create default super admin
    const defaultAdmin = await Admin.create({
      email: 'superadmin@example.com',
      password: 'admin123', // Will be hashed by the model hook
      first_name: 'Super',
      last_name: 'Admin',
      role_id: null, // No role required for super admin
      company_id: null,
      status: 'active',
      access_level: 'super',
      is_super_admin: true,
      phone: null,
      department: 'Management'
    });

    logger.info('🎉 Default super admin created successfully!');
    logger.info('📧 Email: superadmin@example.com');
    logger.info('🔑 Password: admin123');
    logger.warn('⚠️  Please change the default password after first login!');

    return defaultAdmin;

  } catch (error) {
    // If it's a unique constraint error, the admin might already exist
    if (error.name === 'SequelizeUniqueConstraintError') {
      logger.info('✅ Super admin already exists (unique constraint)');
      return await Admin.findOne({
        where: { email: 'superadmin@example.com' }
      });
    }

    logger.error('❌ Error ensuring default admin exists:', error);
    throw error;
  }
};

module.exports = ensureDefaultAdmin;
