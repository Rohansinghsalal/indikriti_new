/**
 * Role-based permissions configuration
 */

module.exports = {
  // Role hierarchy (higher index has more privilege)
  roleHierarchy: [
    'staff',
    'logistics',
    'accountant',  
    'manager',
    'company_admin',
    'super_admin'
  ],
  
  // Default resource access by role
  defaultAccess: {
    super_admin: {
      all: ['create', 'read', 'update', 'delete', 'manage']
    },
    company_admin: {
      company: ['create', 'read', 'update', 'delete', 'manage'],
      user: ['create', 'read', 'update', 'delete'],
      role: ['read'],
      permission: ['read'],
      product: ['create', 'read', 'update', 'delete', 'manage'],
      order: ['create', 'read', 'update', 'delete', 'manage'],
      financial: ['read', 'update', 'manage'],
      pos: ['create', 'read', 'update', 'delete', 'manage'],
      support: ['read', 'update', 'manage'],
      cms: ['create', 'read', 'update', 'delete'],
      analytics: ['read']
    },
    manager: {
      user: ['read', 'update'],
      product: ['create', 'read', 'update', 'delete'],
      order: ['create', 'read', 'update'],
      financial: ['read'],
      pos: ['create', 'read', 'update'],
      support: ['read', 'update'],
      cms: ['read', 'update'],
      analytics: ['read']
    },
    accountant: {
      financial: ['read', 'update'],
      order: ['read'],
      product: ['read'],
      analytics: ['read']
    },
    logistics: {
      order: ['read', 'update'],
      product: ['read'],
      inventory: ['read', 'update']
    },
    staff: {
      product: ['read'],
      order: ['read'],
      support: ['read', 'update'],
      pos: ['create', 'read']
    }
  },
  
  // Special permissions and exceptions
  specialPermissions: {
    // Permissions that bypass company filters
    globalAccess: ['super_admin'],
    
    // Permissions that allow managing settings
    systemSettings: ['super_admin', 'company_admin'],
    
    // User types that can access analytics
    analyticsAccess: ['super_admin', 'company_admin', 'manager', 'accountant']
  },
  
  // Permission validation settings
  validation: {
    // If true, will validate against both role and specific permissions
    enforceSpecificPermissions: true,
    
    // If true, higher roles automatically get lower role permissions
    hierarchicalPermissions: true,
    
    // Default action when permission is not explicitly defined
    defaultDeny: true
  }
}; 