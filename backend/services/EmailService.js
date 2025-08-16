/**
 * Email Service
 * Handles sending emails through configured transport
 */
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const Handlebars = require('handlebars');
const appConfig = require('../config/app');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.emailConfig = appConfig.email;
    this.templateCache = {};
    
    this._initTransporter();
  }

  /**
   * Initialize nodemailer transporter
   * @private
   */
  _initTransporter() {
    // Only initialize if email is enabled
    if (this.emailConfig.enabled) {
      this.transporter = nodemailer.createTransport(this.emailConfig.transport);
    }
  }

  /**
   * Load an email template and compile with Handlebars
   * @param {string} templateName - Name of the template file without extension
   * @returns {Promise<Function>} - Compiled Handlebars template
   * @private
   */
  async _loadTemplate(templateName) {
    try {
      // Check if template is already cached
      if (this.templateCache[templateName]) {
        return this.templateCache[templateName];
      }

      // Load template file
      const templatePath = path.join(__dirname, '../resources/email-templates', `${templateName}.html`);
      const templateSource = await fs.readFile(templatePath, 'utf8');
      
      // Compile template
      const template = Handlebars.compile(templateSource);
      
      // Cache template
      this.templateCache[templateName] = template;
      
      return template;
    } catch (error) {
      logger.error(`Error loading email template ${templateName}:`, error);
      throw new Error(`Failed to load email template: ${error.message}`);
    }
  }

  /**
   * Send email using a template
   * @param {object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.template - Template name
   * @param {object} options.context - Template variables
   * @returns {Promise<object>} - Send result
   */
  async sendWithTemplate(options) {
    try {
      if (!this.emailConfig.enabled) {
        logger.warn('Attempted to send email while email service is disabled');
        return { success: false, message: 'Email service is disabled' };
      }

      const { to, subject, template, context } = options;

      // Load and compile template
      const compiledTemplate = await this._loadTemplate(template);
      const html = compiledTemplate(context);

      // Set up email data
      const mailOptions = {
        from: options.from || this.emailConfig.from,
        to,
        subject,
        html
      };

      // Add CC if provided
      if (options.cc) mailOptions.cc = options.cc;
      
      // Add BCC if provided
      if (options.bcc) mailOptions.bcc = options.bcc;
      
      // Add attachments if provided
      if (options.attachments) mailOptions.attachments = options.attachments;

      // Send email
      const result = await this.transporter.sendMail(mailOptions);
      
      logger.info(`Email sent to ${to}: ${subject}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Send a simple email without template
   * @param {object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Email text content
   * @param {string} options.html - Email HTML content (optional)
   * @returns {Promise<object>} - Send result
   */
  async sendEmail(options) {
    try {
      if (!this.emailConfig.enabled) {
        logger.warn('Attempted to send email while email service is disabled');
        return { success: false, message: 'Email service is disabled' };
      }

      const { to, subject, text, html } = options;

      // Set up email data
      const mailOptions = {
        from: options.from || this.emailConfig.from,
        to,
        subject,
        text
      };

      // Add HTML if provided
      if (html) mailOptions.html = html;
      
      // Add CC if provided
      if (options.cc) mailOptions.cc = options.cc;
      
      // Add BCC if provided
      if (options.bcc) mailOptions.bcc = options.bcc;
      
      // Add attachments if provided
      if (options.attachments) mailOptions.attachments = options.attachments;

      // Send email
      const result = await this.transporter.sendMail(mailOptions);
      
      logger.info(`Email sent to ${to}: ${subject}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Send a welcome email to a new user
   * @param {object} user - User object
   * @returns {Promise<object>} - Send result
   */
  async sendWelcomeEmail(user) {
    try {
      return this.sendWithTemplate({
        to: user.email,
        subject: 'Welcome to Admin Panel',
        template: 'welcome',
        context: {
          name: user.name,
          loginUrl: `${appConfig.app.url}/login`
        }
      });
    } catch (error) {
      logger.error('Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Send a password reset email
   * @param {object} user - User object
   * @param {string} resetToken - Password reset token
   * @returns {Promise<object>} - Send result
   */
  async sendPasswordResetEmail(user, resetToken) {
    try {
      const resetUrl = `${appConfig.app.url}/reset-password?token=${resetToken}`;
      
      return this.sendWithTemplate({
        to: user.email,
        subject: 'Reset Your Password',
        template: 'password-reset',
        context: {
          name: user.name,
          resetUrl,
          expiresIn: '1 hour'
        }
      });
    } catch (error) {
      logger.error('Error sending password reset email:', error);
      throw error;
    }
  }

  /**
   * Send order confirmation email
   * @param {object} order - Order object with customer and items
   * @returns {Promise<object>} - Send result
   */
  async sendOrderConfirmationEmail(order) {
    try {
      return this.sendWithTemplate({
        to: order.customer.email,
        subject: `Order Confirmation #${order.order_number}`,
        template: 'order-confirmation',
        context: {
          customerName: order.customer.name,
          orderNumber: order.order_number,
          orderDate: new Date(order.created_at).toLocaleDateString(),
          items: order.items,
          subtotal: order.subtotal,
          tax: order.tax,
          shipping: order.shipping_cost,
          discount: order.discount,
          total: order.total,
          shippingAddress: order.shipping_address,
          paymentMethod: order.payment_method
        }
      });
    } catch (error) {
      logger.error('Error sending order confirmation email:', error);
      throw error;
    }
  }

  /**
   * Verify that the email service is working properly
   * @returns {Promise<boolean>} - Connection verification result
   */
  async verifyConnection() {
    try {
      if (!this.emailConfig.enabled) {
        return false;
      }
      
      await this.transporter.verify();
      return true;
    } catch (error) {
      logger.error('Email service connection error:', error);
      return false;
    }
  }
}

module.exports = new EmailService(); 