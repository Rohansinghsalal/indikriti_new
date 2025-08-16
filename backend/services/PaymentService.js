/**
 * Payment Service
 * Handles payment processing and integrations with payment gateways
 */
const { Payment, Order } = require('../models');
const paymentConfig = require('../config/payment');
const logger = require('../utils/logger');

class PaymentService {
  /**
   * Process a payment for an order
   * @param {object} paymentData - Payment data
   * @returns {Promise<object>} - Payment details
   */
  async processPayment(paymentData) {
    try {
      const {
        order_id,
        customer_id,
        amount,
        payment_method,
        payment_details,
        company_id
      } = paymentData;

      // Validate order exists
      const order = await Order.findByPk(order_id);
      if (!order) {
        throw new Error('Order not found');
      }

      // Choose payment gateway based on method or config default
      const gateway = payment_method || paymentConfig.defaultGateway;
      
      // Process payment through gateway
      const gatewayResponse = await this._processWithGateway(gateway, {
        amount,
        orderId: order_id,
        customerId: customer_id,
        ...payment_details
      });

      // Create payment record
      const payment = await Payment.create({
        order_id,
        customer_id,
        amount,
        payment_method: gateway,
        payment_date: new Date(),
        transaction_id: gatewayResponse.transactionId,
        status: gatewayResponse.status,
        payment_details: JSON.stringify(gatewayResponse.details),
        company_id
      });

      // Update order payment status
      if (gatewayResponse.status === 'completed') {
        order.payment_status = 'paid';
        await order.save();
      }

      return payment;
    } catch (error) {
      logger.error('Payment processing error:', error);
      throw error;
    }
  }

  /**
   * Process payment with appropriate gateway
   * @param {string} gateway - Payment gateway name
   * @param {object} data - Payment data
   * @returns {Promise<object>} - Gateway response
   * @private
   */
  async _processWithGateway(gateway, data) {
    switch (gateway.toLowerCase()) {
      case 'stripe':
        return this._processWithStripe(data);
      case 'paypal':
        return this._processWithPayPal(data);
      case 'razorpay':
        return this._processWithRazorpay(data);
      case 'manual':
        return this._processManualPayment(data);
      default:
        throw new Error(`Unsupported payment gateway: ${gateway}`);
    }
  }

  /**
   * Process payment with Stripe
   * @param {object} data - Payment data
   * @returns {Promise<object>} - Stripe response
   * @private
   */
  async _processWithStripe(data) {
    try {
      // This is a placeholder. In a real application, 
      // you would integrate with Stripe's API here.
      
      // Simulating a successful payment for now
      return {
        status: 'completed',
        transactionId: `stripe_${Date.now()}`,
        details: {
          gateway: 'stripe',
          amount: data.amount,
          currency: paymentConfig.settings.currency,
          timestamp: new Date().toISOString(),
          card: {
            last4: data.card ? data.card.last4 : '4242',
            brand: data.card ? data.card.brand : 'visa',
            expMonth: data.card ? data.card.expMonth : 12,
            expYear: data.card ? data.card.expYear : 2025
          }
        }
      };
    } catch (error) {
      logger.error('Stripe payment error:', error);
      throw new Error(`Stripe payment processing failed: ${error.message}`);
    }
  }

  /**
   * Process payment with PayPal
   * @param {object} data - Payment data
   * @returns {Promise<object>} - PayPal response
   * @private
   */
  async _processWithPayPal(data) {
    try {
      // This is a placeholder. In a real application, 
      // you would integrate with PayPal's API here.
      
      // Simulating a successful payment for now
      return {
        status: 'completed',
        transactionId: `paypal_${Date.now()}`,
        details: {
          gateway: 'paypal',
          amount: data.amount,
          currency: paymentConfig.settings.currency,
          timestamp: new Date().toISOString(),
          payerId: data.payerId || 'SAMPLE_PAYER_ID'
        }
      };
    } catch (error) {
      logger.error('PayPal payment error:', error);
      throw new Error(`PayPal payment processing failed: ${error.message}`);
    }
  }

  /**
   * Process payment with Razorpay
   * @param {object} data - Payment data
   * @returns {Promise<object>} - Razorpay response
   * @private
   */
  async _processWithRazorpay(data) {
    try {
      // This is a placeholder. In a real application, 
      // you would integrate with Razorpay's API here.
      
      // Simulating a successful payment for now
      return {
        status: 'completed',
        transactionId: `rzp_${Date.now()}`,
        details: {
          gateway: 'razorpay',
          amount: data.amount,
          currency: paymentConfig.settings.currency,
          timestamp: new Date().toISOString(),
          razorpayOrderId: data.razorpayOrderId || 'SAMPLE_ORDER_ID'
        }
      };
    } catch (error) {
      logger.error('Razorpay payment error:', error);
      throw new Error(`Razorpay payment processing failed: ${error.message}`);
    }
  }

  /**
   * Process manual payment
   * @param {object} data - Payment data
   * @returns {Promise<object>} - Manual payment response
   * @private
   */
  async _processManualPayment(data) {
    // For manual payments like cash, bank transfer, etc.
    return {
      status: 'completed',
      transactionId: `manual_${Date.now()}`,
      details: {
        gateway: 'manual',
        method: data.manualMethod || 'cash',
        amount: data.amount,
        currency: paymentConfig.settings.currency,
        timestamp: new Date().toISOString(),
        notes: data.notes || ''
      }
    };
  }

  /**
   * Get payment by ID
   * @param {number} id - Payment ID
   * @returns {Promise<object>} - Payment details
   */
  async getPaymentById(id) {
    return Payment.findByPk(id, {
      include: [{ model: Order }]
    });
  }

  /**
   * Get payments by order ID
   * @param {number} orderId - Order ID
   * @returns {Promise<Array>} - Payments for order
   */
  async getPaymentsByOrderId(orderId) {
    return Payment.findAll({
      where: { order_id: orderId },
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Process refund
   * @param {number} paymentId - Payment ID
   * @param {object} refundData - Refund data
   * @returns {Promise<object>} - Refund details
   */
  async processRefund(paymentId, refundData) {
    try {
      const payment = await Payment.findByPk(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'completed') {
        throw new Error(`Cannot refund payment with status: ${payment.status}`);
      }

      // Process refund with gateway
      // This would be implemented with actual gateway integrations
      
      // Update payment status
      payment.status = 'refunded';
      await payment.save();
      
      // Update order status
      const order = await Order.findByPk(payment.order_id);
      if (order) {
        order.payment_status = 'refunded';
        await order.save();
      }

      return {
        success: true,
        payment: payment,
        refundDetails: {
          amount: refundData.amount || payment.amount,
          reason: refundData.reason,
          processedAt: new Date()
        }
      };
    } catch (error) {
      logger.error('Refund processing error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService(); 