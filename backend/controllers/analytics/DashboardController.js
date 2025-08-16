/**
 * Dashboard Controller - Handles dashboard metrics and analytics
 */

const { sequelize, Order, Product, User, Payment } = require('../../models');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

/**
 * Get dashboard summary metrics
 */
exports.getDashboardSummary = async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    
    // Add company filter (if applicable)
    const whereClause = {};
    if (req.companyId && !req.isSuperAdmin) {
      whereClause.company_id = req.companyId;
    }
    
    // Set up date ranges
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    
    // Get total sales
    const getTotalSales = async () => {
      const result = await Order.sum('total_amount', {
        where: whereClause
      });
      return result || 0;
    };
    
    // Get today's sales
    const getTodaySales = async () => {
      const result = await Order.sum('total_amount', {
        where: {
          ...whereClause,
          created_at: {
            [Op.gte]: today,
            [Op.lt]: tomorrow
          }
        }
      });
      return result || 0;
    };
    
    // Get yesterday's sales
    const getYesterdaySales = async () => {
      const result = await Order.sum('total_amount', {
        where: {
          ...whereClause,
          created_at: {
            [Op.gte]: yesterday,
            [Op.lt]: today
          }
        }
      });
      return result || 0;
    };
    
    // Get this week's sales
    const getThisWeekSales = async () => {
      const result = await Order.sum('total_amount', {
        where: {
          ...whereClause,
          created_at: {
            [Op.gte]: weekStart
          }
        }
      });
      return result || 0;
    };
    
    // Get this month's sales
    const getThisMonthSales = async () => {
      const result = await Order.sum('total_amount', {
        where: {
          ...whereClause,
          created_at: {
            [Op.gte]: monthStart
          }
        }
      });
      return result || 0;
    };
    
    // Get last month's sales
    const getLastMonthSales = async () => {
      const result = await Order.sum('total_amount', {
        where: {
          ...whereClause,
          created_at: {
            [Op.gte]: lastMonthStart,
            [Op.lte]: lastMonthEnd
          }
        }
      });
      return result || 0;
    };
    
    // Get total orders
    const getTotalOrders = async () => {
      return await Order.count({
        where: whereClause
      });
    };
    
    // Get pending orders
    const getPendingOrders = async () => {
      return await Order.count({
        where: {
          ...whereClause,
          status: 'pending'
        }
      });
    };
    
    // Get processing orders
    const getProcessingOrders = async () => {
      return await Order.count({
        where: {
          ...whereClause,
          status: 'processing'
        }
      });
    };
    
    // Get completed orders
    const getCompletedOrders = async () => {
      return await Order.count({
        where: {
          ...whereClause,
          status: 'completed'
        }
      });
    };
    
    // Get cancelled orders
    const getCancelledOrders = async () => {
      return await Order.count({
        where: {
          ...whereClause,
          status: 'cancelled'
        }
      });
    };
    
    // Get low stock products
    const getLowStockProducts = async () => {
      return await Product.count({
        where: {
          ...whereClause,
          stock_quantity: { [Op.lte]: 10, [Op.gt]: 0 }
        }
      });
    };
    
    // Get out of stock products
    const getOutOfStockProducts = async () => {
      return await Product.count({
        where: {
          ...whereClause,
          stock_quantity: 0
        }
      });
    };
    
    // Get total customers
    const getTotalCustomers = async () => {
      return await User.count({
        where: {
          ...whereClause,
          role_id: 6 // Assuming 6 is customer role ID
        }
      });
    };
    
    // Get new customers today
    const getNewCustomersToday = async () => {
      return await User.count({
        where: {
          ...whereClause,
          role_id: 6, // Assuming 6 is customer role ID
          created_at: {
            [Op.gte]: today
          }
        }
      });
    };
    
    // POS Analytics functions
    const getTotalPOSSales = async () => {
      try {
        const result = await query(`
          SELECT COALESCE(SUM(total_amount), 0) as total
          FROM pos_transactions
          WHERE company_id = ? AND status = 'completed'
        `, [companyId]);
        return parseFloat(result[0]?.total || 0);
      } catch (error) {
        logger.error('Error getting total POS sales:', error);
        return 0;
      }
    };

    const getTodayPOSSales = async () => {
      try {
        const result = await query(`
          SELECT COALESCE(SUM(total_amount), 0) as total
          FROM pos_transactions
          WHERE company_id = ? AND status = 'completed'
          AND DATE(created_at) = CURDATE()
        `, [companyId]);
        return parseFloat(result[0]?.total || 0);
      } catch (error) {
        logger.error('Error getting today POS sales:', error);
        return 0;
      }
    };

    const getTotalPOSTransactions = async () => {
      try {
        const result = await query(`
          SELECT COUNT(*) as count
          FROM pos_transactions
          WHERE company_id = ? AND status = 'completed'
        `, [companyId]);
        return parseInt(result[0]?.count || 0);
      } catch (error) {
        logger.error('Error getting total POS transactions:', error);
        return 0;
      }
    };

    const getTodayPOSTransactions = async () => {
      try {
        const result = await query(`
          SELECT COUNT(*) as count
          FROM pos_transactions
          WHERE company_id = ? AND status = 'completed'
          AND DATE(created_at) = CURDATE()
        `, [companyId]);
        return parseInt(result[0]?.count || 0);
      } catch (error) {
        logger.error('Error getting today POS transactions:', error);
        return 0;
      }
    };

    // Execute all queries in parallel
    const [
      totalSales,
      todaySales,
      yesterdaySales,
      thisWeekSales,
      thisMonthSales,
      lastMonthSales,
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      lowStockProducts,
      outOfStockProducts,
      totalCustomers,
      newCustomersToday,
      totalPOSSales,
      todayPOSSales,
      totalPOSTransactions,
      todayPOSTransactions
    ] = await Promise.all([
      getTotalSales(),
      getTodaySales(),
      getYesterdaySales(),
      getThisWeekSales(),
      getThisMonthSales(),
      getLastMonthSales(),
      getTotalOrders(),
      getPendingOrders(),
      getProcessingOrders(),
      getCompletedOrders(),
      getCancelledOrders(),
      getLowStockProducts(),
      getOutOfStockProducts(),
      getTotalCustomers(),
      getNewCustomersToday(),
      getTotalPOSSales(),
      getTodayPOSSales(),
      getTotalPOSTransactions(),
      getTodayPOSTransactions()
    ]);
    
    // Calculate growth rates
    const calculateGrowth = (current, previous) => {
      if (!previous) return 0;
      return ((current - previous) / previous) * 100;
    };
    
    // Return all metrics
    return res.json({
      success: true,
      data: {
        sales: {
          total: totalSales + totalPOSSales,
          today: todaySales + todayPOSSales,
          yesterday: yesterdaySales,
          this_week: thisWeekSales,
          this_month: thisMonthSales,
          last_month: lastMonthSales,
          change: {
            daily: calculateGrowth(todaySales + todayPOSSales, yesterdaySales),
            monthly: calculateGrowth(thisMonthSales, lastMonthSales)
          }
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          completed: completedOrders,
          cancelled: cancelledOrders
        },
        pos: {
          total_sales: totalPOSSales,
          today_sales: todayPOSSales,
          total_transactions: totalPOSTransactions,
          today_transactions: todayPOSTransactions
        },
        inventory: {
          low_stock: lowStockProducts,
          out_of_stock: outOfStockProducts
        },
        customers: {
          total: totalCustomers,
          new_today: newCustomersToday
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching dashboard summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

//dummy chart data
exports.getDashboardCharts = async (req, res) => {
  res.json({ message: 'Dashboard charts data' });
};

/**
 * Get sales trends for charting
 */
exports.getSalesTrends = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    // Add company filter (if applicable)
    const whereClause = {};
    if (req.companyId && !req.isSuperAdmin) {
      whereClause.company_id = req.companyId;
    }
    
    let groupFormat;
    let timeFormat;
    let startDate;
    let endDate = new Date();
    
    // Determine date range and format based on period
    switch (period) {
      case 'day':
        groupFormat = '%Y-%m-%d %H:00:00';
        timeFormat = 'YYYY-MM-DD HH:00';
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
        
      case 'week':
        groupFormat = '%Y-%m-%d';
        timeFormat = 'YYYY-MM-DD';
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
        
      case 'month':
        groupFormat = '%Y-%m-%d';
        timeFormat = 'YYYY-MM-DD';
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
        
      case 'year':
        groupFormat = '%Y-%m';
        timeFormat = 'YYYY-MM';
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
        
      default:
        groupFormat = '%Y-%m-%d';
        timeFormat = 'YYYY-MM-DD';
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
    }
    
    whereClause.created_at = {
      [Op.between]: [startDate, endDate]
    };
    
    // Get sales data grouped by time period
    const salesData = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), groupFormat), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: whereClause,
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), groupFormat)],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), groupFormat), 'ASC']]
    });
    
    return res.json({
      success: true,
      data: {
        period,
        format: timeFormat,
        sales: salesData
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
 * Get top selling products
 */
exports.getTopProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    // Add company filter (if applicable)
    const whereClause = {};
    if (req.companyId && !req.isSuperAdmin) {
      whereClause.company_id = req.companyId;
    }
    
    const topProducts = await OrderItem.findAll({
      attributes: [
        'product_id',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
        [sequelize.fn('SUM', sequelize.col('price')), 'total_sales']
      ],
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'sku', 'price'],
        where: whereClause
      }],
      group: ['product_id'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: parseInt(limit)
    });
    
    return res.json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    logger.error('Error fetching top products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch top products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get recent orders
 */
exports.getRecentOrders = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    // Add company filter (if applicable)
    const whereClause = {};
    if (req.companyId && !req.isSuperAdmin) {
      whereClause.company_id = req.companyId;
    }
    
    const recentOrders = await Order.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'customer',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });
    
    return res.json({
      success: true,
      data: recentOrders
    });
  } catch (error) {
    logger.error('Error fetching recent orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch recent orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user analytics
 */
exports.getUserAnalytics = async (req, res) => {
  try {
    // Add company filter (if applicable)
    const whereClause = {};
    if (req.companyId && !req.isSuperAdmin) {
      whereClause.company_id = req.companyId;
    }
    
    // Get user registrations by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userRegistrations = await User.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m-%d'), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        ...whereClause,
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m-%d')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m-%d'), 'ASC']]
    });
    
    return res.json({
      success: true,
      data: {
        registrations: userRegistrations
      }
    });
  } catch (error) {
    logger.error('Error fetching user analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get revenue by product category
 */
exports.getRevenueByCategory = async (req, res) => {
  try {
    // Add company filter (if applicable)
    const whereClause = {};
    if (req.companyId && !req.isSuperAdmin) {
      whereClause.company_id = req.companyId;
    }
    
    const revenueByCategory = await Product.findAll({
      attributes: [
        'category_id',
        [sequelize.fn('SUM', sequelize.col('OrderItem.price')), 'revenue']
      ],
      include: [
        {
          model: OrderItem,
          attributes: []
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      where: whereClause,
      group: ['category_id'],
      order: [[sequelize.fn('SUM', sequelize.col('OrderItem.price')), 'DESC']]
    });
    
    return res.json({
      success: true,
      data: revenueByCategory
    });
  } catch (error) {
    logger.error('Error fetching revenue by category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue by category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Placeholder for endpoints that aren't implemented yet
exports.getRealtimeOverview = async (req, res) => {
  res.status(501).json({ success: false, error: 'Not implemented yet' });
};

exports.getRealtimeVisitors = async (req, res) => {
  res.status(501).json({ success: false, error: 'Not implemented yet' });
};

exports.customizeDashboard = async (req, res) => {
  res.status(501).json({ success: false, error: 'Not implemented yet' });
};

exports.getCustomDashboard = async (req, res) => {
  res.status(501).json({ success: false, error: 'Not implemented yet' });
};


// backend/controllers/analytics/DashboardController.js
//dummy data for routes/api/v1 need to fix that later.
exports.getDashboardStats = async (req, res) => {
  res.json({
    message: 'Dashboard stats fetched successfully',
    data: {
      users: 120,
      sales: 5500,
      products: 350,
      revenue: 89000,
    },
  });
};

exports.getDashboardCharts = async (req, res) => {
  res.json({
    message: 'Dashboard charts fetched successfully',
    data: {
      chartData: [10, 20, 30, 40],
    },
  });
};

exports.getPerformanceMetrics = async (req, res) => {
  res.json({
    message: 'Performance metrics fetched successfully',
    data: {
      loadTime: '1.2s',
      uptime: '99.9%',
      activeUsers: 78,
    },
  });
};

exports.getRecentActivity = async (req, res) => {
  res.json({
    message: 'Recent activity fetched successfully',
    data: [
      { user: 'John Doe', action: 'Logged in', time: '5 mins ago' },
      { user: 'Jane Smith', action: 'Viewed product', time: '10 mins ago' },
    ],
  });
};

exports.getNotifications = async (req, res) => {
  res.json({
    message: 'Notifications fetched successfully',
    data: [
      { id: 1, title: 'New update available', read: false },
      { id: 2, title: 'Product stock low', read: true },
    ],
  });
};

exports.customizeDashboard = async (req, res) => {
  const { layout, widgets } = req.body;
  res.json({
    message: 'Dashboard customized successfully',
    layout,
    widgets,
  });
};

exports.getCustomDashboard = async (req, res) => {
  res.json({
    message: 'Custom dashboard fetched successfully',
    data: {
      layout: 'grid',
      widgets: ['sales', 'visitors', 'revenue'],
    },
  });
};
