/**
 * Real-Time Inventory API Routes
 */

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const RealTimeInventoryController = require('../../../controllers/inventory/RealTimeInventoryController');

// =============== INVENTORY VIEWING ROUTES ===============

/**
 * @route GET /api/v1/inventory/products
 * @desc Get all products with stock information
 * @access Public (for testing)
 */
router.get('/products', RealTimeInventoryController.getAllProductsWithStock);

/**
 * @route GET /api/v1/inventory/low-stock
 * @desc Get low stock products
 * @access Public (for testing)
 */
router.get('/low-stock', RealTimeInventoryController.getLowStockProducts);

/**
 * @route GET /api/v1/inventory/summary
 * @desc Get inventory summary statistics
 * @access Public (for testing)
 */
router.get('/summary', RealTimeInventoryController.getInventorySummary);

// =============== STOCK MANAGEMENT ROUTES ===============

/**
 * @route POST /api/v1/inventory/products/:productId/add-stock
 * @desc Add stock to a product
 * @access Public (for testing)
 */
router.post('/products/:productId/add-stock', [
  param('productId').isInt().withMessage('Product ID must be an integer'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('reason').optional().isString().withMessage('Reason must be a string')
], RealTimeInventoryController.addStock);

/**
 * @route POST /api/v1/inventory/products/:productId/remove-stock
 * @desc Remove stock from a product
 * @access Public (for testing)
 */
router.post('/products/:productId/remove-stock', [
  param('productId').isInt().withMessage('Product ID must be an integer'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('reason').optional().isString().withMessage('Reason must be a string')
], RealTimeInventoryController.removeStock);

/**
 * @route PUT /api/v1/inventory/products/:productId/stock
 * @desc Update stock quantity directly
 * @access Public (for testing)
 */
router.put('/products/:productId/stock', [
  param('productId').isInt().withMessage('Product ID must be an integer'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('reason').optional().isString().withMessage('Reason must be a string')
], RealTimeInventoryController.updateStock);

/**
 * @route POST /api/v1/inventory/bulk-update
 * @desc Bulk stock update for multiple products
 * @access Public (for testing)
 */
router.post('/bulk-update', [
  body('updates').isArray().withMessage('Updates must be an array'),
  body('updates.*.productId').isInt().withMessage('Product ID must be an integer'),
  body('updates.*.quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('updates.*.operation').isIn(['add', 'remove', 'update']).withMessage('Operation must be add, remove, or update'),
  body('updates.*.reason').optional().isString().withMessage('Reason must be a string')
], RealTimeInventoryController.bulkStockUpdate);

module.exports = router;
