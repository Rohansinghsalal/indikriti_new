/**
 * POS (Point of Sale) Routes
 */
const express = require('express');
const router = express.Router();
const POSController = require('../../../controllers/pos/POSController');
const ReceiptController = require('../../../controllers/pos/ReceiptController');
const OfflineController = require('../../../controllers/pos/OfflineController');
const { authenticateToken } = require('../../../middleware/auth');
const permissionMiddleware = require('../../../middleware/permissionCheck');
const { validateRequest } = require('../../../middleware/validation');
const { body, param, query } = require('express-validator');

// Validation middleware
const validateTransaction = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.product_id')
    .isInt({ min: 1 })
    .withMessage('Valid product ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('items.*.unit_price')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('customer_name')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Customer name must be between 1 and 255 characters'),
  body('customer_email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required'),
  body('tax_amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tax amount must be a positive number'),
  body('discount_amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount amount must be a positive number')
];

// Main POS routes
router.get('/products', permissionMiddleware('pos:view'), POSController.getProductsForPOS);
router.get('/products/search', permissionMiddleware('pos:view'), POSController.searchProductsForPOS);
router.get('/customers', permissionMiddleware('pos:view'), POSController.getCustomersForPOS);
router.get('/customers/search', permissionMiddleware('pos:view'), POSController.searchCustomersForPOS);

// =============== NEW ENHANCED POS ROUTES ===============

// Public routes for testing (remove authentication for now)
router.get('/available-products', POSController.getAvailableProducts);
router.get('/search-products', POSController.searchProducts);
router.post('/check-stock', POSController.checkStockAvailability);
router.post('/process-transaction', POSController.processTransaction);
router.get('/transaction-history', POSController.getTransactionHistory);
router.post('/quick-customer', permissionMiddleware('pos:create'), validateRequest(), POSController.createQuickCustomer);

// POS transactions
router.post('/transactions', authenticateToken, validateTransaction, POSController.createTransaction);
router.get('/transactions/:id', authenticateToken, [
  param('id').isInt({ min: 1 }).withMessage('Valid transaction ID is required')
], POSController.getTransactionById);
router.get('/transactions', authenticateToken, POSController.getAllTransactions);
router.get('/transactions/daily', authenticateToken, POSController.getDailyTransactions);
router.post('/transactions/:id/void', permissionMiddleware('pos:delete'), POSController.voidTransaction);
router.put('/transactions/:id/note', permissionMiddleware('pos:update'), POSController.addTransactionNote);

// Payment Methods
router.get('/payment-methods', authenticateToken, POSController.getPaymentMethods);

// Receipt management
router.get('/receipts/:transactionId', permissionMiddleware('pos:view'), ReceiptController.generateReceipt);
router.post('/receipts/:transactionId/email', permissionMiddleware('pos:view'), validateRequest(), ReceiptController.emailReceipt);
router.post('/receipts/:transactionId/sms', permissionMiddleware('pos:view'), validateRequest(), ReceiptController.smsReceipt);
router.get('/receipts/:transactionId/print', permissionMiddleware('pos:view'), ReceiptController.getPrintableReceipt);

// Returns and exchanges
router.post('/returns', permissionMiddleware('pos:return'), validateRequest(), POSController.processReturn);
router.post('/exchanges', permissionMiddleware('pos:return'), validateRequest(), POSController.processExchange);
router.get('/returns/:id', permissionMiddleware('pos:view'), POSController.getReturnById);

// Cash management
router.post('/register/open', permissionMiddleware('pos:admin'), validateRequest(), POSController.openRegister);
router.post('/register/close', permissionMiddleware('pos:admin'), validateRequest(), POSController.closeRegister);
router.post('/register/count', permissionMiddleware('pos:admin'), validateRequest(), POSController.cashCount);
router.post('/register/payout', permissionMiddleware('pos:admin'), validateRequest(), POSController.recordPayout);
router.post('/register/deposit', permissionMiddleware('pos:admin'), validateRequest(), POSController.recordDeposit);

// Offline mode
router.get('/offline/sync', permissionMiddleware('pos:view'), OfflineController.getOfflineSyncData);
router.post('/offline/upload', permissionMiddleware('pos:create'), OfflineController.uploadOfflineTransactions);
router.post('/offline/config', permissionMiddleware('pos:admin'), OfflineController.updateOfflineConfig);

// Discounts and promotions
router.get('/discounts', permissionMiddleware('pos:view'), POSController.getActiveDiscounts);
router.post('/discounts/apply', permissionMiddleware('pos:create'), validateRequest(), POSController.validateDiscount);
router.post('/discounts/manual', permissionMiddleware('pos:admin'), validateRequest(), POSController.applyManualDiscount);

// Reports
router.get('/reports/daily', permissionMiddleware('pos:reports'), POSController.getDailyReport);
router.get('/reports/sales', permissionMiddleware('pos:reports'), POSController.getSalesReport);
router.get('/reports/products', permissionMiddleware('pos:reports'), POSController.getProductSalesReport);
router.get('/reports/staff', permissionMiddleware('pos:reports'), POSController.getStaffSalesReport);
router.get('/reports/export/:reportType', permissionMiddleware('pos:reports'), POSController.exportReport);

module.exports = router;