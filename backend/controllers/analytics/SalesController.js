/**
 * Sales Controller - Handles analytics related to sales
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');
const { Order, Product, User, Payment } = require('../../models');
const { Op } = require('sequelize');

/**
 * Get sales summary analytics
 */
exports.getSalesSummary = async (req, res) => {
  try {
    // Add company filter (if applicable)
    const whereClause = {};
    if (req.companyId && !req.isSuperAdmin) {
      whereClause.company_id = req.companyId;
    }
    
    // Return mock sales summary
    return res.json({
      success: true,
      data: {
        total_revenue: 1254750.45,
        total_orders: 8452,
        average_order_value: 148.45,
        refund_rate: 3.2,
        period_comparison: {
          current_period: {
            start_date: '2023-06-01',
            end_date: '2023-06-30',
            revenue: 148250.85,
            orders: 1045
          },
          previous_period: {
            start_date: '2023-05-01',
            end_date: '2023-05-31',
            revenue: 135480.92,
            orders: 972
          },
          change: {
            revenue_percent: 9.4,
            orders_percent: 7.5
          }
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching sales summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sales summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get sales trends for analysis
 */
exports.getSalesTrends = async (req, res) => {
  try {
    const { period = 'month', compare = 'previous' } = req.query;
    
    // Return mock sales trends
    return res.json({
      success: true,
      data: {
        period,
        compare,
        current: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [32450.75, 35820.45, 38750.92, 41230.25]
        },
        comparison: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [30250.45, 32840.85, 35420.65, 36970.15]
        },
        growth: {
          overall: 9.6,
          weekly: [7.3, 9.1, 9.4, 11.5]
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching sales trends:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sales trends',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get product sales analytics
 */
exports.getProductSales = async (req, res) => {
  try {
    const { sort = 'revenue', limit = 10 } = req.query;
    
    // Return mock product sales data
    return res.json({
      success: true,
      data: {
        top_products: [
          { id: 123, name: 'Wireless Earbuds', sku: 'WE-001', sales: 584, revenue: 29200, growth: 12.5 },
          { id: 245, name: 'Smart Watch', sku: 'SW-002', sales: 421, revenue: 42100, growth: 8.7 },
          { id: 156, name: 'Bluetooth Speaker', sku: 'BS-003', sales: 385, revenue: 23100, growth: 5.4 },
          { id: 187, name: 'Laptop Sleeve', sku: 'LS-004', sales: 352, revenue: 8800, growth: 3.2 },
          { id: 293, name: 'Wireless Charger', sku: 'WC-005', sales: 325, revenue: 9750, growth: 7.8 }
        ],
        trending_products: [
          { id: 345, name: 'Fitness Tracker', sku: 'FT-006', sales: 285, growth: 18.5 },
          { id: 267, name: 'Wireless Keyboard', sku: 'WK-007', sales: 245, growth: 15.2 },
          { id: 389, name: 'Noise Cancelling Headphones', sku: 'NCH-008', sales: 215, growth: 14.8 }
        ],
        declining_products: [
          { id: 456, name: 'Wired Mouse', sku: 'WM-009', sales: 125, decline: -8.5 },
          { id: 478, name: 'USB Flash Drive', sku: 'UFD-010', sales: 98, decline: -12.4 },
          { id: 512, name: 'Phone Case', sku: 'PC-011', sales: 154, decline: -5.6 }
        ]
      }
    });
  } catch (error) {
    logger.error('Error fetching product sales:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product sales',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get customer sales analytics
 */
exports.getCustomerSales = async (req, res) => {
  try {
    const { sort = 'revenue', limit = 10 } = req.query;
    
    // Return mock customer sales data
    return res.json({
      success: true,
      data: {
        top_customers: [
          { id: 1234, name: 'John Smith', email: 'john@example.com', orders: 25, revenue: 4250.85, avg_order: 170.03 },
          { id: 2345, name: 'Jane Doe', email: 'jane@example.com', orders: 18, revenue: 3985.45, avg_order: 221.41 },
          { id: 3456, name: 'Robert Johnson', email: 'robert@example.com', orders: 15, revenue: 3245.92, avg_order: 216.39 },
          { id: 4567, name: 'Emily Wilson', email: 'emily@example.com', orders: 12, revenue: 2850.45, avg_order: 237.54 },
          { id: 5678, name: 'Michael Brown', email: 'michael@example.com', orders: 10, revenue: 2320.75, avg_order: 232.08 }
        ],
        new_customers: {
          count: 245,
          growth: 8.5,
          conversion_rate: 3.2,
          acquisition_cost: 22.45
        },
        repeat_customers: {
          count: 1845,
          percentage: 68.5,
          avg_orders: 3.4,
          retention_rate: 72.8
        },
        segments: [
          { segment: 'New', count: 845, percentage: 31.5 },
          { segment: 'Occasional', count: 1050, percentage: 39.2 },
          { segment: 'Regular', count: 520, percentage: 19.4 },
          { segment: 'Loyal', count: 265, percentage: 9.9 }
        ]
      }
    });
  } catch (error) {
    logger.error('Error fetching customer sales:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customer sales',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get sales by channel
 */
exports.getSalesByChannel = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Return mock channel sales data
    return res.json({
      success: true,
      data: {
        channels: [
          { channel: 'Website', orders: 5842, revenue: 845250.85, percentage: 67.5, growth: 8.4 },
          { channel: 'Mobile App', orders: 1845, revenue: 285450.45, percentage: 22.8, growth: 15.2 },
          { channel: 'Marketplace', orders: 542, revenue: 82450.75, percentage: 6.6, growth: 4.5 },
          { channel: 'Social Media', orders: 225, revenue: 32850.92, percentage: 2.6, growth: 18.7 },
          { channel: 'Other', orders: 45, revenue: 8750.35, percentage: 0.5, growth: 2.1 }
        ],
        trends: {
          website: [84525, 86450, 88750, 92450, 95280],
          mobile_app: [24550, 26780, 28450, 30250, 32450],
          marketplace: [8245, 8350, 8450, 8520, 8650],
          social_media: [2450, 2850, 3150, 3450, 3750]
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching sales by channel:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sales by channel',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get sales by geography
 */
exports.getSalesByGeography = async (req, res) => {
  try {
    // Return mock geographical sales data
    return res.json({
      success: true,
      data: {
        countries: [
          { country: 'United States', orders: 4528, revenue: 685250.45, percentage: 54.6 },
          { country: 'United Kingdom', orders: 1245, revenue: 185450.85, percentage: 14.8 },
          { country: 'Canada', orders: 845, revenue: 125850.35, percentage: 10.0 },
          { country: 'Australia', orders: 645, revenue: 95450.25, percentage: 7.6 },
          { country: 'Germany', orders: 425, revenue: 62850.75, percentage: 5.0 },
          { country: 'France', orders: 285, revenue: 42550.65, percentage: 3.4 },
          { country: 'Other', orders: 385, revenue: 57350.92, percentage: 4.6 }
        ],
        regions: {
          'North America': { orders: 5373, revenue: 811100.80, percentage: 64.6 },
          'Europe': { orders: 1325, revenue: 198450.85, percentage: 15.8 },
          'Asia Pacific': { orders: 985, revenue: 145850.45, percentage: 11.6 },
          'Rest of World': { orders: 675, revenue: 99350.25, percentage: 7.9 }
        },
        growth_markets: [
          { country: 'India', growth: 24.5, potential: 'High' },
          { country: 'Brazil', growth: 18.7, potential: 'Medium' },
          { country: 'Mexico', growth: 15.2, potential: 'Medium' }
        ]
      }
    });
  } catch (error) {
    logger.error('Error fetching sales by geography:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sales by geography',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get sales by period
 */
exports.getSalesByPeriod = async (req, res) => {
  try {
    const { granularity = 'month', start_date, end_date } = req.query;
    
    // Return mock period sales data
    return res.json({
      success: true,
      data: {
        granularity,
        start_date: start_date || '2023-01-01',
        end_date: end_date || '2023-06-30',
        data: [
          { period: '2023-01', orders: 845, revenue: 125450.85, growth: 4.5 },
          { period: '2023-02', orders: 865, revenue: 128750.45, growth: 2.6 },
          { period: '2023-03', orders: 925, revenue: 138450.75, growth: 7.5 },
          { period: '2023-04', orders: 985, revenue: 148250.35, growth: 7.1 },
          { period: '2023-05', orders: 1025, revenue: 158550.92, growth: 7.0 },
          { period: '2023-06', orders: 1085, revenue: 168750.45, growth: 6.4 }
        ],
        comparison: {
          current_total: 758203.77,
          previous_total: 685450.85,
          growth: 10.6
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching sales by period:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sales by period',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get sales by staff
 */
exports.getSalesByStaff = async (req, res) => {
  try {
    const { sort = 'revenue', limit = 10 } = req.query;
    
    // Return mock staff sales data
    return res.json({
      success: true,
      data: {
        top_staff: [
          { id: 123, name: 'Sarah Johnson', email: 'sarah@example.com', orders: 285, revenue: 42550.85, commission: 2127.54 },
          { id: 124, name: 'David Lee', email: 'david@example.com', orders: 245, revenue: 36750.45, commission: 1837.52 },
          { id: 125, name: 'Maria Garcia', email: 'maria@example.com', orders: 215, revenue: 32450.75, commission: 1622.54 },
          { id: 126, name: 'James Wilson', email: 'james@example.com', orders: 185, revenue: 27850.35, commission: 1392.52 },
          { id: 127, name: 'Emma Brown', email: 'emma@example.com', orders: 165, revenue: 24550.92, commission: 1227.55 }
        ],
        performance: {
          average_per_staff: 32830.46,
          highest: 42550.85,
          lowest: 18450.25
        },
        trends: {
          monthly: [
            { month: 'January', average: 28450.45 },
            { month: 'February', average: 29850.75 },
            { month: 'March', average: 31250.35 },
            { month: 'April', average: 32450.85 },
            { month: 'May', average: 33750.45 },
            { month: 'June', average: 35250.92 }
          ]
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching sales by staff:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sales by staff',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get sales forecasts
 */
exports.getSalesForecasts = async (req, res) => {
  try {
    const { periods = 6 } = req.query;
    
    // Return mock forecast data
    return res.json({
      success: true,
      data: {
        current_month: {
          month: 'June',
          actual: 85450.75,
          projected: 165250.45,
          progress: 51.7
        },
        forecast: [
          { period: 'July', revenue: 172550.85, growth: 4.4 },
          { period: 'August', revenue: 178750.45, growth: 3.6 },
          { period: 'September', revenue: 185450.75, growth: 3.7 },
          { period: 'October', revenue: 195850.35, growth: 5.6 },
          { period: 'November', revenue: 215450.92, growth: 10.0 },
          { period: 'December', revenue: 285750.45, growth: 32.6 }
        ],
        seasonal_factors: [
          { month: 'January', factor: 0.85 },
          { month: 'February', factor: 0.88 },
          { month: 'March', factor: 0.92 },
          { month: 'April', factor: 0.95 },
          { month: 'May', factor: 0.98 },
          { month: 'June', factor: 1.02 },
          { month: 'July', factor: 1.05 },
          { month: 'August', factor: 1.08 },
          { month: 'September', factor: 1.12 },
          { month: 'October', factor: 1.18 },
          { month: 'November', factor: 1.30 },
          { month: 'December', factor: 1.72 }
        ]
      }
    });
  } catch (error) {
    logger.error('Error fetching sales forecasts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sales forecasts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get realtime sales data
 */
exports.getRealtimeSales = async (req, res) => {
  try {
    // Return mock realtime sales data
    return res.json({
      success: true,
      data: {
        today: {
          orders: 85,
          revenue: 12550.85,
          average_order: 147.66,
          target_completion: 42.5
        },
        live_orders: [
          { id: 45128, customer: 'John Smith', amount: 145.85, items: 3, status: 'processing', time: '5 minutes ago' },
          { id: 45127, customer: 'Jane Doe', amount: 89.99, items: 1, status: 'completed', time: '12 minutes ago' },
          { id: 45126, customer: 'Robert Johnson', amount: 245.50, items: 5, status: 'completed', time: '25 minutes ago' },
          { id: 45125, customer: 'Emily Wilson', amount: 54.25, items: 2, status: 'completed', time: '38 minutes ago' }
        ],
        hourly_trend: [
          { hour: '09:00', orders: 8, revenue: 1250.45 },
          { hour: '10:00', orders: 12, revenue: 1850.75 },
          { hour: '11:00', orders: 15, revenue: 2250.35 },
          { hour: '12:00', orders: 18, revenue: 2650.92 },
          { hour: '13:00', orders: 16, revenue: 2350.45 },
          { hour: 'current', orders: 16, revenue: 2198.93 }
        ],
        hot_products: [
          { id: 123, name: 'Wireless Earbuds', sales_today: 12 },
          { id: 245, name: 'Smart Watch', sales_today: 8 },
          { id: 156, name: 'Bluetooth Speaker', sales_today: 7 }
        ]
      }
    });
  } catch (error) {
    logger.error('Error fetching realtime sales:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch realtime sales',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
