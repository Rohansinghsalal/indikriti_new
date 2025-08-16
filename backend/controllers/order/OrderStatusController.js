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
 * Get all order statuses
 */
exports.getAllOrderStatuses = async (req, res) => {
  try {
    // For now, return predefined statuses
    const statuses = [
      { code: 'pending', name: 'Pending', color: '#FFA500' },
      { code: 'processing', name: 'Processing', color: '#3498DB' },
      { code: 'packed', name: 'Packed', color: '#9B59B6' },
      { code: 'shipped', name: 'Shipped', color: '#2ECC71' },
      { code: 'delivered', name: 'Delivered', color: '#27AE60' },
      { code: 'cancelled', name: 'Cancelled', color: '#E74C3C' },
      { code: 'refunded', name: 'Refunded', color: '#95A5A6' },
      { code: 'on_hold', name: 'On Hold', color: '#F1C40F' },
      { code: 'completed', name: 'Completed', color: '#2C3E50' }
    ];
    
    return res.json({
      success: true,
      data: statuses
    });
  } catch (error) {
    logger.error('Error fetching order statuses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order statuses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get orders by status
 */
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { statusCode } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    
    const where = { status: statusCode };
    
    // Add company filter (if applicable)
    if (req.companyId && !req.isSuperAdmin) {
      where.company_id = req.companyId;
    }
    
    const { count, rows } = await Order.findAndCountAll({
      where,
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
    logger.error('Error fetching orders by status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders by status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update order status
 */
exports.updateOrderStatus = async (req, res) => {
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
    const { status, notes } = req.body;
    
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
    
    // Record previous status for history
    const previousStatus = order.status;
    
    // Update order status
    await order.update({
      status,
      updated_by: req.user.id
    });
    
    // Create status history record (if we had a status history table)
    // await OrderStatusHistory.create({
    //   order_id: id,
    //   from_status: previousStatus,
    //   to_status: status,
    //   notes: notes,
    //   created_by: req.user.id
    // });
    
    return res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        id: order.id,
        status: order.status,
        previousStatus
      }
    });
  } catch (error) {
    logger.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get order status history
 */
exports.getOrderStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if order exists
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check permissions
    if (req.companyId && !req.isSuperAdmin && order.company_id !== req.companyId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this order'
      });
    }
    
    // Get status history
    // In a real implementation, we would fetch from OrderStatusHistory table
    // For now, return mock data
    const statusHistory = [
      {
        id: 1,
        order_id: id,
        from_status: 'pending',
        to_status: 'processing',
        notes: 'Order processing started',
        created_by: 1,
        created_at: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        id: 2,
        order_id: id,
        from_status: 'processing',
        to_status: 'shipped',
        notes: 'Order shipped via FedEx',
        created_by: 2,
        created_at: new Date(Date.now() - 43200000) // 12 hours ago
      }
    ];
    
    return res.json({
      success: true,
      data: statusHistory
    });
  } catch (error) {
    logger.error('Error fetching order status history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order status history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Batch update order statuses
 */
exports.batchUpdateOrderStatus = async (req, res) => {
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
    
    const { order_ids, status, notes } = req.body;
    
    if (!Array.isArray(order_ids) || order_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one order ID must be provided'
      });
    }
    
    // Find orders to update
    let where = { id: order_ids };
    
    // Add company filter (if applicable)
    if (req.companyId && !req.isSuperAdmin) {
      where.company_id = req.companyId;
    }
    
    const updatedOrders = await Order.update(
      { 
        status, 
        updated_by: req.user.id
      },
      { where }
    );
    
    return res.json({
      success: true,
      message: `Updated ${updatedOrders[0]} orders to status '${status}'`,
      data: {
        affectedRows: updatedOrders[0]
      }
    });
  } catch (error) {
    logger.error('Error batch updating order statuses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to batch update order statuses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
