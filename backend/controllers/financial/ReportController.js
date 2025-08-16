/**
 * Report Controller - Handles financial reports and analytics
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');
const { Op } = require('sequelize');

/**
 * Get sales report
 */
exports.getSalesReport = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { 
      start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      end_date = new Date(),
      group_by = 'day'
    } = req.query;
    
    // Mock sales report data
    let salesData;
    
    if (group_by === 'day') {
      salesData = [
        { date: '2023-06-01', orders: 24, revenue: 2450.75, avg_order_value: 102.11 },
        { date: '2023-06-02', orders: 18, revenue: 1875.50, avg_order_value: 104.19 },
        { date: '2023-06-03', orders: 27, revenue: 3120.25, avg_order_value: 115.56 },
        { date: '2023-06-04', orders: 32, revenue: 3545.60, avg_order_value: 110.80 },
        { date: '2023-06-05', orders: 21, revenue: 2250.30, avg_order_value: 107.15 }
      ];
    } else if (group_by === 'week') {
      salesData = [
        { date: '2023-W22', orders: 142, revenue: 15250.75, avg_order_value: 107.40 },
        { date: '2023-W23', orders: 156, revenue: 17105.50, avg_order_value: 109.65 },
        { date: '2023-W24', orders: 168, revenue: 18250.25, avg_order_value: 108.63 },
        { date: '2023-W25', orders: 135, revenue: 14780.60, avg_order_value: 109.49 }
      ];
    } else if (group_by === 'month') {
      salesData = [
        { date: '2023-01', orders: 587, revenue: 62450.75, avg_order_value: 106.39 },
        { date: '2023-02', orders: 523, revenue: 57875.50, avg_order_value: 110.66 },
        { date: '2023-03', orders: 618, revenue: 68120.25, avg_order_value: 110.23 },
        { date: '2023-04', orders: 641, revenue: 70545.60, avg_order_value: 110.06 },
        { date: '2023-05', orders: 675, revenue: 75250.30, avg_order_value: 111.48 },
        { date: '2023-06', orders: 601, revenue: 67250.80, avg_order_value: 111.90 }
      ];
    }
    
    return res.json({
      success: true,
      data: salesData,
      meta: {
        start_date,
        end_date,
        group_by
      }
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
 * Get revenue report
 */
exports.getRevenueReport = async (req, res) => {
  try {
    const { 
      start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      end_date = new Date(),
      group_by = 'day'
    } = req.query;
    
    // Mock revenue breakdown
    const revenueData = {
      total: 67250.80,
      breakdown: {
        product_categories: [
          { name: 'Electronics', amount: 28450.75, percentage: 42.3 },
          { name: 'Clothing', amount: 15875.50, percentage: 23.6 },
          { name: 'Home & Kitchen', amount: 12120.25, percentage: 18.0 },
          { name: 'Beauty', amount: 7545.60, percentage: 11.2 },
          { name: 'Other', amount: 3258.70, percentage: 4.9 }
        ],
        payment_methods: [
          { name: 'Credit Card', amount: 42450.75, percentage: 63.1 },
          { name: 'PayPal', amount: 15875.50, percentage: 23.6 },
          { name: 'Bank Transfer', amount: 8925.55, percentage: 13.3 }
        ]
      },
      trends: {
        vs_previous_period: 8.5,
        vs_same_period_last_year: 15.2
      }
    };
    
    return res.json({
      success: true,
      data: revenueData,
      meta: {
        start_date,
        end_date,
        group_by
      }
    });
  } catch (error) {
    logger.error('Error generating revenue report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate revenue report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get payments report
 */
exports.getPaymentsReport = async (req, res) => {
  try {
    const { 
      start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      end_date = new Date()
    } = req.query;
    
    // Mock payments data
    const paymentsData = {
      total_payments: 642,
      total_amount: 67250.80,
      payment_methods: [
        { method: 'Credit Card', count: 412, amount: 42450.75, percentage: 63.1 },
        { method: 'PayPal', count: 156, amount: 15875.50, percentage: 23.6 },
        { method: 'Bank Transfer', count: 74, amount: 8924.55, percentage: 13.3 }
      ],
      status: {
        completed: { count: 601, amount: 62450.30, percentage: 92.9 },
        pending: { count: 28, amount: 3245.50, percentage: 4.8 },
        failed: { count: 13, amount: 1555.00, percentage: 2.3 }
      }
    };
    
    return res.json({
      success: true,
      data: paymentsData,
      meta: {
        start_date,
        end_date
      }
    });
  } catch (error) {
    logger.error('Error generating payments report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate payments report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get refunds report
 */
exports.getRefundsReport = async (req, res) => {
  try {
    const { 
      start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      end_date = new Date()
    } = req.query;
    
    // Mock refunds data
    const refundsData = {
      total_refunds: 48,
      total_amount: 5120.75,
      refund_rate: 7.6, // percentage of orders
      refund_amount_rate: 7.2, // percentage of total revenue
      reasons: [
        { reason: 'Product damaged', count: 18, amount: 2250.50, percentage: 43.9 },
        { reason: 'Wrong product', count: 12, amount: 1325.25, percentage: 25.9 },
        { reason: 'Customer changed mind', count: 9, amount: 875.50, percentage: 17.1 },
        { reason: 'Late delivery', count: 6, amount: 512.75, percentage: 10.0 },
        { reason: 'Other', count: 3, amount: 156.75, percentage: 3.1 }
      ]
    };
    
    return res.json({
      success: true,
      data: refundsData,
      meta: {
        start_date,
        end_date
      }
    });
  } catch (error) {
    logger.error('Error generating refunds report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate refunds report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get tax report
 */
exports.getTaxReport = async (req, res) => {
  try {
    const { 
      start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      end_date = new Date()
    } = req.query;
    
    // Mock tax data
    const taxData = {
      total_tax_collected: 13450.16,
      breakdown_by_tax_rate: [
        { rate: 'Standard Rate (20%)', amount: 11200.50, percentage: 83.3 },
        { rate: 'Reduced Rate (5%)', amount: 1850.25, percentage: 13.8 },
        { rate: 'Zero Rate (0%)', amount: 0, percentage: 0 },
        { rate: 'Exempt', amount: 0, percentage: 0 },
        { rate: 'Other', amount: 399.41, percentage: 2.9 }
      ],
      breakdown_by_country: [
        { country: 'United Kingdom', amount: 10250.75, percentage: 76.2 },
        { country: 'France', amount: 1875.50, percentage: 13.9 },
        { country: 'Germany', amount: 1120.25, percentage: 8.3 },
        { country: 'Other EU', amount: 203.66, percentage: 1.6 }
      ]
    };
    
    return res.json({
      success: true,
      data: taxData,
      meta: {
        start_date,
        end_date
      }
    });
  } catch (error) {
    logger.error('Error generating tax report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate tax report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get discounts report
 */
exports.getDiscountsReport = async (req, res) => {
  try {
    const { 
      start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      end_date = new Date()
    } = req.query;
    
    // Mock discounts data
    const discountsData = {
      total_orders_with_discount: 245,
      total_discount_amount: 4850.25,
      discount_rate: 38.1, // percentage of orders with discount
      discount_amount_rate: 7.2, // percentage of total revenue
      discount_codes: [
        { code: 'SUMMER2023', orders: 125, amount: 2500.50, avg_discount: 20.00 },
        { code: 'WELCOME10', orders: 68, amount: 680.00, avg_discount: 10.00 },
        { code: 'LOYALTY15', orders: 32, amount: 960.00, avg_discount: 30.00 },
        { code: 'FREESHIP', orders: 20, amount: 399.75, avg_discount: 20.00 }
      ]
    };
    
    return res.json({
      success: true,
      data: discountsData,
      meta: {
        start_date,
        end_date
      }
    });
  } catch (error) {
    logger.error('Error generating discounts report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate discounts report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Generate custom report
 */
exports.generateCustomReport = async (req, res) => {
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
    
    const { 
      report_type,
      start_date, 
      end_date,
      group_by,
      filters,
      metrics
    } = req.body;
    
    // Mock data for custom report
    const reportData = {
      id: Date.now(),
      name: `${report_type} Report`,
      data: [
        { period: '2023-06-01', orders: 24, revenue: 2450.75, tax: 490.15, discount: 245.07 },
        { period: '2023-06-02', orders: 18, revenue: 1875.50, tax: 375.10, discount: 187.55 },
        { period: '2023-06-03', orders: 27, revenue: 3120.25, tax: 624.05, discount: 312.02 },
        { period: '2023-06-04', orders: 32, revenue: 3545.60, tax: 709.12, discount: 354.56 },
        { period: '2023-06-05', orders: 21, revenue: 2250.30, tax: 450.06, discount: 225.03 }
      ],
      summary: {
        total_orders: 122,
        total_revenue: 13242.40,
        total_tax: 2648.48,
        total_discount: 1324.23,
        avg_order_value: 108.54
      }
    };
    
    return res.json({
      success: true,
      data: reportData,
      meta: {
        report_type,
        start_date,
        end_date,
        group_by,
        generated_at: new Date()
      }
    });
  } catch (error) {
    logger.error('Error generating custom report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate custom report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Export report
 */
exports.exportReport = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    
    // In a real application, this would generate and return a file
    return res.json({
      success: true,
      message: 'Report export initiated',
      data: {
        report_id: reportId,
        export_url: `https://example.com/reports/export/${reportId}.csv`,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
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
