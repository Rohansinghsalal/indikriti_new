const { sequelize } = require('../database/connection');
const Invoice = require('../models/Invoice');
const InvoiceItem = require('../models/InvoiceItem');
const POSTransaction = require('../models/POSTransaction');
const POSTransactionItem = require('../models/POSTransactionItem');
const Product = require('../models/Product');
const Admin = require('../models/Admin');
const logger = require('../utils/logger');

class InvoiceService {
  /**
   * Create invoice from POS transaction
   */
  static async createFromPOSTransaction(transactionId, additionalData = {}) {
    const transaction = await sequelize.transaction();
    
    try {
      // Get the POS transaction with items
      const posTransaction = await POSTransaction.findByPk(transactionId, {
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
        ],
        transaction
      });

      if (!posTransaction) {
        throw new Error('POS transaction not found');
      }

      // Generate invoice number
      const timestamp = Date.now();
      const year = new Date().getFullYear();
      const invoiceNumber = `INV-${year}-${timestamp}`;

      // Create invoice
      const invoice = await Invoice.create({
        invoice_number: invoiceNumber,
        transaction_id: transactionId,
        customer_name: posTransaction.customer_name || 'Walk-in Customer',
        customer_email: posTransaction.customer_email,
        customer_phone: posTransaction.customer_phone,
        billing_address: additionalData.billing_address,
        subtotal: posTransaction.subtotal,
        tax_amount: posTransaction.tax_amount,
        discount_amount: posTransaction.discount_amount,
        total_amount: posTransaction.total_amount,
        status: 'paid', // POS transactions are immediately paid
        paid_date: new Date(),
        notes: posTransaction.notes,
        terms: additionalData.terms || 'Payment received at point of sale',
        company_id: posTransaction.company_id,
        created_by: posTransaction.cashier_id
      }, { transaction });

      // Create invoice items
      const invoiceItems = [];
      for (const item of posTransaction.items) {
        const invoiceItem = await InvoiceItem.create({
          invoice_id: invoice.id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_sku: item.product_sku,
          description: item.product?.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_amount: item.discount_amount,
          tax_amount: 0, // Tax is calculated at transaction level
          line_total: item.line_total
        }, { transaction });
        
        invoiceItems.push(invoiceItem);
      }

      await transaction.commit();

      // Return invoice with items
      return await this.getInvoiceById(invoice.id);
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating invoice from POS transaction:', error);
      throw error;
    }
  }

  /**
   * Create standalone invoice
   */
  static async createInvoice(invoiceData) {
    const transaction = await sequelize.transaction();
    
    try {
      const { items, ...invoiceFields } = invoiceData;

      // Calculate totals
      let subtotal = 0;
      let totalTax = 0;
      let totalDiscount = 0;

      for (const item of items) {
        const lineSubtotal = parseFloat(item.unit_price) * item.quantity;
        const lineDiscount = parseFloat(item.discount_amount) || 0;
        const lineTax = parseFloat(item.tax_amount) || 0;
        
        subtotal += lineSubtotal;
        totalDiscount += lineDiscount;
        totalTax += lineTax;
      }

      const totalAmount = subtotal - totalDiscount + totalTax;

      // Create invoice
      const invoice = await Invoice.create({
        ...invoiceFields,
        subtotal,
        tax_amount: totalTax,
        discount_amount: totalDiscount,
        total_amount: totalAmount,
        status: invoiceFields.status || 'draft'
      }, { transaction });

      // Create invoice items
      const invoiceItems = [];
      for (const itemData of items) {
        const invoiceItem = await InvoiceItem.create({
          invoice_id: invoice.id,
          ...itemData
        }, { transaction });
        
        invoiceItems.push(invoiceItem);
      }

      await transaction.commit();

      // Return invoice with items
      return await this.getInvoiceById(invoice.id);
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating invoice:', error);
      throw error;
    }
  }

  /**
   * Get invoice by ID with all related data
   */
  static async getInvoiceById(invoiceId) {
    try {
      const invoice = await Invoice.findByPk(invoiceId, {
        include: [
          {
            model: InvoiceItem,
            as: 'items'
          },
          {
            model: POSTransaction,
            as: 'transaction'
          },
          {
            model: Admin,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ]
      });

      return invoice;
    } catch (error) {
      logger.error('Error getting invoice:', error);
      throw error;
    }
  }

  /**
   * Get all invoices with pagination and filters
   */
  static async getInvoices(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        customer_name,
        date_from,
        date_to,
        company_id
      } = options;

      const offset = (page - 1) * limit;
      const where = {};

      if (status) where.status = status;
      if (customer_name) {
        where.customer_name = {
          [sequelize.Sequelize.Op.like]: `%${customer_name}%`
        };
      }
      if (company_id) where.company_id = company_id;
      if (date_from || date_to) {
        where.created_at = {};
        if (date_from) where.created_at[sequelize.Sequelize.Op.gte] = new Date(date_from);
        if (date_to) where.created_at[sequelize.Sequelize.Op.lte] = new Date(date_to);
      }

      const { count, rows } = await Invoice.findAndCountAll({
        where,
        include: [
          {
            model: Admin,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name']
          }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        invoices: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting invoices:', error);
      throw error;
    }
  }

  /**
   * Update invoice status
   */
  static async updateInvoiceStatus(invoiceId, status, additionalData = {}) {
    try {
      const invoice = await Invoice.findByPk(invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      const updateData = { status };
      
      if (status === 'paid' && !invoice.paid_date) {
        updateData.paid_date = new Date();
      }

      if (additionalData.notes) {
        updateData.notes = additionalData.notes;
      }

      await invoice.update(updateData);
      
      return await this.getInvoiceById(invoiceId);
    } catch (error) {
      logger.error('Error updating invoice status:', error);
      throw error;
    }
  }

  /**
   * Delete invoice
   */
  static async deleteInvoice(invoiceId) {
    const transaction = await sequelize.transaction();
    
    try {
      const invoice = await Invoice.findByPk(invoiceId, { transaction });
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Delete invoice items first
      await InvoiceItem.destroy({
        where: { invoice_id: invoiceId },
        transaction
      });

      // Delete invoice
      await invoice.destroy({ transaction });

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error deleting invoice:', error);
      throw error;
    }
  }
}

module.exports = InvoiceService;
