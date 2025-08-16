/**
 * User Management Routes
 */
const express = require('express');
const router = express.Router();
const UserController = require('../../../controllers/user/UserController');
const CustomerController = require('../../../controllers/user/CustomerController');
const StaffController = require('../../../controllers/user/StaffController');
const ReferralController = require('../../../controllers/user/ReferralController');
const { authenticateToken, requireRole } = require('../../../middleware/auth');
const roleCheck = require('../../../middleware/roleCheck');
const permissionCheck = require('../../../middleware/permissionCheck');
const validate = require('../../../middleware/validation');

// Middleware for checking permissions
const checkPermission = (permission) => permissionCheck(permission);

// User routes
router.get('/', authenticateToken, checkPermission('users:view'), UserController.getAllUsers);
router.get('/search', authenticateToken, checkPermission('users:view'), UserController.searchUsers);
router.get('/:id', authenticateToken, checkPermission('users:view'), UserController.getUserById);
router.post('/', authenticateToken, checkPermission('users:create'), UserController.createUser);
router.put('/:id', authenticateToken, checkPermission('users:update'), UserController.updateUser);
router.delete('/:id', authenticateToken, checkPermission('users:delete'), UserController.deleteUser);
router.put('/:id/status', authenticateToken, checkPermission('users:update'), UserController.updateUserStatus);
router.get('/:id/activity', authenticateToken, checkPermission('users:view'), UserController.getUserActivity);

// Staff management routes
router.get('/staff/all', authenticateToken, checkPermission('staff:view'), StaffController.getAllStaff);
router.get('/staff/:id', authenticateToken, checkPermission('staff:view'), StaffController.getStaffById);
router.post('/staff', authenticateToken, checkPermission('staff:create'), StaffController.createStaff);
router.put('/staff/:id', authenticateToken, checkPermission('staff:update'), StaffController.updateStaff);
router.delete('/staff/:id', authenticateToken, checkPermission('staff:delete'), StaffController.deleteStaff);
router.put('/staff/:id/role', authenticateToken, checkPermission('staff:update'), StaffController.updateStaffRole);

// Customer management routes
router.get('/customers/all', authenticateToken, checkPermission('customers:view'), CustomerController.getAllCustomers);
router.get('/customers/search', authenticateToken, checkPermission('customers:view'), CustomerController.searchCustomers);
router.get('/customers/:id', authenticateToken, checkPermission('customers:view'), CustomerController.getCustomerById);
router.post('/customers', authenticateToken, checkPermission('customers:create'), CustomerController.createCustomer);
router.put('/customers/:id', authenticateToken, checkPermission('customers:update'), CustomerController.updateCustomer);
router.delete('/customers/:id', authenticateToken, checkPermission('customers:delete'), CustomerController.deleteCustomer);
router.get('/customers/:id/orders', authenticateToken, checkPermission('customers:view'), CustomerController.getCustomerOrders);
router.get('/customers/:id/activity', authenticateToken, checkPermission('customers:view'), CustomerController.getCustomerActivity);

// Referral routes
router.get('/referrals/all', authenticateToken, checkPermission('referrals:view'), ReferralController.getAllReferrals);
router.get('/referrals/:id', authenticateToken, checkPermission('referrals:view'), ReferralController.getReferralById);
router.post('/referrals', authenticateToken, checkPermission('referrals:create'), ReferralController.createReferral);
router.put('/referrals/:id', authenticateToken, checkPermission('referrals:update'), ReferralController.updateReferral);
router.delete('/referrals/:id', authenticateToken, checkPermission('referrals:delete'), ReferralController.deleteReferral);
router.get('/customers/:id/referrals', authenticateToken, checkPermission('referrals:view'), ReferralController.getCustomerReferrals);

// User profile (self-management)
router.get('/profile/me', authenticateToken, UserController.getProfile);
router.put('/profile/me', authenticateToken, UserController.updateProfile);
router.put('/profile/me/avatar', authenticateToken, UserController.updateAvatar);
router.put('/profile/me/preferences', authenticateToken, UserController.updatePreferences);

module.exports = router; 