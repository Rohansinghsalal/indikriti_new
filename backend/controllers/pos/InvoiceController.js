/**
 * Invoice Controller
 * Handles invoice generation, management, and PDF export
 */
const { Invoice, POSTransaction, Order, Customer, Company, Admin, POSTransactionItem, OrderItem, Product } = require('../../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../../utils/logger');

/**
 * Get all invoices with pagination and filters
 */
exports.getAllInvoices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      customer_id,
      start_date,
      end_date,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { company_id: req.user.companyId };

    // Apply filters
    if (status) where.status = status;
    if (customer_id) where.customer_id = customer_id;

    // Date range filter
    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) where.created_at[Op.gte] = new Date(start_date);
      if (end_date) where.created_at[Op.lte] = new Date(end_date);
    }

    // Search filter
    if (search) {
      where[Op.or] = [
        { invoice_number: { [Op.like]: `%${search}%` } },
        { customer_name: { [Op.like]: `%${search}%` } },
        { customer_email: { [Op.like]: `%${search}%` } }
      ];
    }

    const invoices = await Invoice.findAndCountAll({
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: POSTransaction,
          as: 'transaction',
          attributes: ['id', 'transaction_number', 'total_amount']
        },
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'order_number', 'total_amount']
        },
        {
          model: Admin,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        invoices: invoices.rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: invoices.count,
          total_pages: Math.ceil(invoices.count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get invoice by ID
 */
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findOne({
      where: {
        id,
        company_id: req.user.companyId
      },
      include: [
        {
          model: Customer,
          as: 'customer'
        },
        {
          model: POSTransaction,
          as: 'transaction',
          include: [
            {
              model: POSTransactionItem,
              as: 'items',
              include: [
                {
                  model: Product,
                  as: 'product'
                }
              ]
            }
          ]
        },
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: OrderItem,
              as: 'items',
              include: [
                {
                  model: Product,
                  as: 'product'
                }
              ]
            }
          ]
        },
        {
          model: Company,
          as: 'company'
        },
        {
          model: Admin,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

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
    logger.error('Error fetching invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create invoice from POS transaction
 */
exports.createInvoiceFromTransaction = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const { due_date, notes, terms } = req.body;

    // Find the transaction
    const transaction = await POSTransaction.findOne({
      where: {
        id: transaction_id,
        company_id: req.user.companyId
      },
      include: [
        {
          model: Customer,
          as: 'customer'
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if invoice already exists
    const existingInvoice = await Invoice.findOne({
      where: { transaction_id }
    });

    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: 'Invoice already exists for this transaction'
      });
    }

    // Create invoice
    const invoice = await Invoice.create({
      transaction_id,
      customer_id: transaction.customer_id,
      customer_name: transaction.customer_name,
      customer_email: transaction.customer_email,
      customer_phone: transaction.customer_phone,
      subtotal: transaction.subtotal,
      tax_amount: transaction.tax_amount,
      discount_amount: transaction.discount_amount,
      total_amount: transaction.total_amount,
      status: transaction.payment_status === 'paid' ? 'paid' : 'sent',
      due_date: due_date ? new Date(due_date) : null,
      paid_date: transaction.payment_status === 'paid' ? new Date() : null,
      notes,
      terms,
      company_id: req.user.companyId,
      created_by: req.user.id
    });

    // Fetch complete invoice with associations
    const completeInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        {
          model: Customer,
          as: 'customer'
        },
        {
          model: POSTransaction,
          as: 'transaction',
          include: [
            {
              model: POSTransactionItem,
              as: 'items',
              include: [
                {
                  model: Product,
                  as: 'product'
                }
              ]
            }
          ]
        },
        {
          model: Company,
          as: 'company'
        },
        {
          model: Admin,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: completeInvoice
    });
  } catch (error) {
    logger.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create invoice from order
 */
exports.createInvoiceFromOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { due_date, notes, terms } = req.body;

    // Find the order
    const order = await Order.findOne({
      where: {
        id: order_id,
        company_id: req.user.companyId
      },
      include: [
        {
          model: Customer,
          as: 'customer'
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if invoice already exists
    const existingInvoice = await Invoice.findOne({
      where: { order_id }
    });

    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: 'Invoice already exists for this order'
      });
    }

    // Create invoice
    const invoice = await Invoice.create({
      order_id,
      customer_id: order.customer_id,
      customer_name: order.customer?.name || 'Guest Customer',
      customer_email: order.customer?.email || null,
      customer_phone: order.customer?.phone || null,
      billing_address: order.billing_address,
      subtotal: order.total_amount, // Assuming order has calculated totals
      tax_amount: 0, // Calculate based on order items if needed
      discount_amount: 0, // Calculate based on order if needed
      total_amount: order.total_amount,
      status: order.payment_status === 'paid' ? 'paid' : 'sent',
      due_date: due_date ? new Date(due_date) : null,
      paid_date: order.payment_status === 'paid' ? new Date() : null,
      notes,
      terms,
      company_id: req.user.companyId,
      created_by: req.user.id
    });

    // Fetch complete invoice with associations
    const completeInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        {
          model: Customer,
          as: 'customer'
        },
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: OrderItem,
              as: 'items',
              include: [
                {
                  model: Product,
                  as: 'product'
                }
              ]
            }
          ]
        },
        {
          model: Company,
          as: 'company'
        },
        {
          model: Admin,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: completeInvoice
    });
  } catch (error) {
    logger.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Generate PDF invoice
 */
exports.generateInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch invoice with all related data
    const invoice = await Invoice.findOne({
      where: {
        id,
        company_id: req.user.companyId
      },
      include: [
        {
          model: Customer,
          as: 'customer'
        },
        {
          model: POSTransaction,
          as: 'transaction',
          include: [
            {
              model: POSTransactionItem,
              as: 'items',
              include: [
                {
                  model: Product,
                  as: 'product'
                }
              ]
            }
          ]
        },
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: OrderItem,
              as: 'items',
              include: [
                {
                  model: Product,
                  as: 'product'
                }
              ]
            }
          ]
        },
        {
          model: Company,
          as: 'company'
        },
        {
          model: Admin,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoice_number}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add company header
    doc.fontSize(20).text('INVOICE', 50, 50);
    doc.fontSize(12).text(`Invoice #: ${invoice.invoice_number}`, 50, 80);
    doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 50, 95);

    if (invoice.due_date) {
      doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 50, 110);
    }

    // Company information
    if (invoice.company) {
      doc.fontSize(14).text('From:', 50, 140);
      doc.fontSize(12).text(invoice.company.name || 'Indikriti', 50, 160);
    }

    // Customer information
    doc.fontSize(14).text('Bill To:', 300, 140);
    doc.fontSize(12).text(invoice.customer_name, 300, 160);
    if (invoice.customer_email) {
      doc.text(invoice.customer_email, 300, 175);
    }
    if (invoice.customer_phone) {
      doc.text(invoice.customer_phone, 300, 190);
    }

    // Items table header
    const tableTop = 250;
    doc.fontSize(12);
    doc.text('Item', 50, tableTop);
    doc.text('Qty', 250, tableTop);
    doc.text('Price', 300, tableTop);
    doc.text('Total', 400, tableTop);

    // Draw line under header
    doc.moveTo(50, tableTop + 15).lineTo(500, tableTop + 15).stroke();

    // Add items
    let currentY = tableTop + 30;
    const items = invoice.transaction?.items || invoice.order?.items || [];

    items.forEach((item) => {
      const itemName = item.product_name || item.product?.name || 'Unknown Item';
      const quantity = item.quantity;
      const price = parseFloat(item.unit_price || item.price || 0);
      const total = parseFloat(item.line_total || (quantity * price));

      doc.text(itemName, 50, currentY);
      doc.text(quantity.toString(), 250, currentY);
      doc.text(`₹${price.toFixed(2)}`, 300, currentY);
      doc.text(`₹${total.toFixed(2)}`, 400, currentY);

      currentY += 20;
    });

    // Totals section
    currentY += 20;
    doc.moveTo(300, currentY).lineTo(500, currentY).stroke();
    currentY += 10;

    doc.text('Subtotal:', 350, currentY);
    doc.text(`₹${parseFloat(invoice.subtotal).toFixed(2)}`, 450, currentY);
    currentY += 15;

    if (invoice.discount_amount > 0) {
      doc.text('Discount:', 350, currentY);
      doc.text(`-₹${parseFloat(invoice.discount_amount).toFixed(2)}`, 450, currentY);
      currentY += 15;
    }

    if (invoice.tax_amount > 0) {
      doc.text('Tax:', 350, currentY);
      doc.text(`₹${parseFloat(invoice.tax_amount).toFixed(2)}`, 450, currentY);
      currentY += 15;
    }

    doc.fontSize(14).text('Total:', 350, currentY);
    doc.text(`₹${parseFloat(invoice.total_amount).toFixed(2)}`, 450, currentY);

    // Add notes if present
    if (invoice.notes) {
      currentY += 40;
      doc.fontSize(12).text('Notes:', 50, currentY);
      doc.text(invoice.notes, 50, currentY + 15);
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    logger.error('Error generating invoice PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate invoice PDF',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update invoice status
 */
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const invoice = await Invoice.findOne({
      where: {
        id,
        company_id: req.user.companyId
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    await invoice.update({ status });

    res.json({
      success: true,
      message: 'Invoice status updated successfully',
      data: invoice
    });
  } catch (error) {
    logger.error('Error updating invoice status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Mark invoice as paid
 */
exports.markInvoiceAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { paid_date } = req.body;

    const invoice = await Invoice.findOne({
      where: {
        id,
        company_id: req.user.companyId
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    await invoice.update({
      status: 'paid',
      paid_date: paid_date ? new Date(paid_date) : new Date()
    });

    res.json({
      success: true,
      message: 'Invoice marked as paid successfully',
      data: invoice
    });
  } catch (error) {
    logger.error('Error marking invoice as paid:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark invoice as paid',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
