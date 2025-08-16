const InvoiceService = require('../services/InvoiceService');
const logger = require('../utils/logger');

/**
 * Create invoice from POS transaction
 */
exports.createFromTransaction = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const additionalData = req.body;

    const invoice = await InvoiceService.createFromPOSTransaction(
      parseInt(transaction_id),
      additionalData
    );

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully from transaction',
      data: invoice
    });
  } catch (error) {
    logger.error('Error creating invoice from transaction:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create invoice from transaction',
      error: error.message
    });
  }
};

/**
 * Create standalone invoice
 */
exports.createInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;
    
    // Add created_by from authenticated user
    invoiceData.created_by = req.user?.id || 16; // Default to admin ID 16
    invoiceData.company_id = req.user?.company_id || 1; // Default to company ID 1

    const invoice = await InvoiceService.createInvoice(invoiceData);

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice
    });
  } catch (error) {
    logger.error('Error creating invoice:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message
    });
  }
};

/**
 * Get invoice by ID
 */
exports.getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await InvoiceService.getInvoiceById(parseInt(id));

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    logger.error('Error getting invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get invoice',
      error: error.message
    });
  }
};

/**
 * Get all invoices with pagination and filters
 */
exports.getInvoices = async (req, res) => {
  try {
    const options = {
      page: req.query.page,
      limit: req.query.limit,
      status: req.query.status,
      customer_name: req.query.customer_name,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      company_id: req.user?.company_id // Filter by user's company
    };

    const result = await InvoiceService.getInvoices(options);

    res.json({
      success: true,
      data: result.invoices,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error('Error getting invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get invoices',
      error: error.message
    });
  }
};

/**
 * Update invoice status
 */
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const invoice = await InvoiceService.updateInvoiceStatus(
      parseInt(id),
      status,
      { notes }
    );

    res.json({
      success: true,
      message: 'Invoice status updated successfully',
      data: invoice
    });
  } catch (error) {
    logger.error('Error updating invoice status:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update invoice status',
      error: error.message
    });
  }
};

/**
 * Delete invoice
 */
exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    await InvoiceService.deleteInvoice(parseInt(id));

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting invoice:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to delete invoice',
      error: error.message
    });
  }
};

/**
 * Get invoice statistics
 */
exports.getInvoiceStats = async (req, res) => {
  try {
    const { sequelize } = require('../database/connection');
    const Invoice = require('../models/Invoice');

    const companyId = req.user?.company_id || 1;

    // Get various statistics
    const stats = await Promise.all([
      // Total invoices
      Invoice.count({ where: { company_id: companyId } }),
      
      // Paid invoices
      Invoice.count({ where: { company_id: companyId, status: 'paid' } }),
      
      // Pending invoices
      Invoice.count({ where: { company_id: companyId, status: { [sequelize.Sequelize.Op.in]: ['draft', 'sent'] } } }),
      
      // Overdue invoices
      Invoice.count({ where: { company_id: companyId, status: 'overdue' } }),
      
      // Total revenue (paid invoices)
      Invoice.sum('total_amount', { where: { company_id: companyId, status: 'paid' } }),
      
      // Pending amount
      Invoice.sum('total_amount', { where: { company_id: companyId, status: { [sequelize.Sequelize.Op.in]: ['draft', 'sent'] } } })
    ]);

    res.json({
      success: true,
      data: {
        total_invoices: stats[0] || 0,
        paid_invoices: stats[1] || 0,
        pending_invoices: stats[2] || 0,
        overdue_invoices: stats[3] || 0,
        total_revenue: parseFloat(stats[4]) || 0,
        pending_amount: parseFloat(stats[5]) || 0
      }
    });
  } catch (error) {
    logger.error('Error getting invoice statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get invoice statistics',
      error: error.message
    });
  }
};
