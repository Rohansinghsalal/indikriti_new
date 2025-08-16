/**
 *  - Basic controller structure
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

/**
 * List all records
 */
exports.index = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: 'Controller initialized successfully'
    });
  } catch (error) {
    logger.error('Error in controller:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
