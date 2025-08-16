/**
 * Company data filtering middleware
 * Restricts data access to the user's assigned company
 * Super Admin can access all companies' data
 */
const companyFilter = async (req, res, next) => {
  try {
    // If user is not authenticated, deny access
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Authentication required'
      });
    }

    // Super Admin can access all companies' data
    if (req.user.access_level === 'super' || req.user.isSuperAdmin) {
      // No need to set company filter for Super Admin
      next();
      return;
    }

    // Check if user has a company assigned
    if (!req.user.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. No company assignment'
      });
    }

    // Set company filter for the request
    // This will be used by controllers to filter data
    req.companyFilter = { companyId: req.user.companyId };

    next();
  } catch (err) {
    console.error('Company filter middleware error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during company filtering'
    });
  }
};

module.exports = companyFilter; 