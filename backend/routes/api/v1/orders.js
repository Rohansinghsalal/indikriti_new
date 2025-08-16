/**
 * Order Management Routes
 */
const express = require('express');
const router = express.Router();
const OrderController = require('../../../controllers/order/OrderController');
const OrderStatusController = require('../../../controllers/order/OrderStatusController');
const FulfillmentController = require('../../../controllers/order/FulfillmentController');
const permissionMiddleware = require('../../../middleware/permissionCheck');
const { validateRequest } = require('../../../middleware/validation');

// Order routes
router.get('/', permissionMiddleware('orders:view'), OrderController.index);
router.get('/search', permissionMiddleware('orders:view'), OrderController.searchOrders);
router.get('/:id', permissionMiddleware('orders:view'), OrderController.show);
router.post('/', permissionMiddleware('orders:create'), validateRequest(), OrderController.store);
router.put('/:id', permissionMiddleware('orders:update'), validateRequest(), OrderController.update);
router.delete('/:id', permissionMiddleware('orders:delete'), OrderController.cancelOrder);

// Order items management
router.post('/:id/items', permissionMiddleware('orders:update'), validateRequest(), OrderController.addOrderItem);
router.put('/:id/items/:itemId', permissionMiddleware('orders:update'), validateRequest(), OrderController.updateOrderItem);
router.delete('/:id/items/:itemId', permissionMiddleware('orders:update'), OrderController.removeOrderItem);

// Order status management
router.get('/statuses/all', permissionMiddleware('orders:view'), OrderStatusController.getAllOrderStatuses);
router.get('/status/:statusCode', permissionMiddleware('orders:view'), OrderStatusController.getOrdersByStatus);
router.put('/:id/status', permissionMiddleware('orders:update'), validateRequest(), OrderStatusController.updateOrderStatus);
router.get('/:id/history', permissionMiddleware('orders:view'), OrderStatusController.getOrderStatusHistory);

// Order fulfillment
router.post('/:id/fulfill', permissionMiddleware('orders:fulfill'), validateRequest(), FulfillmentController.fulfillOrder);
router.get('/:id/fulfillment', permissionMiddleware('orders:view'), FulfillmentController.getFulfillmentDetails);
router.post('/:id/ship', permissionMiddleware('orders:fulfill'), validateRequest(), FulfillmentController.shipOrder);
router.get('/shipments/all', permissionMiddleware('orders:view'), FulfillmentController.getAllShipments);
router.post('/:id/tracking', permissionMiddleware('orders:update'), validateRequest(), FulfillmentController.addTrackingInfo);

// Order notes
router.get('/:id/notes', permissionMiddleware('orders:view'), OrderController.getOrderNotes);
router.post('/:id/notes', permissionMiddleware('orders:update'), validateRequest(), OrderController.addOrderNote);
router.put('/:id/notes/:noteId', permissionMiddleware('orders:update'), validateRequest(), OrderController.updateOrderNote);
router.delete('/:id/notes/:noteId', permissionMiddleware('orders:update'), OrderController.deleteOrderNote);

// Order documents
router.get('/:id/invoice', permissionMiddleware('orders:view'), OrderController.generateInvoice);
router.get('/:id/packing-slip', permissionMiddleware('orders:view'), OrderController.generatePackingSlip);
router.get('/:id/receipt', permissionMiddleware('orders:view'), OrderController.generateReceipt);

// Batch operations
router.post('/batch/status', permissionMiddleware('orders:update'), validateRequest(), OrderStatusController.batchUpdateOrderStatus);
router.post('/batch/export', permissionMiddleware('orders:view'), OrderController.exportOrders);

module.exports = router;