/**
 * Payment Controller - Handles payment processing
 */

const { Payment, Order, User, Company } = require('../../models');
const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');
const { Op } = require('sequelize');

// Define a simple payment config directly instead of importing
const paymentConfig = {
  // Default payment gateway
  defaultGateway: "stripe",

  // Stripe configuration
  stripe: {
    secretKey: "your_stripe_secret_key",
    publishableKey: "your_stripe_publishable_key",
    webhookSecret: "your_stripe_webhook_secret",
    enabled: true
  },
  
  // PayPal configuration
  paypal: {
    clientId: "your_paypal_client_id",
    clientSecret: "your_paypal_client_secret", 
    environment: "sandbox",
    enabled: false
  },
  
  // Settings
  settings: {
    currency: "USD",
    autoCapture: true,
    savePaymentMethods: true
  }
};

/**
 * Get all payments with pagination and filtering
 */
exports.getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    
    // Build filters
    const where = {};
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (req.query.order_id) {
      where.order_id = req.query.order_id;
    }
    if (req.query.payment_method) {
      where.payment_method = req.query.payment_method;
    }
    
    // Filter by date range
    if (req.query.from_date && req.query.to_date) {
      where.payment_date = {
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
    
    // Mock response for demo
    const payments = [
      {
        id: 1,
        order_id: 1,
        amount: 99.99,
        payment_method: "credit_card",
        status: "completed",
        transaction_id: "txn_12345",
        payment_date: new Date(),
        customer: {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com"
        }
      },
      {
        id: 2,
        order_id: 2,
        amount: 149.99,
        payment_method: "paypal",
        status: "completed",
        transaction_id: "txn_67890",
        payment_date: new Date(),
        customer: {
          id: 2,
          first_name: "Jane",
          last_name: "Smith",
          email: "jane@example.com"
        }
      }
    ];
    
    return res.json({
      success: true,
      data: payments,
      meta: {
        total: payments.length,
        page,
        limit,
        pages: Math.ceil(payments.length / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching payments:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get payment by ID
 */
exports.getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.id;
    
    // Mock payment data for demo
    const payment = {
      id: paymentId,
      order_id: 1,
      amount: 99.99,
      payment_method: "credit_card",
      status: "completed",
      transaction_id: "txn_12345",
      payment_date: new Date(),
      customer: {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com"
      }
    };
    
    return res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    logger.error('Error fetching payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new payment
 */
exports.createPayment = async (req, res) => {
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
    
    // Mock response
    const payment = {
      id: Date.now(),
      ...req.body,
      status: "completed",
      transaction_id: `txn_${Date.now()}`,
      payment_date: new Date()
    };
    
    return res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      data: payment
    });
  } catch (error) {
    logger.error('Error processing payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update payment
 */
exports.updatePayment = async (req, res) => {
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
    
    const paymentId = req.params.id;
    
    // Mock updated payment
    const payment = {
      id: paymentId,
      ...req.body,
      updated_at: new Date()
    };
    
    return res.json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    });
  } catch (error) {
    logger.error('Error updating payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get payments by order ID
 */
exports.getPaymentsByOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    
    // Mock payments for the order
    const payments = [
      {
        id: 1,
        order_id: orderId,
        amount: 99.99,
        payment_method: "credit_card",
        status: "completed",
        transaction_id: "txn_12345",
        payment_date: new Date()
      }
    ];
    
    return res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    logger.error('Error fetching order payments:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order payments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get payment methods
 */
exports.getPaymentMethods = async (req, res) => {
  try {
    // For demo, return static payment methods
    const paymentMethods = [
      {
        id: 1,
        name: 'Credit Card',
        code: 'credit_card',
        description: 'Pay with credit card',
        enabled: true
      },
      {
        id: 2,
        name: 'PayPal',
        code: 'paypal',
        description: 'Pay with PayPal',
        enabled: true
      },
      {
        id: 3,
        name: 'Bank Transfer',
        code: 'bank_transfer',
        description: 'Pay with bank transfer',
        enabled: true
      }
    ];
    
    return res.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    logger.error('Error fetching payment methods:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create payment method
 */
exports.createPaymentMethod = async (req, res) => {
  return res.json({
    success: true,
    message: 'Payment method created successfully',
    data: { ...req.body, id: Date.now() }
  });
};

/**
 * Update payment method
 */
exports.updatePaymentMethod = async (req, res) => {
  return res.json({
    success: true,
    message: 'Payment method updated successfully',
    data: { id: req.params.id, ...req.body }
  });
};

/**
 * Delete payment method
 */
exports.deletePaymentMethod = async (req, res) => {
  return res.json({
    success: true,
    message: 'Payment method deleted successfully'
  });
};

/**
 * Toggle payment method status
 */
exports.togglePaymentMethodStatus = async (req, res) => {
  return res.json({
    success: true,
    message: 'Payment method status toggled successfully',
    data: { id: req.params.id, enabled: req.body.enabled }
  });
};

/**
 * Get all tax rates
 */
exports.getAllTaxRates = async (req, res) => {
  // Return mock tax rates
  const taxRates = [
    {
      id: 1,
      name: 'Standard Rate',
      rate: 20,
      country: 'UK',
      description: 'Standard VAT rate'
    },
    {
      id: 2,
      name: 'Reduced Rate',
      rate: 5,
      country: 'UK',
      description: 'Reduced VAT rate'
    },
    {
      id: 3,
      name: 'Zero Rate',
      rate: 0,
      country: 'UK',
      description: 'Zero VAT rate'
    }
  ];
  
  return res.json({
    success: true,
    data: taxRates
  });
};

/**
 * Get tax rate by ID
 */
exports.getTaxRateById = async (req, res) => {
  const taxRate = {
    id: req.params.id,
    name: 'Standard Rate',
    rate: 20,
    country: 'UK',
    description: 'Standard VAT rate'
  };
  
  return res.json({
    success: true,
    data: taxRate
  });
};

/**
 * Create tax rate
 */
exports.createTaxRate = async (req, res) => {
  return res.json({
    success: true,
    message: 'Tax rate created successfully',
    data: { ...req.body, id: Date.now() }
  });
};

/**
 * Update tax rate
 */
exports.updateTaxRate = async (req, res) => {
  return res.json({
    success: true,
    message: 'Tax rate updated successfully',
    data: { id: req.params.id, ...req.body }
  });
};

/**
 * Delete tax rate
 */
exports.deleteTaxRate = async (req, res) => {
  return res.json({
    success: true,
    message: 'Tax rate deleted successfully'
  });
};