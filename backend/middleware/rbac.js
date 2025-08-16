/**
 * Role-Based Access Control (RBAC) Middleware
 * Provides comprehensive permission checking for different user roles
 */

const { Admin, User, Employee, Role, Permission, RolePermission } = require('../models');

/**
 * Define system roles and their hierarchical levels
 */
const ROLE_HIERARCHY = {
  'super-admin': 100,
  'admin': 80,
  'manager': 60,
  'employee': 40,
  'user': 20,
  'guest': 10
};

/**
 * Define default permissions for each role
 */
const DEFAULT_PERMISSIONS = {
  'super-admin': [
    'user.create', 'user.read', 'user.update', 'user.delete',
    'admin.create', 'admin.read', 'admin.update', 'admin.delete',
    'role.create', 'role.read', 'role.update', 'role.delete',
    'permission.create', 'permission.read', 'permission.update', 'permission.delete',
    'product.create', 'product.read', 'product.update', 'product.delete',
    'inventory.create', 'inventory.read', 'inventory.update', 'inventory.delete',
    'order.create', 'order.read', 'order.update', 'order.delete',
    'invoice.create', 'invoice.read', 'invoice.update', 'invoice.delete',
    'pos.create', 'pos.read', 'pos.update', 'pos.delete',
    'analytics.read', 'settings.read', 'settings.update',
    'system.backup', 'system.restore', 'system.configure'
  ],
  'admin': [
    'user.create', 'user.read', 'user.update', 'user.delete',
    'product.create', 'product.read', 'product.update', 'product.delete',
    'inventory.create', 'inventory.read', 'inventory.update', 'inventory.delete',
    'order.create', 'order.read', 'order.update', 'order.delete',
    'invoice.create', 'invoice.read', 'invoice.update', 'invoice.delete',
    'pos.create', 'pos.read', 'pos.update', 'pos.delete',
    'analytics.read', 'settings.read'
  ],
  'manager': [
    'product.read', 'product.update',
    'inventory.read', 'inventory.update',
    'order.create', 'order.read', 'order.update',
    'invoice.create', 'invoice.read', 'invoice.update',
    'pos.create', 'pos.read', 'pos.update',
    'analytics.read'
  ],
  'employee': [
    'product.read',
    'inventory.read',
    'order.create', 'order.read',
    'invoice.create', 'invoice.read',
    'pos.create', 'pos.read', 'pos.update'
  ],
  'user': [
    'product.read',
    'order.create', 'order.read'
  ]
};

/**
 * Check if user has required permission
 * @param {Object} user - User object with role and permissions
 * @param {string} permission - Required permission
 * @returns {boolean} - Whether user has permission
 */
const hasPermission = (user, permission) => {
  // Super admin has all permissions
  if (user.isSuperAdmin || user.access_level === 'super') {
    return true;
  }

  // Check role hierarchy
  const userRole = user.role || user.access_level || user.userType;
  const userLevel = ROLE_HIERARCHY[userRole] || 0;

  // Admin level users have most permissions
  if (userLevel >= ROLE_HIERARCHY['admin']) {
    const adminPermissions = DEFAULT_PERMISSIONS['admin'];
    if (adminPermissions.includes(permission)) {
      return true;
    }
  }

  // Check specific permissions
  if (user.permissions && Array.isArray(user.permissions)) {
    return user.permissions.some(p => 
      p === permission || 
      p.name === permission ||
      (typeof p === 'object' && p.name === permission)
    );
  }

  // Check default role permissions
  const rolePermissions = DEFAULT_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

/**
 * Check if user has any of the required permissions
 * @param {Object} user - User object
 * @param {string[]} permissions - Array of permissions
 * @returns {boolean} - Whether user has any permission
 */
const hasAnyPermission = (user, permissions) => {
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has all required permissions
 * @param {Object} user - User object
 * @param {string[]} permissions - Array of permissions
 * @returns {boolean} - Whether user has all permissions
 */
const hasAllPermissions = (user, permissions) => {
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Middleware to require specific permission
 * @param {string} permission - Required permission
 * @returns {Function} - Express middleware
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!hasPermission(req.user, permission)) {
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required: ${permission}`,
        required_permission: permission
      });
    }

    next();
  };
};

/**
 * Middleware to require any of the specified permissions
 * @param {string[]} permissions - Array of permissions
 * @returns {Function} - Express middleware
 */
const requireAnyPermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!hasAnyPermission(req.user, permissions)) {
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required any of: ${permissions.join(', ')}`,
        required_permissions: permissions
      });
    }

    next();
  };
};

/**
 * Middleware to require all specified permissions
 * @param {string[]} permissions - Array of permissions
 * @returns {Function} - Express middleware
 */
const requireAllPermissions = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!hasAllPermissions(req.user, permissions)) {
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required all of: ${permissions.join(', ')}`,
        required_permissions: permissions
      });
    }

    next();
  };
};

/**
 * Middleware to require specific role level
 * @param {string} minRole - Minimum required role
 * @returns {Function} - Express middleware
 */
const requireRole = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role || req.user.access_level || req.user.userType;
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole] || 0;

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        success: false,
        message: `Insufficient role level. Required: ${minRole}, Current: ${userRole}`,
        required_role: minRole,
        current_role: userRole
      });
    }

    next();
  };
};

/**
 * Middleware for admin-only access
 */
const requireAdmin = requireRole('admin');

/**
 * Middleware for super admin-only access
 */
const requireSuperAdmin = requireRole('super-admin');

/**
 * Get user permissions from database
 * @param {Object} user - User object
 * @returns {Promise<string[]>} - Array of permission names
 */
const getUserPermissions = async (user) => {
  try {
    let userModel = null;
    
    // Find user based on type
    switch (user.userType) {
      case 'admin':
        userModel = await Admin.findByPk(user.id, {
          include: [{
            model: Role,
            as: 'role',
            include: [{
              model: Permission,
              as: 'permissions'
            }]
          }]
        });
        break;
      case 'employee':
        userModel = await Employee.findByPk(user.id, {
          include: [{
            model: Role,
            as: 'role',
            include: [{
              model: Permission,
              as: 'permissions'
            }]
          }]
        });
        break;
      default:
        userModel = await User.findByPk(user.id, {
          include: [{
            model: Role,
            as: 'role',
            include: [{
              model: Permission,
              as: 'permissions'
            }]
          }]
        });
        break;
    }

    if (!userModel || !userModel.role) {
      // Return default permissions based on access level
      const accessLevel = user.access_level || user.role || user.userType;
      return DEFAULT_PERMISSIONS[accessLevel] || [];
    }

    // Extract permissions from role
    const permissions = userModel.role.permissions || [];
    return permissions.map(p => p.name);
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
};

module.exports = {
  ROLE_HIERARCHY,
  DEFAULT_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole,
  requireAdmin,
  requireSuperAdmin,
  getUserPermissions
};
