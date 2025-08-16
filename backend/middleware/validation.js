const { validationResult } = require('express-validator');

/**
 * Validate request middleware
 * Use this after validation rules from express-validator
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    message: 'Validation error',
    errors: errors.array()
  });
};

/**
 * Export a function that returns the validation middleware
 * This matches how it's being used in the routes with validateRequest()
 */
const validateRequest = () => validate;

module.exports = { validateRequest, validate };