/**
 * Notification Service
 * Handles system notifications and real-time updates
 */
const { EventEmitter } = require('events');
const logger = require('../utils/logger');
const EmailService = require('./EmailService');
const SMSService = require('./SMSService');

class NotificationService extends EventEmitter {
  constructor() {
    super();
    this.channels = new Map();
    this.subscribers = new Map();
    this.notificationHistory = [];
    
    // Set max history size
    this.maxHistorySize = 1000;
    
    // Create default channels
    this._createChannel('system');
    this._createChannel('orders');
    this._createChannel('inventory');
    this._createChannel('users');
    this._createChannel('payments');
  }

  /**
   * Create a notification channel
   * @param {string} channel - Channel name
   * @returns {boolean} - Success status
   * @private
   */
  _createChannel(channel) {
    if (this.channels.has(channel)) {
      return false;
    }
    
    this.channels.set(channel, []);
    return true;
  }

  /**
   * Send notification to specific users or channels
   * @param {object} notification - Notification object
   * @returns {Promise<object>} - Notification with ID
   */
  async sendNotification(notification) {
    try {
      // Add required fields
      const notificationId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      const timestamp = new Date();
      
      const fullNotification = {
        id: notificationId,
        timestamp,
        ...notification
      };
      
      // Add to history
      this._addToHistory(fullNotification);
      
      // Emit to relevant channels
      if (notification.channel) {
        if (this.channels.has(notification.channel)) {
          // Add to channel history
          const channelHistory = this.channels.get(notification.channel);
          channelHistory.unshift(fullNotification);
          
          // Limit channel history size
          if (channelHistory.length > this.maxHistorySize) {
            channelHistory.pop();
          }
          
          // Emit event for this channel
          this.emit(`channel:${notification.channel}`, fullNotification);
          
          // Send to subscribers of this channel
          this._notifyChannelSubscribers(notification.channel, fullNotification);
        }
      }
      
      // Notify specific users if specified
      if (notification.users && Array.isArray(notification.users)) {
        notification.users.forEach(userId => {
          this.emit(`user:${userId}`, fullNotification);
          this._notifyUserSubscribers(userId, fullNotification);
        });
      }
      
      // Send via email if configured
      if (notification.email) {
        this._sendEmailNotification(fullNotification);
      }
      
      // Send via SMS if configured
      if (notification.sms) {
        this._sendSMSNotification(fullNotification);
      }
      
      // Emit global event for all notifications
      this.emit('notification', fullNotification);
      
      return fullNotification;
    } catch (error) {
      logger.error('Error sending notification:', error);
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }

  /**
   * Add notification to history
   * @param {object} notification - Notification object
   * @private
   */
  _addToHistory(notification) {
    this.notificationHistory.unshift(notification);
    
    // Limit history size
    if (this.notificationHistory.length > this.maxHistorySize) {
      this.notificationHistory.pop();
    }
  }

  /**
   * Send notification to channel subscribers
   * @param {string} channel - Channel name
   * @param {object} notification - Notification object
   * @private
   */
  _notifyChannelSubscribers(channel, notification) {
    const subscribers = this.subscribers.get(`channel:${channel}`) || [];
    
    subscribers.forEach(subscriber => {
      try {
        subscriber.callback(notification);
      } catch (error) {
        logger.error(`Error notifying channel subscriber for ${channel}:`, error);
      }
    });
  }

  /**
   * Send notification to user subscribers
   * @param {string} userId - User ID
   * @param {object} notification - Notification object
   * @private
   */
  _notifyUserSubscribers(userId, notification) {
    const subscribers = this.subscribers.get(`user:${userId}`) || [];
    
    subscribers.forEach(subscriber => {
      try {
        subscriber.callback(notification);
      } catch (error) {
        logger.error(`Error notifying user subscriber for user ${userId}:`, error);
      }
    });
  }

  /**
   * Send email notification
   * @param {object} notification - Notification object
   * @returns {Promise<boolean>} - Success status
   * @private
   */
  async _sendEmailNotification(notification) {
    try {
      if (!notification.email || !notification.email.to) {
        return false;
      }
      
      const { to, subject, template, context } = notification.email;
      
      if (template) {
        // Send with template
        await EmailService.sendWithTemplate({
          to,
          subject: subject || notification.title,
          template,
          context: {
            ...context,
            notification: {
              title: notification.title,
              message: notification.message,
              type: notification.type,
              timestamp: notification.timestamp
            }
          }
        });
      } else {
        // Send plain email
        await EmailService.sendEmail({
          to,
          subject: subject || notification.title,
          text: notification.message || '',
          html: notification.email.html || `<h1>${notification.title}</h1><p>${notification.message}</p>`
        });
      }
      
      return true;
    } catch (error) {
      logger.error('Error sending email notification:', error);
      return false;
    }
  }

  /**
   * Send SMS notification
   * @param {object} notification - Notification object
   * @returns {Promise<boolean>} - Success status
   * @private
   */
  async _sendSMSNotification(notification) {
    try {
      if (!notification.sms || !notification.sms.to) {
        return false;
      }
      
      const { to } = notification.sms;
      const message = notification.sms.message || notification.message || notification.title;
      
      await SMSService.sendSMS(to, message);
      
      return true;
    } catch (error) {
      logger.error('Error sending SMS notification:', error);
      return false;
    }
  }

  /**
   * Subscribe to notifications
   * @param {object} subscription - Subscription details
   * @returns {string} - Subscription ID
   */
  subscribe(subscription) {
    try {
      const subscriptionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      
      const { type, target, callback } = subscription;
      
      if (typeof callback !== 'function') {
        throw new Error('Callback must be a function');
      }
      
      const key = `${type}:${target}`;
      
      if (!this.subscribers.has(key)) {
        this.subscribers.set(key, []);
      }
      
      this.subscribers.get(key).push({
        id: subscriptionId,
        callback
      });
      
      return subscriptionId;
    } catch (error) {
      logger.error('Error creating subscription:', error);
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  /**
   * Unsubscribe from notifications
   * @param {string} subscriptionId - Subscription ID
   * @returns {boolean} - Success status
   */
  unsubscribe(subscriptionId) {
    try {
      let found = false;
      
      // Search through all subscriber lists
      this.subscribers.forEach((subscribers, key) => {
        const index = subscribers.findIndex(sub => sub.id === subscriptionId);
        
        if (index !== -1) {
          subscribers.splice(index, 1);
          found = true;
        }
      });
      
      return found;
    } catch (error) {
      logger.error('Error removing subscription:', error);
      return false;
    }
  }

  /**
   * Get notification history
   * @param {object} options - Filter options
   * @returns {Array} - Filtered notifications
   */
  getNotificationHistory(options = {}) {
    try {
      const { channel, userId, limit = 50, offset = 0, startDate, endDate } = options;
      
      let notifications;
      
      // Get notifications from specific channel
      if (channel && this.channels.has(channel)) {
        notifications = this.channels.get(channel);
      } 
      // Get all notifications
      else {
        notifications = this.notificationHistory;
      }
      
      // Apply filters
      let filtered = notifications;
      
      // Filter by user
      if (userId) {
        filtered = filtered.filter(n => 
          n.users && Array.isArray(n.users) && n.users.includes(userId)
        );
      }
      
      // Filter by date range
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        filtered = filtered.filter(n => {
          const notificationDate = new Date(n.timestamp);
          return notificationDate >= start && notificationDate <= end;
        });
      }
      
      // Apply pagination
      return filtered.slice(offset, offset + limit);
    } catch (error) {
      logger.error('Error retrieving notification history:', error);
      return [];
    }
  }

  /**
   * Create a system notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {string} level - Notification level (info, warning, error)
   * @returns {Promise<object>} - Created notification
   */
  async createSystemNotification(title, message, level = 'info') {
    return this.sendNotification({
      title,
      message,
      type: 'system',
      level,
      channel: 'system',
      persistent: level === 'error' || level === 'warning'
    });
  }

  /**
   * Create a user notification
   * @param {Array} userIds - User IDs to notify
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {object} options - Additional options
   * @returns {Promise<object>} - Created notification
   */
  async createUserNotification(userIds, title, message, options = {}) {
    return this.sendNotification({
      title,
      message,
      type: 'user',
      users: Array.isArray(userIds) ? userIds : [userIds],
      channel: 'users',
      ...options
    });
  }

  /**
   * Create an order notification
   * @param {string} orderId - Order ID
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {object} options - Additional options
   * @returns {Promise<object>} - Created notification
   */
  async createOrderNotification(orderId, title, message, options = {}) {
    return this.sendNotification({
      title,
      message,
      type: 'order',
      orderId,
      channel: 'orders',
      ...options
    });
  }

  /**
   * Create an inventory notification
   * @param {string} productId - Product ID
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {object} options - Additional options
   * @returns {Promise<object>} - Created notification
   */
  async createInventoryNotification(productId, title, message, options = {}) {
    return this.sendNotification({
      title,
      message,
      type: 'inventory',
      productId,
      channel: 'inventory',
      ...options
    });
  }

  /**
   * Create a payment notification
   * @param {string} paymentId - Payment ID
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {object} options - Additional options
   * @returns {Promise<object>} - Created notification
   */
  async createPaymentNotification(paymentId, title, message, options = {}) {
    return this.sendNotification({
      title,
      message,
      type: 'payment',
      paymentId,
      channel: 'payments',
      ...options
    });
  }
}

module.exports = new NotificationService(); 