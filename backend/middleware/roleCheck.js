/**
 * Role-based access control middleware
 * @param {string[]} allowedRoles - Array of role names that are allowed to access the resource
 * @returns {Function} Express middleware
 */
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. User role information not available'
        });
      }

      // Check if user role is in allowed roles
      const userRole = req.user.role;
      
      // Super admin bypass - always allow access
      if (req.user.userType === 'admin' && req.user.isSuperAdmin) {
        return next();
      }
      
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions'
        });
      }
    } catch (err) {
      console.error('Role check middleware error:', err);
      return res.status(500).json({
        success: false,
        message: 'Server error during role verification'
      });
    }
  };
};

module.exports = roleCheck; 