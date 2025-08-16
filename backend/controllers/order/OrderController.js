/**
 * Order Controller - Handles order processing
 */

const { Order, OrderItem, User, Product, Company } = require('../../models');
const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

/**
 * Get all orders with pagination and filtering
 */
exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    
    // Build filters
    const where = {};
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (req.query.customer_id) {
      where.customer_id = req.query.customer_id;
    }
    
    // Filter by date range
    if (req.query.from_date && req.query.to_date) {
      where.order_date = {
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
    
    // Get orders with pagination
    const { count, rows } = await Order.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { 
          model: User, 
          as: 'customer',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        { model: Company, attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
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
    logger.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Search orders
 */
exports.searchOrders = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }
    
    const { count, rows } = await Order.findAndCountAll({
      where: {
        [Op.or]: [
          { order_number: { [Op.like]: `%${searchTerm}%` } },
          { '$customer.email$': { [Op.like]: `%${searchTerm}%` } },
          { '$customer.first_name$': { [Op.like]: `%${searchTerm}%` } },
          { '$customer.last_name$': { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      include: [
        { 
          model: User, 
          as: 'customer',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
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
    logger.error('Error searching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get order by ID
 */
exports.show = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Find order by ID with all related data
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        { 
          model: User, 
          as: 'customer',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
        },
        { model: Company, attributes: ['id', 'name'] },
        { 
          model: OrderItem,
          include: [
            { model: Product, attributes: ['id', 'name', 'sku', 'price'] }
          ]
        }
      ]
    });
    
    // Check if order exists
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
    
    return res.json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error('Error fetching order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new order
 */
exports.store = async (req, res) => {
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
    
    const {
      customer_id,
      order_items,
      shipping_address,
      billing_address,
      payment_method,
      shipping_method,
      subtotal,
      tax,
      shipping_cost,
      discount,
      total,
      notes,
      status = 'pending',
      company_id
    } = req.body;
    
    // Determine company_id
    let finalCompanyId = company_id;
    if (!req.isSuperAdmin || !finalCompanyId) {
      finalCompanyId = req.companyId;
    }
    
    // Create order
    const order = await Order.create({
      customer_id,
      order_number: generateOrderNumber(),
      order_date: new Date(),
      shipping_address,
      billing_address,
      payment_method,
      shipping_method,
      subtotal,
      tax,
      shipping_cost,
      discount,
      total,
      notes,
      status,
      company_id: finalCompanyId,
      created_by: req.user.id
    });
    
    // Add order items
    if (order_items && order_items.length > 0) {
      const orderItemsToCreate = order_items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.unit_price * item.quantity,
        discount: item.discount || 0,
      }));
      
      await OrderItem.bulkCreate(orderItemsToCreate);
    }
    
    // Fetch the newly created order with items
    const newOrder = await Order.findOne({
      where: { id: order.id },
      include: [
        { model: OrderItem, include: [{ model: Product }] },
        { model: User, as: 'customer', attributes: ['id', 'first_name', 'last_name', 'email'] }
      ]
    });
    
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    logger.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update order
 */
exports.update = async (req, res) => {
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
    
    const orderId = req.params.id;
    
    // Find order by ID
    const order = await Order.findByPk(orderId);
    
    // Check if order exists
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
    
    // Update order details
    const {
      shipping_address,
      billing_address,
      payment_method,
      shipping_method,
      subtotal,
      tax,
      shipping_cost,
      discount,
      total,
      notes,
      status
    } = req.body;
    
    // Update order
    await order.update({
      shipping_address: shipping_address || order.shipping_address,
      billing_address: billing_address || order.billing_address,
      payment_method: payment_method || order.payment_method,
      shipping_method: shipping_method || order.shipping_method,
      subtotal: subtotal || order.subtotal,
      tax: tax || order.tax,
      shipping_cost: shipping_cost || order.shipping_cost,
      discount: discount || order.discount,
      total: total || order.total,
      notes: notes || order.notes,
      status: status || order.status,
      updated_by: req.user.id
    });
    
    // Fetch updated order with related data
    const updatedOrder = await Order.findOne({
      where: { id: orderId },
      include: [
        { model: OrderItem, include: [{ model: Product }] },
        { model: User, as: 'customer', attributes: ['id', 'first_name', 'last_name', 'email'] }
      ]
    });
    
    return res.json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    logger.error('Error updating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Cancel order
 */
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Find order by ID
    const order = await Order.findByPk(orderId);
    
    // Check if order exists
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
        message: 'You do not have permission to cancel this order'
      });
    }
    
    // Check if order can be canceled
    if (['delivered', 'completed', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order in '${order.status}' status`
      });
    }
    
    // Update order status
    await order.update({
      status: 'cancelled',
      updated_by: req.user.id,
      cancellation_reason: req.body.reason || 'Cancelled by admin'
    });
    
    return res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    logger.error('Error cancelling order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Additional functions for other routes
exports.addOrderItem = async (req, res) => {
  res.json({ message: 'Add order item functionality' });
};

exports.updateOrderItem = async (req, res) => {
  res.json({ message: 'Update order item functionality' });
};

exports.removeOrderItem = async (req, res) => {
  res.json({ message: 'Remove order item functionality' });
};

exports.getOrderNotes = async (req, res) => {
  res.json({ message: 'Get order notes functionality' });
};

exports.addOrderNote = async (req, res) => {
  res.json({ message: 'Add order note functionality' });
};

exports.updateOrderNote = async (req, res) => {
  res.json({ message: 'Update order note functionality' });
};

exports.deleteOrderNote = async (req, res) => {
  res.json({ message: 'Delete order note functionality' });
};

exports.generateInvoice = async (req, res) => {
  res.json({ message: 'Generate invoice functionality' });
};

exports.generatePackingSlip = async (req, res) => {
  res.json({ message: 'Generate packing slip functionality' });
};

exports.generateReceipt = async (req, res) => {
  res.json({ message: 'Generate receipt functionality' });
};

exports.exportOrders = async (req, res) => {
  res.json({ message: 'Export orders functionality' });
};

/**
 * Helper function to generate a unique order number
 */
function generateOrderNumber() {
  const prefix = 'ORD';
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
} 