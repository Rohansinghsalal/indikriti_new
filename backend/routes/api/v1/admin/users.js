/**
 * Admin User Management Routes
 * Handles CRUD operations for user management
 */

const express = require('express');
const router = express.Router();

// Import controllers
const UserManagementController = require('../../../../controllers/admin/UserManagementController');

// Import middleware
const { auth } = require('../../../../middleware/auth');
const { requireAdmin, requireSuperAdmin, requirePermission } = require('../../../../middleware/rbac');
const {
  validateCreateUser,
  validateUpdateUser,
  validateGetUser,
  validateDeleteUser,
  validateGetUsers
} = require('../../../../middleware/userValidation');

// Import validation helper
const { validationResult } = require('express-validator');

/**
 * Validation error handler middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /api/v1/admin/users
// @desc    Get all users with pagination and filtering
// @access  Admin, Super Admin
router.get('/',
  auth,
  requireAdmin,
  requirePermission('user.read'),
  validateGetUsers,
  handleValidationErrors,
  UserManagementController.getUsers
);

// @route   GET /api/v1/admin/users/stats
// @desc    Get user statistics
// @access  Admin, Super Admin
router.get('/stats',
  auth,
  requireAdmin,
  requirePermission('user.read'),
  UserManagementController.getUserStats
);

// @route   GET /api/v1/admin/users/:id
// @desc    Get user by ID
// @access  Admin, Super Admin
router.get('/:id',
  auth,
  requireAdmin,
  requirePermission('user.read'),
  validateGetUser,
  handleValidationErrors,
  UserManagementController.getUserById
);

// @route   POST /api/v1/admin/users
// @desc    Create new user
// @access  Admin, Super Admin
router.post('/',
  auth,
  requireAdmin,
  requirePermission('user.create'),
  validateCreateUser,
  handleValidationErrors,
  UserManagementController.createUser
);

// @route   PUT /api/v1/admin/users/:id
// @desc    Update user
// @access  Admin, Super Admin
router.put('/:id',
  auth,
  requireAdmin,
  requirePermission('user.update'),
  validateUpdateUser,
  handleValidationErrors,
  UserManagementController.updateUser
);

// @route   DELETE /api/v1/admin/users/:id
// @desc    Delete user (Super Admin only)
// @access  Super Admin
router.delete('/:id',
  auth,
  requireSuperAdmin,
  requirePermission('user.delete'),
  validateDeleteUser,
  handleValidationErrors,
  UserManagementController.deleteUser
);

// @route   GET /api/v1/admin/roles
// @desc    Get all roles for user assignment
// @access  Admin, Super Admin
router.get('/roles/list',
  auth,
  requireAdmin,
  requirePermission('role.read'),
  UserManagementController.getRoles
);

module.exports = router;
