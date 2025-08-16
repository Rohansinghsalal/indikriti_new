/**
 * Discount Controller - Handles discount codes and promotions
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');
const { Op } = require('sequelize');

/**
 * Get all discounts with pagination and filtering
 */
exports.getAllDiscounts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    
    // Mock discounts data
    const discounts = [
      {
        id: 1,
        code: 'SUMMER2023',
        type: 'percentage',
        value: 20,
        description: 'Summer sale 20% off',
        min_order_value: 50,
        starts_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        usage_limit: 100,
        usage_count: 45
      },
      {
        id: 2,
        code: 'WELCOME10',
        type: 'fixed',
        value: 10,
        description: 'Welcome discount $10 off',
        min_order_value: 50,
        starts_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        expires_at: null,
        status: 'active',
        usage_limit: null,
        usage_count: 210
      }
    ];
    
    return res.json({
      success: true,
      data: discounts,
      meta: {
        total: discounts.length,
        page,
        limit,
        pages: Math.ceil(discounts.length / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching discounts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch discounts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get discount by ID
 */
exports.getDiscountById = async (req, res) => {
  try {
    const discountId = req.params.id;
    
    // Mock discount data
    const discount = {
      id: discountId,
      code: 'SUMMER2023',
      type: 'percentage',
      value: 20,
      description: 'Summer sale 20% off',
      min_order_value: 50,
      starts_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      usage_limit: 100,
      usage_count: 45,
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      created_by: 1
    };
    
    return res.json({
      success: true,
      data: discount
    });
  } catch (error) {
    logger.error('Error fetching discount:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch discount',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new discount
 */
exports.createDiscount = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    // Mock response
    const discount = {
      id: Date.now(),
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: req.user?.id || 1
    };
    
    return res.status(201).json({
      success: true,
      message: 'Discount created successfully',
      data: discount
    });
  } catch (error) {
    logger.error('Error creating discount:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create discount',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update discount
 */
exports.updateDiscount = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const discountId = req.params.id;
    
    // Mock updated discount
    const discount = {
      id: discountId,
      ...req.body,
      updated_at: new Date(),
      updated_by: req.user?.id || 1
    };
    
    return res.json({
      success: true,
      message: 'Discount updated successfully',
      data: discount
    });
  } catch (error) {
    logger.error('Error updating discount:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update discount',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete discount
 */
exports.deleteDiscount = async (req, res) => {
  try {
    const discountId = req.params.id;
    
    return res.json({
      success: true,
      message: 'Discount deleted successfully',
      data: { id: discountId }
    });
  } catch (error) {
    logger.error('Error deleting discount:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete discount',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Toggle discount status
 */
exports.toggleDiscountStatus = async (req, res) => {
  try {
    const discountId = req.params.id;
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be active or inactive'
      });
    }
    
    return res.json({
      success: true,
      message: `Discount status changed to ${status}`,
      data: { id: discountId, status }
    });
  } catch (error) {
    logger.error('Error toggling discount status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle discount status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get discount by code
 */
exports.getDiscountByCode = async (req, res) => {
  try {
    const code = req.params.code;
    
    // Mock discount data
    const discount = {
      id: 1,
      code: code,
      type: 'percentage',
      value: 20,
      description: 'Summer sale 20% off',
      min_order_value: 50,
      starts_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      usage_limit: 100,
      usage_count: 45
    };
    
    return res.json({
      success: true,
      data: discount
    });
  } catch (error) {
    logger.error('Error fetching discount by code:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch discount by code',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
