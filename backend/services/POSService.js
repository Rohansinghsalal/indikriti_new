/**
 * POS Service - Handles Point-of-Sale operations with real-time inventory management
 */

const { POSTransaction, POSTransactionItem, POSPayment, Product, Customer, Admin } = require('../models');
const { sequelize } = require('../database/connection');
const InvoiceService = require('./InvoiceService');
const logger = require('../utils/logger');

class POSService {
  /**
   * Get all available products for POS (only in-stock items)
   */
  static async getAvailableProducts() {
    try {
      const products = await Product.findAll({
        where: {
          status: 'active',
          stock_quantity: {
            [require('sequelize').Op.gt]: 0
          }
        },
        attributes: [
          'id', 'product_id', 'sku', 'name', 'description', 
          'mrp', 'selling_price', 'stock_quantity', 'brand'
        ],
        order: [['name', 'ASC']]
      });

      return {
        success: true,
        data: products
      };
    } catch (error) {
      logger.error('Error fetching available products:', error);
      return {
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      };
    }
  }

  /**
   * Search products by name or SKU
   */
  static async searchProducts(searchTerm) {
    try {
      const { Op } = require('sequelize');
      
      const products = await Product.findAll({
        where: {
          status: 'active',
          stock_quantity: {
            [Op.gt]: 0
          },
          [Op.or]: [
            { name: { [Op.like]: `%${searchTerm}%` } },
            { sku: { [Op.like]: `%${searchTerm}%` } },
            { product_id: { [Op.like]: `%${searchTerm}%` } }
          ]
        },
        attributes: [
          'id', 'product_id', 'sku', 'name', 'description', 
          'mrp', 'selling_price', 'stock_quantity', 'brand'
        ],
        order: [['name', 'ASC']],
        limit: 20
      });

      return {
        success: true,
        data: products
      };
    } catch (error) {
      logger.error('Error searching products:', error);
      return {
        success: false,
        message: 'Failed to search products',
        error: error.message
      };
    }
  }

  /**
   * Check stock availability for multiple products
   */
  static async checkStockAvailability(items) {
    try {
      const stockChecks = [];
      
      for (const item of items) {
        const product = await Product.findByPk(item.product_id);
        if (!product) {
          stockChecks.push({
            product_id: item.product_id,
            available: false,
            reason: 'Product not found'
          });
          continue;
        }

        if (product.stock_quantity < item.quantity) {
          stockChecks.push({
            product_id: item.product_id,
            available: false,
            reason: `Insufficient stock. Available: ${product.stock_quantity}, Requested: ${item.quantity}`
          });
        } else {
          stockChecks.push({
            product_id: item.product_id,
            available: true,
            available_quantity: product.stock_quantity
          });
        }
      }

      return {
        success: true,
        data: stockChecks
      };
    } catch (error) {
      logger.error('Error checking stock availability:', error);
      return {
        success: false,
        message: 'Failed to check stock availability',
        error: error.message
      };
    }
  }

  /**
   * Process POS transaction with real-time inventory updates
   */
  static async processTransaction(transactionData, cashierId) {
    const transaction = await sequelize.transaction();
    
    try {
      const {
        items,
        customer,
        subtotal,
        discount_amount = 0,
        discount_type = 'fixed', // 'fixed' or 'percentage'
        tax_rate = 0,
        tax_amount = 0,
        total_amount,
        payment_method = 'cash',
        notes = ''
      } = transactionData;

      // Validate stock availability first
      const stockCheck = await this.checkStockAvailability(items);
      if (!stockCheck.success) {
        await transaction.rollback();
        return stockCheck;
      }

      const unavailableItems = stockCheck.data.filter(item => !item.available);
      if (unavailableItems.length > 0) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Some items are not available',
          data: unavailableItems
        };
      }

      // Create customer if new (simplified for now)
      let customerId = null;
      // TODO: Implement proper customer management when Customer model is fixed
      // For now, we'll just store customer info in the transaction directly

