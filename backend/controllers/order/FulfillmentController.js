/**
 *  - Basic controller structure
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');
const { Order } = require('../../models');

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

/**
 * Order Fulfillment Controller - Handles order fulfillment and shipping
 */

/**
 * Fulfill an order
 */
exports.fulfillOrder = async (req, res) => {
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
    
    const { id } = req.params;
    const { items, warehouse_id, notes } = req.body;
    
    // Find order
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to requester's company (unless super admin)
    if (req.companyId && !req.isSuperAdmin && order.company_id !== req.companyId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to fulfill this order'
      });
    }
    
    // Check if order is in a status that can be fulfilled
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot fulfill order with status '${order.status}'`
      });
    }
    
    // Update order status to packed
    await order.update({
      status: 'packed',
      fulfillment_notes: notes,
      fulfilled_by: req.user.id,
      fulfilled_at: new Date(),
      updated_by: req.user.id
    });
    
    // In a real application, we would:
    // 1. Create fulfillment record
    // 2. Update inventory
    // 3. Generate packing slip
    
    return res.json({
      success: true,
      message: 'Order has been fulfilled successfully',
      data: {
        id: order.id,
        status: order.status,
        fulfilled_at: order.fulfilled_at
      }
    });
  } catch (error) {
    logger.error('Error fulfilling order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fulfill order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get fulfillment details for an order
 */
exports.getFulfillmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find order
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to requester's company (unless super admin)
    if (req.companyId && !req.isSuperAdmin && order.company_id !== req.companyId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this order'
      });
    }
    
    // Mock fulfillment data
    const fulfillment = {
      order_id: id,
      status: order.status,
      fulfilled_by: order.fulfilled_by,
      fulfilled_at: order.fulfilled_at,
      warehouse_id: 1,
      warehouse_name: 'Main Warehouse',
      notes: order.fulfillment_notes,
      items: [
        {
          product_id: 1,
          product_name: 'Product 1',
          quantity: 2,
          fulfilled_quantity: 2,
          sku: 'SKU001'
        },
        {
          product_id: 2,
          product_name: 'Product 2',
          quantity: 1,
          fulfilled_quantity: 1,
          sku: 'SKU002'
        }
      ]
    };
    
    return res.json({
      success: true,
      data: fulfillment
    });
  } catch (error) {
    logger.error('Error getting fulfillment details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get fulfillment details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Ship an order
 */
exports.shipOrder = async (req, res) => {
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
    
    const { id } = req.params;
    const { 
      carrier, 
      tracking_number, 
      shipping_date = new Date(),
      expected_delivery_date,
      shipping_cost,
      notes 
    } = req.body;
    
    // Find order
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to requester's company (unless super admin)
    if (req.companyId && !req.isSuperAdmin && order.company_id !== req.companyId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to ship this order'
      });
    }
    
    // Check if order is in a status that can be shipped
    if (!['packed', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot ship order with status '${order.status}'`
      });
    }
    
    // Update order
    await order.update({
      status: 'shipped',
      shipping_carrier: carrier,
      tracking_number,
      shipping_date,
      expected_delivery_date,
      actual_shipping_cost: shipping_cost,
      shipping_notes: notes,
      shipped_by: req.user.id,
      shipped_at: new Date(),
      updated_by: req.user.id
    });
    
    // In a real application, we would:
    // 1. Create shipment record
    // 2. Update fulfillment status
    // 3. Send tracking info to customer via email
    
    return res.json({
      success: true,
      message: 'Order has been shipped successfully',
      data: {
        id: order.id,
        status: order.status,
        tracking_number,
        carrier,
        shipped_at: order.shipped_at
      }
    });
  } catch (error) {
    logger.error('Error shipping order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to ship order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all shipments
 */
exports.getAllShipments = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    
    // Build filters for shipped orders
    const where = { status: 'shipped' };
    
    if (req.query.carrier) {
      where.shipping_carrier = req.query.carrier;
    }
    
    if (req.query.from_date && req.query.to_date) {
      where.shipping_date = {
        [Op.between]: [
          new Date(req.query.from_date),
          new Date(req.query.to_date)
        ]
      };
    }
    
    // Add company filter (if applicable)
    if (req.companyId && !req.isSuperAdmin) {
      where.company_id = req.companyId;
    }
    
    // Get shipped orders
    const { count, rows } = await Order.findAndCountAll({
      where,
      limit,
      offset,
      order: [['shipping_date', 'DESC']]
    });
    
    return res.json({
      success: true,
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching shipments:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch shipments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Add tracking info to order
 */
exports.addTrackingInfo = async (req, res) => {
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
    
    const { id } = req.params;
    const { carrier, tracking_number, notes } = req.body;
    
    // Find order
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to requester's company (unless super admin)
    if (req.companyId && !req.isSuperAdmin && order.company_id !== req.companyId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this order'
      });
    }
    
    // Update order
    await order.update({
      shipping_carrier: carrier,
      tracking_number,
      shipping_notes: notes ? (order.shipping_notes ? `${order.shipping_notes}\n${notes}` : notes) : order.shipping_notes,
      updated_by: req.user.id
    });
    
    // In a real application, we would:
    // 1. Update shipment record
    // 2. Notify customer of tracking info
    
    return res.json({
      success: true,
      message: 'Tracking information added successfully',
      data: {
        id: order.id,
        tracking_number,
        carrier
      }
    });
  } catch (error) {
    logger.error('Error adding tracking info:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add tracking information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
