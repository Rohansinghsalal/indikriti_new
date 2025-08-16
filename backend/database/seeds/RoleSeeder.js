/**
 * Role Seeder
 * Creates default roles for the system
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    return queryInterface.bulkInsert('roles', [
      {
        name: 'superadmin',
        description: 'Full system access with all permissions',
        is_system: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'admin',
        description: 'Full company access with company-level permissions',
        is_system: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'manager',
        description: 'Department manager with limited administrative permissions',
        is_system: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'staff',
        description: 'Regular staff with basic permissions',
        is_system: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'cashier',
        description: 'Point of Sale operator',
        is_system: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'inventory_manager',
        description: 'Manages product inventory',
        is_system: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'support_agent',
        description: 'Customer support representative',
        is_system: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'content_editor',
        description: 'Content management and publishing',
        is_system: true,
        created_at: now,
        updated_at: now
      }
    ], { ignoreDuplicates: true });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', {
      is_system: true
    }, {});
  }
}; 