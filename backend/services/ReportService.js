/**
 * Report Service
 * Handles report generation and processing
 */
const { Op, Sequelize } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { createWriteStream } = require('fs');
const { promisify } = require('util');
const { Order, Product, User, Customer, Payment, Inventory } = require('../models');
const FileService = require('./FileService');
const logger = require('../utils/logger');

class ReportService {
  /**
   * Generate a sales report
   * @param {object} options - Report options
   * @returns {Promise<object>} - Report data
   */
  async generateSalesReport(options = {}) {
    try {
      const {
        startDate = new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate = new Date(),
        companyId = null,
        format = 'json'
      } = options;

      // Build query
      const query = {
        where: {
          created_at: {
            [Op.between]: [startDate, endDate]
          },
          ...(companyId && { company_id: companyId })
        },
        attributes: [
          [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'orderCount'],
          [Sequelize.fn('SUM', Sequelize.col('total')), 'totalSales'],
          [Sequelize.fn('AVG', Sequelize.col('total')), 'averageOrderValue']
        ],
        group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
        order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']]
      };

      // Execute query
      const salesData = await Order.findAll(query);

      // Process results
      const reportData = {
        title: 'Sales Report',
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        summary: {
          totalOrders: salesData.reduce((sum, day) => sum + parseInt(day.dataValues.orderCount, 10), 0),
          totalSales: salesData.reduce((sum, day) => sum + parseFloat(day.dataValues.totalSales || 0), 0),
          averageOrderValue: salesData.reduce((sum, day) => sum + parseFloat(day.dataValues.totalSales || 0), 0) / 
                            salesData.reduce((sum, day) => sum + parseInt(day.dataValues.orderCount, 10), 0)
        },
        data: salesData.map(day => ({
          date: day.dataValues.date,
          orderCount: parseInt(day.dataValues.orderCount, 10),
          totalSales: parseFloat(day.dataValues.totalSales || 0),
          averageOrderValue: parseFloat(day.dataValues.averageOrderValue || 0)
        }))
      };

      // Format and return report
      return await this._formatReport(reportData, format, 'sales-report');
    } catch (error) {
      logger.error('Error generating sales report:', error);
      throw new Error(`Failed to generate sales report: ${error.message}`);
    }
  }

  /**
   * Generate a product inventory report
   * @param {object} options - Report options
   * @returns {Promise<object>} - Report data
   */
  async generateInventoryReport(options = {}) {
    try {
      const {
        companyId = null,
        lowStockOnly = false,
        format = 'json'
      } = options;

      // Build query
      const query = {
        where: {
          ...(companyId && { company_id: companyId }),
          ...(lowStockOnly && { quantity: { [Op.lt]: Sequelize.col('reorder_threshold') } })
        },
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku', 'price']
        }],
        order: [['quantity', 'ASC']]
      };

      // Execute query
      const inventoryData = await Inventory.findAll(query);

      // Process results
      const reportData = {
        title: lowStockOnly ? 'Low Stock Inventory Report' : 'Inventory Report',
        generatedAt: new Date().toISOString(),
        summary: {
          totalProducts: inventoryData.length,
          totalItems: inventoryData.reduce((sum, item) => sum + item.quantity, 0),
          lowStockItems: inventoryData.filter(item => item.quantity < item.reorder_threshold).length
        },
        data: inventoryData.map(item => ({
          productId: item.product_id,
          productName: item.product ? item.product.name : 'Unknown',
          sku: item.product ? item.product.sku : '',
          quantity: item.quantity,
          reorderThreshold: item.reorder_threshold,
          reorderAmount: item.reorder_amount,
          location: item.location,
          lastRestocked: item.last_restock_date,
          price: item.product ? item.product.price : 0,
          value: item.product ? (item.product.price * item.quantity) : 0
        }))
      };

