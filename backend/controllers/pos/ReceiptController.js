/**
 * Receipt Controller - Handles POS receipt functionality
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

/**
 * Generate receipt
 */
exports.generateReceipt = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // Mock receipt data
    const receipt = {
      transaction_id: transactionId,
      store_name: 'Demo Store',
      store_address: '123 Main St, Anytown, USA',
      store_phone: '555-123-4567',
      store_email: 'store@example.com',
      date: new Date(),
      items: [
        { name: 'Product 1', quantity: 2, price: 19.99, total: 39.98 },
        { name: 'Product 2', quantity: 1, price: 29.99, total: 29.99 }
      ],
      subtotal: 69.97,
      tax: 5.60,
      total: 75.57,
      payment_method: 'Credit Card',
      cashier: 'John Doe',
      footer_text: 'Thank you for your purchase!'
    };
    
    return res.json({
      success: true,
      data: receipt
    });
  } catch (error) {
    logger.error('Error generating receipt:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate receipt',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Email receipt
 */
exports.emailReceipt = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { transactionId } = req.params;
    const { email } = req.body;
    
    // In a real app, we would send the email here
    
    return res.json({
      success: true,
      message: 'Receipt email sent successfully',
      data: {
        transaction_id: transactionId,
        email,
        sent_at: new Date()
      }
    });
  } catch (error) {
    logger.error('Error emailing receipt:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to email receipt',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * SMS receipt
 */
exports.smsReceipt = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { transactionId } = req.params;
    const { phone } = req.body;
    
    // In a real app, we would send the SMS here
    
    return res.json({
      success: true,
      message: 'Receipt SMS sent successfully',
      data: {
        transaction_id: transactionId,
        phone,
        sent_at: new Date()
      }
    });
  } catch (error) {
    logger.error('Error sending receipt SMS:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send receipt SMS',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get printable receipt
 */
exports.getPrintableReceipt = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // In a real app, we would generate a printer-friendly version
    
    return res.json({
      success: true,
      data: {
        transaction_id: transactionId,
        print_url: `/receipts/print/${transactionId}.pdf`,
        format: 'PDF'
      }
    });
  } catch (error) {
    logger.error('Error generating printable receipt:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate printable receipt',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
