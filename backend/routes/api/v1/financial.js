/**
 * Financial Management Routes
 */
const express = require('express');
const router = express.Router();
const PaymentController = require('../../../controllers/financial/PaymentController');
const RefundController = require('../../../controllers/financial/RefundController');
const DiscountController = require('../../../controllers/financial/DiscountController');
const ReportController = require('../../../controllers/financial/ReportController');
const permissionMiddleware = require('../../../middleware/permissionCheck');
const { validateRequest } = require('../../../middleware/validation');

// Payment routes
router.get('/payments', permissionMiddleware('payments:view'), PaymentController.getAllPayments);
router.get('/payments/:id', permissionMiddleware('payments:view'), PaymentController.getPaymentById);
router.post('/payments', permissionMiddleware('payments:create'), validateRequest(), PaymentController.createPayment);
router.put('/payments/:id', permissionMiddleware('payments:update'), validateRequest(), PaymentController.updatePayment);
router.get('/payments/order/:orderId', permissionMiddleware('payments:view'), PaymentController.getPaymentsByOrder);

// Payment methods
router.get('/payment-methods', permissionMiddleware('payments:view'), PaymentController.getPaymentMethods);
router.post('/payment-methods', permissionMiddleware('payments:admin'), validateRequest(), PaymentController.createPaymentMethod);
router.put('/payment-methods/:id', permissionMiddleware('payments:admin'), validateRequest(), PaymentController.updatePaymentMethod);
router.delete('/payment-methods/:id', permissionMiddleware('payments:admin'), PaymentController.deletePaymentMethod);
router.put('/payment-methods/:id/status', permissionMiddleware('payments:admin'), PaymentController.togglePaymentMethodStatus);

// Refund routes
router.get('/refunds', permissionMiddleware('refunds:view'), RefundController.getAllRefunds);
router.get('/refunds/:id', permissionMiddleware('refunds:view'), RefundController.getRefundById);
router.post('/refunds', permissionMiddleware('refunds:create'), validateRequest(), RefundController.createRefund);
router.put('/refunds/:id', permissionMiddleware('refunds:update'), validateRequest(), RefundController.updateRefund);
router.get('/refunds/payment/:paymentId', permissionMiddleware('refunds:view'), RefundController.getRefundsByPayment);
router.get('/refunds/order/:orderId', permissionMiddleware('refunds:view'), RefundController.getRefundsByOrder);

// Discount routes
router.get('/discounts', permissionMiddleware('discounts:view'), DiscountController.getAllDiscounts);
router.get('/discounts/:id', permissionMiddleware('discounts:view'), DiscountController.getDiscountById);
router.post('/discounts', permissionMiddleware('discounts:create'), validateRequest(), DiscountController.createDiscount);
router.put('/discounts/:id', permissionMiddleware('discounts:update'), validateRequest(), DiscountController.updateDiscount);
router.delete('/discounts/:id', permissionMiddleware('discounts:delete'), DiscountController.deleteDiscount);
router.put('/discounts/:id/status', permissionMiddleware('discounts:update'), DiscountController.toggleDiscountStatus);
router.get('/discounts/code/:code', permissionMiddleware('discounts:view'), DiscountController.getDiscountByCode);

// Financial reports
router.get('/reports/sales', permissionMiddleware('reports:view'), ReportController.getSalesReport);
router.get('/reports/revenue', permissionMiddleware('reports:view'), ReportController.getRevenueReport);
router.get('/reports/payments', permissionMiddleware('reports:view'), ReportController.getPaymentsReport);
router.get('/reports/refunds', permissionMiddleware('reports:view'), ReportController.getRefundsReport);
router.get('/reports/taxes', permissionMiddleware('reports:view'), ReportController.getTaxReport);
router.get('/reports/discounts', permissionMiddleware('reports:view'), ReportController.getDiscountsReport);
router.post('/reports/custom', permissionMiddleware('reports:view'), validateRequest(), ReportController.generateCustomReport);
router.get('/reports/export/:reportId', permissionMiddleware('reports:view'), ReportController.exportReport);

// Tax management
router.get('/taxes', permissionMiddleware('taxes:view'), PaymentController.getAllTaxRates);
router.get('/taxes/:id', permissionMiddleware('taxes:view'), PaymentController.getTaxRateById);
router.post('/taxes', permissionMiddleware('taxes:admin'), validateRequest(), PaymentController.createTaxRate);
router.put('/taxes/:id', permissionMiddleware('taxes:admin'), validateRequest(), PaymentController.updateTaxRate);
router.delete('/taxes/:id', permissionMiddleware('taxes:admin'), PaymentController.deleteTaxRate);

module.exports = router; 