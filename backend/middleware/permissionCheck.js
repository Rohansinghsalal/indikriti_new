/**
 * Permission-based access control middleware
 * @param {string|string[]} requiredPermissions - Permission name or array of permission names required to access the resource
 * @returns {Function} Express middleware
 */
const permissionCheck = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Authentication required'
        });
      }

      // Convert single permission to array
      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];

      // Super Admin has all permissions
      if (req.user.role === 'superadmin' || req.user.isSuperAdmin) {
        return next();
      }

      // Get user permissions from role
      const userPermissions = req.user.role?.permissions?.map(p => p.name) || [];

      // Check if user has all required permissions
      const hasAllRequiredPermissions = permissions.every(
        permission => userPermissions.includes(permission)
      );

      if (hasAllRequiredPermissions) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions'
        });
      }
    } catch (err) {
      console.error('Permission check middleware error:', err);
      return res.status(500).json({
        success: false,
        message: 'Server error during permission verification'
      });
    }
  };
};

module.exports = permissionCheck; 