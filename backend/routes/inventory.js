const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventory/InventoryController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Apply authentication to all inventory routes
router.use(authenticateToken);

// Apply role-based access control (admin or manager can access inventory)
router.use(requireRole(['admin', 'manager']));

/**
 * @route GET /api/v1/inventory
 * @desc Get all products for inventory management
 * @access Private (Admin/Manager)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 50)
 * @query {string} brand - Filter by brand (indikriti/winsomeLane)
 * @query {string} status - Filter by status (active/inactive/draft)
 * @query {string} search - Search in product name, SKU, or product_id
 * @query {string} sortBy - Sort field (default: created_at)
 * @query {string} sortOrder - Sort order (ASC/DESC, default: DESC)
 * @query {boolean} lowStock - Filter low stock products
 * @query {boolean} outOfStock - Filter out of stock products
 */
router.get('/', InventoryController.getAllInventory);

/**
 * @route GET /api/v1/inventory/stats
 * @desc Get inventory statistics
 * @access Private (Admin/Manager)
 * @query {string} brand - Filter by brand (optional)
 */
router.get('/stats', InventoryController.getInventoryStats);

/**
 * @route GET /api/v1/inventory/low-stock
 * @desc Get low stock products
 * @access Private (Admin/Manager)
 * @query {number} threshold - Stock threshold (default: 10)
 * @query {string} brand - Filter by brand (optional)
 */
router.get('/low-stock', InventoryController.getLowStockProducts);

/**
 * @route GET /api/v1/inventory/out-of-stock
 * @desc Get out of stock products
 * @access Private (Admin/Manager)
 * @query {string} brand - Filter by brand (optional)
 */
router.get('/out-of-stock', InventoryController.getOutOfStockProducts);

module.exports = router;
