/**
 * User Management Validation Middleware
 */

const { body, param, query } = require('express-validator');

/**
 * Validation for creating a new user
 */
const validateCreateUser = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email must not exceed 100 characters'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('userType')
    .optional()
    .isIn(['admin', 'employee', 'user'])
    .withMessage('User type must be admin, employee, or user'),

  body('accessLevel')
    .optional()
    .isIn(['limited', 'full', 'super'])
    .withMessage('Access level must be limited, full, or super'),

  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),

  body('department')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Department must not exceed 100 characters'),

  body('roleId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Role ID must be a positive integer'),

  body('companyId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Company ID must be a positive integer')
];

/**
 * Validation for updating a user
 */
const validateUpdateUser = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),

  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email must not exceed 100 characters'),

  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('accessLevel')
    .optional()
    .isIn(['limited', 'full', 'super'])
    .withMessage('Access level must be limited, full, or super'),

  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),

  body('department')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Department must not exceed 100 characters'),

  body('roleId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Role ID must be a positive integer'),

  body('companyId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Company ID must be a positive integer'),

  query('userType')
    .optional()
    .isIn(['admin', 'employee', 'user'])
    .withMessage('User type must be admin, employee, or user')
];

/**
 * Validation for getting a user by ID
 */
const validateGetUser = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),

  query('userType')
    .optional()
    .isIn(['admin', 'employee', 'user'])
    .withMessage('User type must be admin, employee, or user')
];

/**
 * Validation for deleting a user
 */
const validateDeleteUser = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),

  query('userType')
    .isIn(['admin', 'employee', 'user'])
    .withMessage('User type must be admin, employee, or user')
];

/**
 * Validation for user listing with pagination
 */
const validateGetUsers = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('search')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Search term must not exceed 100 characters'),

  query('role')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Role filter must not exceed 50 characters'),

  query('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status filter must be active or inactive'),

  query('userType')
    .optional()
    .isIn(['admin', 'employee', 'user'])
    .withMessage('User type filter must be admin, employee, or user')
];

/**
 * Validation for role creation
 */
const validateCreateRole = [
  body('name')
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Role name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Role name can only contain letters, numbers, spaces, hyphens, and underscores'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array'),

  body('permissions.*')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Each permission ID must be a positive integer')
];

/**
 * Validation for role update
 */
const validateUpdateRole = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Role ID must be a positive integer'),

  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Role name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Role name can only contain letters, numbers, spaces, hyphens, and underscores'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array'),

  body('permissions.*')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Each permission ID must be a positive integer')
];

/**
 * Validation for permission creation
 */
const validateCreatePermission = [
  body('name')
    .notEmpty()
    .withMessage('Permission name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Permission name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\.\-_]+$/)
    .withMessage('Permission name can only contain letters, numbers, dots, hyphens, and underscores'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('module')
    .notEmpty()
    .withMessage('Module is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Module must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('Module can only contain letters, numbers, hyphens, and underscores')
];

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateGetUser,
  validateDeleteUser,
  validateGetUsers,
  validateCreateRole,
  validateUpdateRole,
  validateCreatePermission
};
