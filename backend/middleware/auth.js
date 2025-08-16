const jwt = require('jsonwebtoken');
const { User, Admin, Employee } = require('../models');

/**
 * Authentication middleware to verify JWT token
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

    // Find user by id based on user type
    const { id, userType } = decoded;
    let user = null;

    switch (userType) {
      case 'admin':
        user = await Admin.findByPk(id, {
          attributes: { exclude: ['password'] }
        });
        break;

      case 'employee':
        user = await Employee.findByPk(id, {
          attributes: { exclude: ['password'] }
        });
        break;

      case 'user':
      default:
        user = await User.findByPk(id, {
          attributes: { exclude: ['password'] }
        });
        break;
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or invalid token'
      });
    }

    // Attach user and decoded info to request
    req.user = {
      ...decoded,
      id: user.id,
      email: user.email,
      role: user.role ? user.role.name : null,
      userType,
      // Include additional user properties for middleware
      companyId: user.company_id,
      access_level: user.access_level,
      isSuperAdmin: user.is_super_admin,
      status: user.status
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

/**
 * Role-based authorization middleware
 * @param {string|string[]} allowedRoles - Role(s) that are allowed to access the route
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Convert single role to array for consistent handling
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      // Check if user has any of the allowed roles
      const userRole = req.user.role || req.user.userType;
      const hasPermission = roles.includes(userRole) ||
                           roles.includes('admin') && req.user.isSuperAdmin ||
                           roles.includes('manager') && (userRole === 'admin' || userRole === 'manager');

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to access this resource'
        });
      }

      next();
    } catch (error) {
      console.error('Role authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
  };
};

/**
 * Authentication token middleware (alias for backward compatibility)
 */
const authenticateToken = auth;

module.exports = {
  auth,
  authenticateToken,
  requireRole
};