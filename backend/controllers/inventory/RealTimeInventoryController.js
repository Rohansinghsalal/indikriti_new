/**
 * Real-Time Inventory Controller - Handles inventory management with Socket.io updates
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');
const RealTimeInventoryService = require('../../services/RealTimeInventoryService');

/**
 * Get all products with stock information
 */
exports.getAllProductsWithStock = async (req, res) => {
  try {
    const result = await RealTimeInventoryService.getAllProductsWithStock();
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    logger.error('Error in getAllProductsWithStock:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products with stock',
      error: error.message
    });
  }
};

/**
 * Get low stock products
 */
exports.getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    
    const result = await RealTimeInventoryService.getLowStockProducts(parseInt(threshold));
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    logger.error('Error in getLowStockProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock products',
      error: error.message
    });
  }
};

/**
 * Add stock to a product
 */
exports.addStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId } = req.params;
    const { quantity, reason } = req.body;
    const userId = req.user?.id || 1; // Default to admin user for testing
    
    const result = await RealTimeInventoryService.addStock(productId, quantity, reason, userId);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Error in addStock:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add stock',
      error: error.message
    });
  }
};

/**
 * Remove stock from a product
 */
exports.removeStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId } = req.params;
    const { quantity, reason } = req.body;
    const userId = req.user?.id || 1; // Default to admin user for testing
    
    const result = await RealTimeInventoryService.removeStock(productId, quantity, reason, userId);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Error in removeStock:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove stock',
      error: error.message
    });
  }
};

/**
 * Update stock quantity directly
 */
exports.updateStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId } = req.params;
    const { quantity, reason } = req.body;
    const userId = req.user?.id || 1; // Default to admin user for testing
    
    const result = await RealTimeInventoryService.updateStock(productId, quantity, reason, userId);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Error in updateStock:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    });
  }
};

/**
 * Get inventory summary statistics
 */
exports.getInventorySummary = async (req, res) => {
  try {
    const result = await RealTimeInventoryService.getInventorySummary();
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    logger.error('Error in getInventorySummary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory summary',
      error: error.message
    });
  }
};

/**
 * Bulk stock update
 */
exports.bulkStockUpdate = async (req, res) => {
  try {
    const { updates } = req.body;
    
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: 'Updates array is required'
      });
    }

    const results = [];
    const userId = req.user?.id || 1;

    for (const update of updates) {
      const { productId, quantity, operation, reason } = update;
      
      let result;
      switch (operation) {
        case 'add':
          result = await RealTimeInventoryService.addStock(productId, quantity, reason, userId);
          break;
        case 'remove':
          result = await RealTimeInventoryService.removeStock(productId, quantity, reason, userId);
          break;
        case 'update':
          result = await RealTimeInventoryService.updateStock(productId, quantity, reason, userId);
          break;
        default:
          result = {
            success: false,
            message: 'Invalid operation. Use add, remove, or update'
          };
      }
      
      results.push({
        productId,
        operation,
        ...result
      });
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    res.json({
      success: failureCount === 0,
      message: `Bulk update completed. ${successCount} successful, ${failureCount} failed.`,
      data: {
        results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: failureCount
        }
      }
    });

  } catch (error) {
    logger.error('Error in bulkStockUpdate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk stock update',
      error: error.message
    });
  }
};
