const express = require('express');
const router = express.Router();
const InvoiceController = require('../controllers/InvoiceController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route   GET /api/v1/invoices
 * @desc    Get all invoices with pagination and filters
 * @access  Private
 */
router.get('/', InvoiceController.getInvoices);

/**
 * @route   GET /api/v1/invoices/stats
 * @desc    Get invoice statistics
 * @access  Private
 */
router.get('/stats', InvoiceController.getInvoiceStats);

/**
 * @route   GET /api/v1/invoices/:id
 * @desc    Get invoice by ID
 * @access  Private
 */
router.get('/:id', InvoiceController.getInvoice);

/**
 * @route   POST /api/v1/invoices
 * @desc    Create new invoice
 * @access  Private
 */
router.post('/', InvoiceController.createInvoice);

/**
 * @route   POST /api/v1/invoices/from-transaction/:transaction_id
 * @desc    Create invoice from POS transaction
 * @access  Private
 */
router.post('/from-transaction/:transaction_id', InvoiceController.createFromTransaction);

/**
 * @route   PUT /api/v1/invoices/:id/status
 * @desc    Update invoice status
 * @access  Private
 */
router.put('/:id/status', InvoiceController.updateInvoiceStatus);

/**
 * @route   DELETE /api/v1/invoices/:id
 * @desc    Delete invoice
 * @access  Private
 */
router.delete('/:id', InvoiceController.deleteInvoice);

module.exports = router;
