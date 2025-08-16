/**
 * Invoice API Routes
 * Handles invoice generation, management, and PDF export
 */
const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { authenticateToken } = require('../../../middleware/auth');
const InvoiceController = require('../../../controllers/InvoiceController');

// Validation middleware
const validateInvoiceCreation = [
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Valid due date is required (YYYY-MM-DD format)'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  body('terms')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Terms must be less than 1000 characters')
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

const validateIdParam = [
  param('id').isInt({ min: 1 }).withMessage('Valid ID is required')
];

const validateTransactionIdParam = [
  param('transaction_id').isInt({ min: 1 }).withMessage('Valid transaction ID is required')
];

const validateOrderIdParam = [
  param('order_id').isInt({ min: 1 }).withMessage('Valid order ID is required')
];

// Invoice Routes
router.get('/', authenticateToken, validatePagination, InvoiceController.getInvoices);
router.get('/stats', authenticateToken, InvoiceController.getInvoiceStats);
router.get('/:id', authenticateToken, validateIdParam, InvoiceController.getInvoice);

// Create invoices
router.post('/', authenticateToken, validateInvoiceCreation, InvoiceController.createInvoice);
router.post('/from-transaction/:transaction_id', authenticateToken, validateTransactionIdParam, validateInvoiceCreation, InvoiceController.createFromTransaction);

// Invoice status updates
router.put('/:id/status', authenticateToken, validateIdParam, [
  body('status')
    .isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled'])
    .withMessage('Valid status is required')
], InvoiceController.updateInvoiceStatus);

// Delete invoice
router.delete('/:id', authenticateToken, validateIdParam, InvoiceController.deleteInvoice);

module.exports = router;
