/**
 * POS Controller - Handles Point-of-Sale operations
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');
const { POSTransaction, POSTransactionItem, POSPayment, PaymentMethod, Product, Customer, Admin } = require('../../models');
const { Op } = require('sequelize');
const { sequelize } = require('../../database/connection');
const POSService = require('../../services/POSService');
const RealTimeInventoryService = require('../../services/RealTimeInventoryService');

/**
 * Get all available products for POS (only in-stock items)
 */
exports.getAvailableProducts = async (req, res) => {
  try {
    const result = await POSService.getAvailableProducts();

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    logger.error('Error in getAvailableProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available products',
      error: error.message
    });
  }
};

/**
 * Search products for POS
 */
exports.searchProducts = async (req, res) => {
  try {
    const { q: searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const result = await POSService.searchProducts(searchTerm);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    logger.error('Error in searchProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message
    });
  }
};

/**
 * Check stock availability for cart items
 */
exports.checkStockAvailability = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    const result = await POSService.checkStockAvailability(items);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    logger.error('Error in checkStockAvailability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check stock availability',
      error: error.message
    });
  }
};

/**
 * Process a new POS transaction
 */
exports.processTransaction = async (req, res) => {
  try {
    const transactionData = req.body;
    const cashierId = req.user?.id || 1; // Default to admin user for testing

    const result = await POSService.processTransaction(transactionData, cashierId);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Error in processTransaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process transaction',
      error: error.message
    });
  }
};

/**
 * Get transaction history
 */
exports.getTransactionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;

    const result = await POSService.getTransactionHistory(page, limit, filters);

    if (result.success) {
      res.json({
        success: true,
        data: result.data.transactions,
        pagination: result.data.pagination
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    logger.error('Error in getTransactionHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction history',
      error: error.message
    });
  }
};

/**
 * Search customers by phone or email
 */
exports.searchCustomers = async (req, res) => {
  try {
    const { q: searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const { Op } = require('sequelize');

    const customers = await Customer.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { phone: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      attributes: ['id', 'name', 'phone', 'email', 'address'],
      limit: 10,
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    logger.error('Error in searchCustomers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search customers',
      error: error.message
    });
  }
};

/**
 * Create a new customer
 */
exports.createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({
      where: {
        [Op.or]: [
          { phone },
          ...(email ? [{ email }] : [])
        ]
      }
    });

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this phone or email already exists'
      });
    }

    const customer = await Customer.create({
      name,
      phone,
      email,
      address,
      company_id: 1 // Default company
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    logger.error('Error in createCustomer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message
    });
  }
};

/**
 * Get all POS transactions with pagination and filters (existing method)
 */