      // Format and return report
      return await this._formatReport(reportData, format, 'inventory-report');
    } catch (error) {
      logger.error('Error generating inventory report:', error);
      throw new Error(`Failed to generate inventory report: ${error.message}`);
    }
  }

  /**
   * Generate a customer report
   * @param {object} options - Report options
   * @returns {Promise<object>} - Report data
   */
  async generateCustomerReport(options = {}) {
    try {
      const {
        startDate = new Date(new Date().setDate(new Date().getDate() - 90)),
        endDate = new Date(),
        companyId = null,
        format = 'json'
      } = options;

      // Get all customers
      const customers = await Customer.findAll({
        where: {
          ...(companyId && { company_id: companyId })
        },
        attributes: ['id', 'name', 'email', 'phone', 'created_at']
      });

      // For each customer, get order data
      const customerData = await Promise.all(customers.map(async (customer) => {
        // Get customer orders
        const orders = await Order.findAll({
          where: {
            customer_id: customer.id,
            created_at: {
              [Op.between]: [startDate, endDate]
            }
          },
          attributes: ['id', 'total', 'created_at']
        });

        // Calculate customer metrics
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
        const orderCount = orders.length;
        const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;
        const firstOrderDate = orders.length > 0 
          ? new Date(Math.min(...orders.map(order => new Date(order.created_at).getTime())))
          : null;
        const lastOrderDate = orders.length > 0
          ? new Date(Math.max(...orders.map(order => new Date(order.created_at).getTime())))
          : null;

        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          registeredDate: customer.created_at,
          orderCount,
          totalSpent,
          averageOrderValue,
          firstOrderDate,
          lastOrderDate,
          daysSinceLastOrder: lastOrderDate ? Math.floor((new Date() - lastOrderDate) / (1000 * 60 * 60 * 24)) : null,
          customerLifetimeValue: totalSpent
        };
      }));

      // Sort customers by total spent in descending order
      customerData.sort((a, b) => b.totalSpent - a.totalSpent);

      // Process results
      const reportData = {
        title: 'Customer Report',
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        summary: {
          totalCustomers: customerData.length,
          totalRevenue: customerData.reduce((sum, customer) => sum + customer.totalSpent, 0),
          averageCustomerValue: customerData.reduce((sum, customer) => sum + customer.totalSpent, 0) / 
                              (customerData.length || 1),
          activeCustomers: customerData.filter(customer => 
            customer.lastOrderDate && (new Date() - new Date(customer.lastOrderDate) < 90 * 24 * 60 * 60 * 1000)
          ).length
        },
        data: customerData
      };

      // Format and return report
      return await this._formatReport(reportData, format, 'customer-report');
    } catch (error) {
      logger.error('Error generating customer report:', error);
      throw new Error(`Failed to generate customer report: ${error.message}`);
    }
  }

  /**
   * Generate payment report
   * @param {object} options - Report options
   * @returns {Promise<object>} - Report data
   */
  async generatePaymentReport(options = {}) {
    try {
      const {
        startDate = new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate = new Date(),
        companyId = null,
        paymentMethod = null,
        format = 'json'
      } = options;

      // Build query
      const query = {
        where: {
          payment_date: {
            [Op.between]: [startDate, endDate]
          },
          ...(companyId && { company_id: companyId }),
          ...(paymentMethod && { payment_method: paymentMethod })
        },
        include: [{
          model: Order,
          as: 'order',
          attributes: ['id', 'order_number']
        }]
      };

      // Execute query
      const paymentData = await Payment.findAll(query);

      // Group by payment method
      const paymentMethodGroups = paymentData.reduce((groups, payment) => {
        const method = payment.payment_method;
        if (!groups[method]) {
          groups[method] = {
            count: 0,
            total: 0,
            payments: []
          };
        }
        
        groups[method].count++;
        groups[method].total += payment.amount;
        groups[method].payments.push({
          id: payment.id,
          orderId: payment.order_id,
          orderNumber: payment.order ? payment.order.order_number : 'Unknown',
          amount: payment.amount,
          date: payment.payment_date,
          status: payment.status,
          transactionId: payment.transaction_id
        });
        
        return groups;
      }, {});

      // Process results
      const reportData = {
        title: 'Payment Report',
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        summary: {
          totalPayments: paymentData.length,
          totalRevenue: paymentData.reduce((sum, payment) => sum + payment.amount, 0),
          paymentMethodBreakdown: Object.keys(paymentMethodGroups).map(method => ({
            method,
            count: paymentMethodGroups[method].count,
            total: paymentMethodGroups[method].total,
            percentage: (paymentMethodGroups[method].count / paymentData.length * 100).toFixed(2)
          }))
        },
        data: paymentData.map(payment => ({
          id: payment.id,
          orderId: payment.order_id,
          orderNumber: payment.order ? payment.order.order_number : 'Unknown',
          amount: payment.amount,
          method: payment.payment_method,
          date: payment.payment_date,
          status: payment.status,
          transactionId: payment.transaction_id
        }))
      };

      // Format and return report
      return await this._formatReport(reportData, format, 'payment-report');
    } catch (error) {
      logger.error('Error generating payment report:', error);
      throw new Error(`Failed to generate payment report: ${error.message}`);
    }
  }

  /**
   * Format report in requested format
   * @param {object} reportData - Report data
   * @param {string} format - Report format (json, csv, excel, pdf)
   * @param {string} filename - Base filename without extension
   * @returns {Promise<object>} - Formatted report info
   * @private
   */
  async _formatReport(reportData, format, filename) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileBasename = `${filename}-${timestamp}`;
      let filePath;
      let mimeType;

      switch (format.toLowerCase()) {
        case 'csv':
          filePath = await this._generateCSV(reportData, fileBasename);
          mimeType = 'text/csv';
          break;
          
        case 'excel':
          filePath = await this._generateExcel(reportData, fileBasename);
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
          
        case 'pdf':
          filePath = await this._generatePDF(reportData, fileBasename);
          mimeType = 'application/pdf';
          break;
          
        case 'json':
        default:
          filePath = await this._generateJSON(reportData, fileBasename);
          mimeType = 'application/json';
          break;
      }

      // Get file URL using FileService
      const fileContent = await fs.readFile(filePath);
      const fileDetails = await FileService.storeFile({
        originalname: `${fileBasename}.${format.toLowerCase() === 'excel' ? 'xlsx' : format.toLowerCase()}`,
        buffer: fileContent
      }, 'exports');

      // Delete temp file
      await fs.unlink(filePath).catch(() => {});

      return {
        report: reportData,
        file: {
          url: fileDetails.url,
          filename: fileDetails.filename,
          mimetype: mimeType,
          size: fileDetails.size
        }
      };
    } catch (error) {
      logger.error('Error formatting report:', error);
      throw new Error(`Failed to format report: ${error.message}`);
    }
  }

  /**
   * Generate JSON report file
   * @param {object} data - Report data
   * @param {string} filename - Base filename
   * @returns {Promise<string>} - File path
   * @private
   */
  async _generateJSON(data, filename) {
    const tempDir = path.join(__dirname, '../storage/temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    const filePath = path.join(tempDir, `${filename}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    return filePath;
  }

  /**
   * Generate CSV report file
   * @param {object} data - Report data
   * @param {string} filename - Base filename
   * @returns {Promise<string>} - File path
   * @private
   */
  async _generateCSV(data, filename) {
    const tempDir = path.join(__dirname, '../storage/temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    const filePath = path.join(tempDir, `${filename}.csv`);
    
    // Flatten data for CSV
    let flatData = [];
    
    if (Array.isArray(data.data)) {
      flatData = data.data;
    }
    
    // Use json2csv to convert to CSV
    const parser = new Parser();
    const csv = parser.parse(flatData);
    
    await fs.writeFile(filePath, csv);
    return filePath;
  }

  /**
   * Generate Excel report file
   * @param {object} data - Report data
   * @param {string} filename - Base filename
   * @returns {Promise<string>} - File path
   * @private
   */
  async _generateExcel(data, filename) {
    const tempDir = path.join(__dirname, '../storage/temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    const filePath = path.join(tempDir, `${filename}.xlsx`);
    
    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Admin System';
    workbook.created = new Date();
    
    // Add report sheet
    const sheet = workbook.addWorksheet('Report');
    
    // Add title
    sheet.addRow([data.title]);
    sheet.getRow(1).font = { bold: true, size: 16 };
    sheet.addRow([`Generated: ${new Date().toLocaleString()}`]);
    sheet.addRow([]);
    
    // Add summary section
    sheet.addRow(['Summary']);
    sheet.getRow(4).font = { bold: true };
    
    // Add summary data
    const summaryRows = [];
    for (const [key, value] of Object.entries(data.summary)) {
      if (typeof value !== 'object') {
        summaryRows.push([key, value]);
      }
    }
    summaryRows.forEach(row => sheet.addRow(row));
    
    sheet.addRow([]);
    
    // Add data section
    sheet.addRow(['Data']);
    sheet.getRow(6 + summaryRows.length).font = { bold: true };
    
    // Add column headers if data is array
    if (Array.isArray(data.data) && data.data.length > 0) {
      const headers = Object.keys(data.data[0]);
      sheet.addRow(headers);
      sheet.getRow(7 + summaryRows.length).font = { bold: true };
      
      // Add data rows
      data.data.forEach(row => {
        sheet.addRow(Object.values(row));
      });
    }
    
    // Auto-size columns
    sheet.columns.forEach(column => {
      column.width = 15;
    });
    
    // Save workbook
    await workbook.xlsx.writeFile(filePath);
    
    return filePath;
  }

  /**
   * Generate PDF report file
   * @param {object} data - Report data
   * @param {string} filename - Base filename
   * @returns {Promise<string>} - File path
   * @private
   */
  async _generatePDF(data, filename) {
    const tempDir = path.join(__dirname, '../storage/temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    const filePath = path.join(tempDir, `${filename}.pdf`);
    
    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    const stream = doc.pipe(createWriteStream(filePath));
    
    // Add title
    doc.fontSize(20).text(data.title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`);
    doc.moveDown();
    
    // Add summary section
    doc.fontSize(16).text('Summary', { underline: true });
    doc.moveDown();
    
    // Add summary data
    for (const [key, value] of Object.entries(data.summary)) {
      if (typeof value !== 'object') {
        doc.fontSize(12).text(`${key}: ${value}`);
      }
    }
    
    doc.moveDown();
    
    // Add data section if not too large
    if (Array.isArray(data.data) && data.data.length > 0 && data.data.length <= 100) {
      doc.fontSize(16).text('Data', { underline: true });
      doc.moveDown();
      
      // Add data in simple format (full table would require more complex layout)
      data.data.forEach((row, index) => {
        doc.fontSize(12).text(`Item ${index + 1}:`);
        
        for (const [key, value] of Object.entries(row)) {
          const displayValue = value instanceof Date ? value.toLocaleString() : value;
          doc.fontSize(10).text(`  ${key}: ${displayValue}`);
        }
        
        doc.moveDown();
        
        // Add page break every 5 items
        if ((index + 1) % 5 === 0 && index < data.data.length - 1) {
          doc.addPage();
        }
      });
    } else if (Array.isArray(data.data) && data.data.length > 100) {
      doc.fontSize(12).text('Data section too large for PDF. Please use Excel or CSV format for full data.');
    }
    
    // Finalize PDF
    doc.end();
    
    // Wait for the PDF to be written
    await new Promise((resolve) => {
      stream.on('finish', resolve);
    });
    
    return filePath;
  }
}

module.exports = new ReportService(); 