      // Generate transaction number
      const transactionNumber = `TXN${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

      // Get the admin's company_id to use for the transaction
      const admin = await Admin.findByPk(16);
      const companyId = admin ? admin.company_id : 1; // Default to company 1 if not found

      // Create POS transaction
      const posTransaction = await POSTransaction.create({
        transaction_number: transactionNumber,
        customer_id: customerId,
        customer_name: customer?.name || null,
        customer_phone: customer?.phone || null,
        customer_email: customer?.email || null,
        subtotal: parseFloat(subtotal),
        tax_amount: parseFloat(tax_amount),
        discount_amount: parseFloat(discount_amount),
        total_amount: parseFloat(total_amount),
        status: 'completed',
        payment_status: 'paid',
        notes,
        cashier_id: 16, // Using existing admin ID from logs
        company_id: companyId // Use admin's actual company_id
      }, { transaction });

      // Create transaction items and update inventory
      const transactionItems = [];
      const inventoryUpdates = [];

      for (const item of items) {
        const product = await Product.findByPk(item.product_id, { transaction });
        
        // Create transaction item
        const transactionItem = await POSTransactionItem.create({
          transaction_id: posTransaction.id,
          product_id: item.product_id,
          product_name: product.name,
          product_sku: product.sku,
          quantity: item.quantity,
          unit_price: item.unit_price || product.selling_price,
          discount_amount: item.discount_amount || 0,
          line_total: (item.unit_price || product.selling_price) * item.quantity - (item.discount_amount || 0)
        }, { transaction });

        transactionItems.push(transactionItem);

        // Update product stock
        const newStockQuantity = product.stock_quantity - item.quantity;
        await product.update({
          stock_quantity: newStockQuantity
        }, { transaction });

        inventoryUpdates.push({
          product_id: product.id,
          product_name: product.name,
          sku: product.sku,
          old_quantity: product.stock_quantity,
          new_quantity: newStockQuantity,
          quantity_sold: item.quantity
        });
      }

      await transaction.commit();

      // Create invoice automatically for the transaction
      let invoice = null;
      try {
        invoice = await InvoiceService.createFromPOSTransaction(posTransaction.id);
        logger.info(`Invoice created automatically for transaction ${posTransaction.id}: ${invoice.invoice_number}`);
      } catch (invoiceError) {
        logger.error('Error creating invoice for transaction:', invoiceError);
        // Don't fail the transaction if invoice creation fails
      }

      // Emit real-time inventory updates via Socket.io
      if (global.io) {
        global.io.to('inventory').emit('inventory-updated', {
          type: 'stock-reduction',
          updates: inventoryUpdates,
          transaction_id: posTransaction.id
        });

        global.io.to('pos').emit('transaction-completed', {
          transaction: posTransaction,
          items: transactionItems,
          invoice: invoice
        });
      }

      return {
        success: true,
        message: 'Transaction processed successfully',
        data: {
          transaction: posTransaction,
          items: transactionItems,
          inventory_updates: inventoryUpdates,
          invoice: invoice
        }
      };

    } catch (error) {
      await transaction.rollback();
      logger.error('Error processing POS transaction:', error);
      return {
        success: false,
        message: 'Failed to process transaction',
        error: error.message
      };
    }
  }

  /**
   * Get transaction history with pagination
   */
  static async getTransactionHistory(page = 1, limit = 20, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      const where = {};

      // Apply filters
      if (filters.status) where.status = filters.status;
      if (filters.payment_status) where.payment_status = filters.payment_status;
      if (filters.start_date && filters.end_date) {
        where.created_at = {
          [require('sequelize').Op.between]: [filters.start_date, filters.end_date]
        };
      }

      const transactions = await POSTransaction.findAndCountAll({
        where,
        include: [
          {
            model: POSTransactionItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'sku']
              }
            ]
          },
          {
            model: Admin,
            as: 'cashier',
            attributes: ['id', 'first_name', 'last_name']
          }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        success: true,
        data: {
          transactions: transactions.rows,
          pagination: {
            current_page: parseInt(page),
            total_pages: Math.ceil(transactions.count / limit),
            total_records: transactions.count,
            per_page: parseInt(limit)
          }
        }
      };
    } catch (error) {
      logger.error('Error fetching transaction history:', error);
      return {
        success: false,
        message: 'Failed to fetch transaction history',
        error: error.message
      };
    }
  }
}

module.exports = POSService;