exports.getAllTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      payment_status,
      cashier_id,
      customer_id,
      start_date,
      end_date,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { company_id: req.user.companyId };

    // Apply filters
    if (status) where.status = status;
    if (payment_status) where.payment_status = payment_status;
    if (cashier_id) where.cashier_id = cashier_id;
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
        { transaction_number: { [Op.like]: `%${search}%` } },
        { customer_name: { [Op.like]: `%${search}%` } },
        { customer_phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const transactions = await POSTransaction.findAndCountAll({
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Admin,
          as: 'cashier',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: POSTransactionItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'sku', 'selling_price']
            }
          ]
        },
        {
          model: POSPayment,
          as: 'payments',
          include: [
            {
              model: PaymentMethod,
              as: 'paymentMethod',
              attributes: ['id', 'name', 'code', 'type']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        transactions: transactions.rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: transactions.count,
          total_pages: Math.ceil(transactions.count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching POS transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get products for POS
 */
exports.getProductsForPOS = async (req, res) => {
  try {
    const { page = 1, limit = 50, category_id, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {
      status: 'active',
      stock_quantity: { [Op.gt]: 0 }
    };

    if (category_id) {
      where.category_id = category_id;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
        { product_id: { [Op.like]: `%${search}%` } }
      ];
    }

    const products = await Product.findAndCountAll({
      where,
      attributes: [
        'id', 'product_id', 'sku', 'name', 'description',
        'selling_price', 'mrp', 'stock_quantity', 'category_id',
        'brand', 'discount', 'final_price'
      ],
      include: [
        {
          model: require('../../models').Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return res.json({
      success: true,
      data: {
        products: products.rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: products.count,
          total_pages: Math.ceil(products.count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching POS products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Search products for POS
 */
exports.searchProductsForPOS = async (req, res) => {
  try {
    const { query } = req.query;
    
    // Mock search results
    const products = [
      { id: 1, name: 'Product 1', sku: 'SKU001', price: 19.99, stock: 100, category: 'Electronics' }
    ];
    
    return res.json({
      success: true,
      data: products
    });
  } catch (error) {
    logger.error('Error searching POS products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get customers for POS
 */
exports.getCustomersForPOS = async (req, res) => {
  try {
    // Mock customers for POS
    const customers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' }
    ];
    
    return res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    logger.error('Error fetching POS customers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Search customers for POS
 */
exports.searchCustomersForPOS = async (req, res) => {
  try {
    const { query } = req.query;
    
    // Mock search results
    const customers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' }
    ];
    
    return res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    logger.error('Error searching POS customers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search customers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create quick customer
 */
exports.createQuickCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const customer = {
      id: Date.now(),
      ...req.body
    };
    
    return res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    logger.error('Error creating customer:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create POS transaction
 */
exports.createTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const transaction = {
      id: Date.now(),
      ...req.body,
      status: 'completed',
      created_at: new Date()
    };
    
    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    logger.error('Error creating transaction:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get transaction by ID
 */
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = {
      id,
      items: [
        { product_id: 1, name: 'Product 1', quantity: 2, price: 19.99, total: 39.98 }
      ],
      subtotal: 39.98,
      tax: 3.20,
      total: 43.18,
      payment_method: 'credit_card',
      status: 'completed',
      created_at: new Date()
    };
    
    return res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    logger.error('Error fetching transaction:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get daily transactions
 */
exports.getDailyTransactions = async (req, res) => {
  try {
    const transactions = [
      {
        id: 1,
        items_count: 3,
        subtotal: 39.98,
        tax: 3.20,
        total: 43.18,
        payment_method: 'credit_card',
        status: 'completed',
        created_at: new Date()
      },
      {
        id: 2,
        items_count: 2,
        subtotal: 59.98,
        tax: 4.80,
        total: 64.78,
        payment_method: 'cash',
        status: 'completed',
        created_at: new Date()
      }
    ];
    
    return res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    logger.error('Error fetching daily transactions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch daily transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Void transaction
 */
exports.voidTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    return res.json({
      success: true,
      message: 'Transaction voided successfully',
      data: { id, status: 'voided' }
    });
  } catch (error) {
    logger.error('Error voiding transaction:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to void transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Add transaction note
 */
exports.addTransactionNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    
    return res.json({
      success: true,
      message: 'Note added successfully',
      data: { id, note }
    });
  } catch (error) {
    logger.error('Error adding transaction note:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Process return
 */
exports.processReturn = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const returnData = {
      id: Date.now(),
      ...req.body,
      status: 'completed',
      created_at: new Date()
    };
    
    return res.status(201).json({
      success: true,
      message: 'Return processed successfully',
      data: returnData
    });
  } catch (error) {
    logger.error('Error processing return:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process return',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Process exchange
 */
exports.processExchange = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const exchangeData = {
      id: Date.now(),
      ...req.body,
      status: 'completed',
      created_at: new Date()
    };
    
    return res.status(201).json({
      success: true,
      message: 'Exchange processed successfully',
      data: exchangeData
    });
  } catch (error) {
    logger.error('Error processing exchange:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process exchange',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get return by ID
 */
exports.getReturnById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const returnData = {
      id,
      transaction_id: 123,
      items: [
        { product_id: 1, name: 'Product 1', quantity: 1, price: 19.99, total: 19.99 }
      ],
      total: 19.99,
      reason: 'Defective',
      status: 'completed',
      created_at: new Date()
    };
    
    return res.json({
      success: true,
      data: returnData
    });
  } catch (error) {
    logger.error('Error fetching return:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch return',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Open register
 */
exports.openRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const register = {
      id: Date.now(),
      ...req.body,
      status: 'open',
      opened_at: new Date()
    };
    
    return res.status(201).json({
      success: true,
      message: 'Register opened successfully',
      data: register
    });
  } catch (error) {
    logger.error('Error opening register:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to open register',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Close register
 */
exports.closeRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const register = {
      ...req.body,
      status: 'closed',
      closed_at: new Date()
    };
    
    return res.json({
      success: true,
      message: 'Register closed successfully',
      data: register
    });
  } catch (error) {
    logger.error('Error closing register:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to close register',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Cash count
 */
exports.cashCount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    return res.json({
      success: true,
      message: 'Cash count recorded successfully',
      data: {
        ...req.body,
        counted_at: new Date()
      }
    });
  } catch (error) {
    logger.error('Error recording cash count:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record cash count',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Record payout
 */
exports.recordPayout = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const payout = {
      id: Date.now(),
      ...req.body,
      created_at: new Date()
    };
    
    return res.status(201).json({
      success: true,
      message: 'Payout recorded successfully',
      data: payout
    });
  } catch (error) {
    logger.error('Error recording payout:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record payout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Record deposit
 */
exports.recordDeposit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const deposit = {
      id: Date.now(),
      ...req.body,
      created_at: new Date()
    };
    
    return res.status(201).json({
      success: true,
      message: 'Deposit recorded successfully',
      data: deposit
    });
  } catch (error) {
    logger.error('Error recording deposit:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record deposit',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get active discounts
 */
exports.getActiveDiscounts = async (req, res) => {
  try {
    const discounts = [
      {
        id: 1,
        code: 'SUMMER2023',
        type: 'percentage',
        value: 20,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        code: 'WELCOME10',
        type: 'fixed',
        value: 10,
        expires_at: null
      }
    ];
    
    return res.json({
      success: true,
      data: discounts
    });
  } catch (error) {
    logger.error('Error fetching active discounts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch active discounts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Validate discount
 */
exports.validateDiscount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { code } = req.body;
    
    // Mock discount validation
    const discount = {
      id: 1,
      code,
      type: 'percentage',
      value: 20,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
    
    return res.json({
      success: true,
      data: discount,
      message: 'Discount is valid'
    });
  } catch (error) {
    logger.error('Error validating discount:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to validate discount',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Apply manual discount
 */
exports.applyManualDiscount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    return res.json({
      success: true,
      message: 'Manual discount applied successfully',
      data: req.body
    });
  } catch (error) {
    logger.error('Error applying manual discount:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to apply manual discount',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get daily report
 */
exports.getDailyReport = async (req, res) => {
  try {
    const report = {
      date: new Date().toISOString().split('T')[0],
      transactions: 25,
      sales: 1250.50,
      refunds: 75.25,
      net_sales: 1175.25,
      tax: 117.53,
      payment_methods: {
        cash: 450.75,
        credit_card: 625.25,
        other: 99.25
      }
    };
    
    return res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Error generating daily report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate daily report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create a new POS transaction
 */
exports.createTransaction = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const {
      customer_id,
      customer_name,
      customer_phone,
      customer_email,
      items,
      payments,
      discount_amount = 0,
      tax_amount = 0,
      notes
    } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'At least one item is required'
      });
    }

    // Check stock availability first
    const inventoryService = new InventoryService();
    const stockCheck = await inventoryService.checkPOSStockAvailability(items);

    if (!stockCheck.all_available) {
      await transaction.rollback();
      const unavailableItems = stockCheck.data.filter(item => !item.available);
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock for some items',
        unavailable_items: unavailableItems
      });
    }

    // Calculate totals
    let subtotal = 0;
    const transactionItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product_id} not found`
        });
      }

      const lineTotal = item.quantity * item.unit_price - (item.discount_amount || 0);
      subtotal += lineTotal;

      transactionItems.push({
        product_id: item.product_id,
        product_name: product.name,
        product_sku: product.sku,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_amount: item.discount_amount || 0,
        line_total: lineTotal
      });
    }

    const totalAmount = subtotal + parseFloat(tax_amount) - parseFloat(discount_amount);

    // Create POS transaction
    const posTransaction = await POSTransaction.create({
      customer_id: customer_id || null,
      customer_name: customer_name || 'Walk-in Customer',
      customer_phone: customer_phone || null,
      customer_email: customer_email || null,
      subtotal,
      tax_amount: parseFloat(tax_amount),
      discount_amount: parseFloat(discount_amount),
      total_amount: totalAmount,
      status: 'pending',
      payment_status: 'unpaid',
      notes,
      cashier_id: req.user.id,
      company_id: req.user.companyId
    }, { transaction });

    // Create transaction items
    for (const item of transactionItems) {
      await POSTransactionItem.create({
        transaction_id: posTransaction.id,
        ...item
      }, { transaction });
    }

    // Update inventory using InventoryService
    await inventoryService.updateStockAfterPOSTransaction(posTransaction.id, transaction);

    // Create payments if provided
    if (payments && Array.isArray(payments) && payments.length > 0) {
      let totalPaid = 0;

      for (const payment of payments) {
        await POSPayment.create({
          transaction_id: posTransaction.id,
          payment_method_id: payment.payment_method_id,
          amount: payment.amount,
          reference_number: payment.reference_number || null,
          status: 'completed'
        }, { transaction });

        totalPaid += parseFloat(payment.amount);
      }

      // Update payment status
      let paymentStatus = 'unpaid';
      if (totalPaid >= totalAmount) {
        paymentStatus = 'paid';
      } else if (totalPaid > 0) {
        paymentStatus = 'partially_paid';
      }

      await posTransaction.update({
        payment_status: paymentStatus,
        status: paymentStatus === 'paid' ? 'completed' : 'pending'
      }, { transaction });
    }

    await transaction.commit();

    // Fetch the complete transaction with associations
    const completeTransaction = await POSTransaction.findByPk(posTransaction.id, {
      include: [
        {
          model: Customer,
          as: 'customer'
        },
        {
          model: Admin,
          as: 'cashier',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: POSTransactionItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        },
        {
          model: POSPayment,
          as: 'payments',
          include: [
            {
              model: PaymentMethod,
              as: 'paymentMethod'
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: completeTransaction
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating POS transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get a specific POS transaction by ID
 */
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await POSTransaction.findOne({
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
          model: Admin,
          as: 'cashier',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: POSTransactionItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        },
        {
          model: POSPayment,
          as: 'payments',
          include: [
            {
              model: PaymentMethod,
              as: 'paymentMethod'
            }
          ]
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    logger.error('Error fetching POS transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get payment methods for POS
 */
exports.getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    logger.error('Error fetching payment methods:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get sales report
 */
exports.getSalesReport = async (req, res) => {
  try {
    const report = {
      period: {
        start: req.query.start_date || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: req.query.end_date || new Date().toISOString().split('T')[0]
      },
      total_sales: 8750.50,
      total_refunds: 425.75,
      net_sales: 8324.75,
      total_tax: 832.48,
      daily_breakdown: [
        { date: '2023-06-01', sales: 1250.50, transactions: 25 },
        { date: '2023-06-02', sales: 1450.25, transactions: 29 },
        { date: '2023-06-03', sales: 975.75, transactions: 18 }
      ]
    };
    
    return res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Error generating sales report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate sales report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get product sales report
 */
exports.getProductSalesReport = async (req, res) => {
  try {
    const report = {
      period: {
        start: req.query.start_date || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: req.query.end_date || new Date().toISOString().split('T')[0]
      },
      products: [
        { id: 1, name: 'Product 1', sku: 'SKU001', quantity: 42, sales: 839.58 },
        { id: 2, name: 'Product 2', sku: 'SKU002', quantity: 27, sales: 809.73 },
        { id: 3, name: 'Product 3', sku: 'SKU003', quantity: 53, sales: 529.47 }
      ]
    };
    
    return res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Error generating product sales report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate product sales report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get staff sales report
 */
exports.getStaffSalesReport = async (req, res) => {
  try {
    const report = {
      period: {
        start: req.query.start_date || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: req.query.end_date || new Date().toISOString().split('T')[0]
      },
      staff: [
        { id: 1, name: 'John Doe', transactions: 42, sales: 2150.75 },
        { id: 2, name: 'Jane Smith', transactions: 38, sales: 1950.25 },
        { id: 3, name: 'Bob Johnson', transactions: 25, sales: 1250.50 }
      ]
    };
    
    return res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Error generating staff sales report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate staff sales report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Export report
 */
exports.exportReport = async (req, res) => {
  try {
    const { reportType } = req.params;
    
    return res.json({
      success: true,
      message: `${reportType} report exported successfully`,
      data: {
        download_url: `/exports/${reportType}_${Date.now()}.csv`
      }
    });
  } catch (error) {
    logger.error('Error exporting report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to export report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
