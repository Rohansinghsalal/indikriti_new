/**
 * Permission Seeder
 * Creates default permissions for the system
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    // Create permissions grouped by module
    const permissions = [
      // User management permissions
      { name: 'View Users', module: 'users', action: 'view', created_at: now, updated_at: now },
      { name: 'Create Users', module: 'users', action: 'create', created_at: now, updated_at: now },
      { name: 'Update Users', module: 'users', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete Users', module: 'users', action: 'delete', created_at: now, updated_at: now },
      
      // Role management permissions
      { name: 'View Roles', module: 'roles', action: 'view', created_at: now, updated_at: now },
      { name: 'Create Roles', module: 'roles', action: 'create', created_at: now, updated_at: now },
      { name: 'Update Roles', module: 'roles', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete Roles', module: 'roles', action: 'delete', created_at: now, updated_at: now },
      
      // Product management permissions
      { name: 'View Products', module: 'products', action: 'view', created_at: now, updated_at: now },
      { name: 'Create Products', module: 'products', action: 'create', created_at: now, updated_at: now },
      { name: 'Update Products', module: 'products', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete Products', module: 'products', action: 'delete', created_at: now, updated_at: now },
      
      // Category management permissions
      { name: 'View Categories', module: 'categories', action: 'view', created_at: now, updated_at: now },
      { name: 'Create Categories', module: 'categories', action: 'create', created_at: now, updated_at: now },
      { name: 'Update Categories', module: 'categories', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete Categories', module: 'categories', action: 'delete', created_at: now, updated_at: now },
      
      // Order management permissions
      { name: 'View Orders', module: 'orders', action: 'view', created_at: now, updated_at: now },
      { name: 'Create Orders', module: 'orders', action: 'create', created_at: now, updated_at: now },
      { name: 'Update Orders', module: 'orders', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete Orders', module: 'orders', action: 'delete', created_at: now, updated_at: now },
      { name: 'Fulfill Orders', module: 'orders', action: 'fulfill', created_at: now, updated_at: now },
      
      // Customer management permissions
      { name: 'View Customers', module: 'customers', action: 'view', created_at: now, updated_at: now },
      { name: 'Create Customers', module: 'customers', action: 'create', created_at: now, updated_at: now },
      { name: 'Update Customers', module: 'customers', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete Customers', module: 'customers', action: 'delete', created_at: now, updated_at: now },
      
      // Inventory management permissions
      { name: 'View Inventory', module: 'inventory', action: 'view', created_at: now, updated_at: now },
      { name: 'Update Inventory', module: 'inventory', action: 'update', created_at: now, updated_at: now },
      
      // Payment management permissions
      { name: 'View Payments', module: 'payments', action: 'view', created_at: now, updated_at: now },
      { name: 'Create Payments', module: 'payments', action: 'create', created_at: now, updated_at: now },
      { name: 'Update Payments', module: 'payments', action: 'update', created_at: now, updated_at: now },
      { name: 'Manage Payment Settings', module: 'payments', action: 'admin', created_at: now, updated_at: now },
      
      // Refund permissions
      { name: 'View Refunds', module: 'refunds', action: 'view', created_at: now, updated_at: now },
      { name: 'Create Refunds', module: 'refunds', action: 'create', created_at: now, updated_at: now },
      { name: 'Update Refunds', module: 'refunds', action: 'update', created_at: now, updated_at: now },
      
      // Discount management permissions
      { name: 'View Discounts', module: 'discounts', action: 'view', created_at: now, updated_at: now },
      { name: 'Create Discounts', module: 'discounts', action: 'create', created_at: now, updated_at: now },
      { name: 'Update Discounts', module: 'discounts', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete Discounts', module: 'discounts', action: 'delete', created_at: now, updated_at: now },
      
      // POS permissions
      { name: 'Access POS', module: 'pos', action: 'view', created_at: now, updated_at: now },
      { name: 'Create POS Transactions', module: 'pos', action: 'create', created_at: now, updated_at: now },
      { name: 'Update POS Transactions', module: 'pos', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete POS Transactions', module: 'pos', action: 'delete', created_at: now, updated_at: now },
      { name: 'Process Returns', module: 'pos', action: 'return', created_at: now, updated_at: now },
      { name: 'Manage POS Settings', module: 'pos', action: 'admin', created_at: now, updated_at: now },
      { name: 'View POS Reports', module: 'pos', action: 'reports', created_at: now, updated_at: now },
      
      // Support ticket permissions
      { name: 'View Tickets', module: 'tickets', action: 'view', created_at: now, updated_at: now },
      { name: 'Update Tickets', module: 'tickets', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete Tickets', module: 'tickets', action: 'delete', created_at: now, updated_at: now },
      { name: 'Assign Tickets', module: 'tickets', action: 'assign', created_at: now, updated_at: now },
      
      // Content management permissions
      { name: 'View Content', module: 'content', action: 'view', created_at: now, updated_at: now },
      { name: 'Create Content', module: 'content', action: 'create', created_at: now, updated_at: now },
      { name: 'Update Content', module: 'content', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete Content', module: 'content', action: 'delete', created_at: now, updated_at: now },
      { name: 'Publish Content', module: 'content', action: 'publish', created_at: now, updated_at: now },
      
      // CMS permissions
      { name: 'View CMS', module: 'cms', action: 'view', created_at: now, updated_at: now },
      { name: 'Create CMS Pages', module: 'cms', action: 'create', created_at: now, updated_at: now },
      { name: 'Update CMS Pages', module: 'cms', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete CMS Pages', module: 'cms', action: 'delete', created_at: now, updated_at: now },
      { name: 'Publish CMS Pages', module: 'cms', action: 'publish', created_at: now, updated_at: now },
      
      // Analytics permissions
      { name: 'View Analytics', module: 'analytics', action: 'view', created_at: now, updated_at: now },
      { name: 'Create Reports', module: 'analytics', action: 'create', created_at: now, updated_at: now },
      { name: 'Update Reports', module: 'analytics', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete Reports', module: 'analytics', action: 'delete', created_at: now, updated_at: now },
      { name: 'Export Reports', module: 'analytics', action: 'export', created_at: now, updated_at: now },
      { name: 'Schedule Reports', module: 'analytics', action: 'schedule', created_at: now, updated_at: now },
      { name: 'Customize Dashboard', module: 'analytics', action: 'customize', created_at: now, updated_at: now },
      
      // Report permissions
      { name: 'View Reports', module: 'reports', action: 'view', created_at: now, updated_at: now },
      
      // System settings permissions
      { name: 'View Settings', module: 'settings', action: 'view', created_at: now, updated_at: now },
      { name: 'Update Settings', module: 'settings', action: 'update', created_at: now, updated_at: now },
      
      // System permissions
      { name: 'View System Info', module: 'system', action: 'view', created_at: now, updated_at: now },
      { name: 'Administrate System', module: 'system', action: 'admin', created_at: now, updated_at: now },
      
      // Audit log permissions
      { name: 'View Audit Logs', module: 'audit', action: 'view', created_at: now, updated_at: now },
      { name: 'Export Audit Logs', module: 'audit', action: 'export', created_at: now, updated_at: now },
      
      // Contact form permissions
      { name: 'View Contact Submissions', module: 'contact', action: 'view', created_at: now, updated_at: now },
      { name: 'Update Contact Submissions', module: 'contact', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete Contact Submissions', module: 'contact', action: 'delete', created_at: now, updated_at: now },
      
      // Staff management permissions
      { name: 'View Staff', module: 'staff', action: 'view', created_at: now, updated_at: now },
      { name: 'Create Staff', module: 'staff', action: 'create', created_at: now, updated_at: now },
      { name: 'Update Staff', module: 'staff', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete Staff', module: 'staff', action: 'delete', created_at: now, updated_at: now },
      
      // Referral permissions
      { name: 'View Referrals', module: 'referrals', action: 'view', created_at: now, updated_at: now },
      { name: 'Create Referrals', module: 'referrals', action: 'create', created_at: now, updated_at: now },
      { name: 'Update Referrals', module: 'referrals', action: 'update', created_at: now, updated_at: now },
      { name: 'Delete Referrals', module: 'referrals', action: 'delete', created_at: now, updated_at: now },
    ];
    
    return queryInterface.bulkInsert('permissions', permissions, { ignoreDuplicates: true });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('permissions', null, {});
  }
}; 