const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Import controllers
const AuthController = require('../../../controllers/auth/AuthController');
const RoleController = require('../../../controllers/auth/RoleController');
const PermissionController = require('../../../controllers/auth/PermissionController');

// Import middlewares
const { authenticateToken, requireRole } = require('../../../middleware/auth');
const roleCheck = require('../../../middleware/roleCheck');
const permissionCheck = require('../../../middleware/permissionCheck');
const { validateRequest } = require('../../../middleware/validation');

// Validation middleware
const validationMiddleware = {
  
  validateLogin: [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  validateEmail: [
    check('email', 'Please include a valid email').isEmail()
  ],
  validateChangePassword: [
    check('currentPassword', 'Current password is required').not().isEmpty(),
    check('newPassword', 'Please enter a new password with 6 or more characters').isLength({ min: 6 })
  ],
  validateRole: [
    check('name', 'Role name is required').not().isEmpty()
  ],
  validatePermission: [
    check('name', 'Permission name is required').not().isEmpty(),
    check('module', 'Module name is required').not().isEmpty()
  ]
};

// Auth middleware
const authMiddleware = {
  isAdmin: roleCheck(['superadmin', 'admin'])
};

/**
 * Authentication Routes
 */

// @route   POST /api/v1/auth/login
// @desc    Login admin and get token
// @access  Public
router.post('/login', validationMiddleware.validateLogin, validateRequest(), AuthController.login);

// @route   GET /api/v1/auth/verify
// @desc    Verify admin token
// @access  Private
router.get('/verify', authenticateToken, AuthController.verifyToken);

// @route   POST /api/v1/auth/refresh-token
// @desc    Refresh admin token
// @access  Private
router.post('/refresh-token', AuthController.refreshToken);

// @route   GET /api/v1/auth/me
// @desc    Get current admin profile
// @access  Private
router.get('/me', authenticateToken, AuthController.getMe);

// @route   POST /api/v1/auth/logout
// @desc    Logout admin (clear token)
// @access  Private
router.post('/logout', authenticateToken, AuthController.logout);

// @route   POST /api/v1/auth/forgot-password
// @desc    Send password reset request to super admin
// @access  Public
router.post('/forgot-password', validationMiddleware.validateEmail, validateRequest(), AuthController.forgotPassword);

// @route   PUT /api/v1/auth/change-password
// @desc    Change admin password
// @access  Private
router.put('/change-password', authenticateToken, validationMiddleware.validateChangePassword, validateRequest(), AuthController.changePassword);

// Role routes

// @route   GET /api/v1/auth/roles
// @desc    Get all roles
// @access  Private (Super Admin)
router.get('/roles', authenticateToken, requireRole(['admin']), RoleController.getAllRoles);

// @route   GET /api/v1/auth/roles/:id
// @desc    Get role by id
// @access  Private (Super Admin)
router.get('/roles/:id', authenticateToken, requireRole(['admin']), RoleController.getRoleById);

// @route   POST /api/v1/auth/roles
// @desc    Create a new role
// @access  Private (Super Admin)
router.post('/roles', authenticateToken, requireRole(['admin']), validationMiddleware.validateRole, validateRequest(), RoleController.createRole);

// @route   PUT /api/v1/auth/roles/:id
// @desc    Update a role
// @access  Private (Super Admin)
router.put('/roles/:id', authenticateToken, requireRole(['admin']), validationMiddleware.validateRole, validateRequest(), RoleController.updateRole);

// @route   DELETE /api/v1/auth/roles/:id
// @desc    Delete a role
// @access  Private (Super Admin)
router.delete('/roles/:id', authenticateToken, requireRole(['admin']), RoleController.deleteRole);

// @route   POST /api/v1/auth/roles/:roleId/permissions
// @desc    Assign permissions to a role
// @access  Private (Super Admin)
router.post('/roles/:roleId/permissions', authenticateToken, requireRole(['admin']), RoleController.assignPermissions);

// @route   DELETE /api/v1/auth/roles/:roleId/permissions/:permissionId
// @desc    Remove a permission from a role
// @access  Private (Super Admin)
router.delete('/roles/:roleId/permissions/:permissionId', authenticateToken, requireRole(['admin']), RoleController.removePermission);

// Permission routes

// @route   GET /api/v1/auth/permissions
// @desc    Get all permissions
// @access  Private (Super Admin)
router.get('/permissions', authenticateToken, requireRole(['admin']), PermissionController.getAllPermissions);

// @route   GET /api/v1/auth/permissions/:id
// @desc    Get permission by id
// @access  Private (Super Admin)
router.get('/permissions/:id', authenticateToken, requireRole(['admin']), PermissionController.getPermissionById);

// @route   GET /api/v1/auth/permissions/module/:moduleName
// @desc    Get all permissions by module
// @access  Private (Super Admin)
router.get('/permissions/module/:moduleName', [
  authenticateToken,
  requireRole(['admin'])
], PermissionController.getPermissionsByModule);

// @route   POST /api/v1/auth/permissions
// @desc    Create a new permission
// @access  Private (Super Admin)
router.post('/permissions', authenticateToken, requireRole(['admin']), validationMiddleware.validatePermission, validateRequest(), PermissionController.createPermission);

// @route   PUT /api/v1/auth/permissions/:id
// @desc    Update a permission
// @access  Private (Super Admin)
router.put('/permissions/:id', authenticateToken, requireRole(['admin']), validationMiddleware.validatePermission, validateRequest(), PermissionController.updatePermission);

// @route   DELETE /api/v1/auth/permissions/:id
// @desc    Delete a permission
// @access  Private (Super Admin)
router.delete('/permissions/:id', authenticateToken, requireRole(['admin']), PermissionController.deletePermission);

module.exports = router; 