// Analytics API utilities
// This file contains analytics-related API functions

// Mock analytics data
const MOCK_ANALYTICS_DATA = {
  overview: {
    totalRevenue: 125000,
    totalOrders: 1250,
    totalCustomers: 850,
    averageOrderValue: 100
  },
  salesData: [
    { month: 'Jan', sales: 12000 },
    { month: 'Feb', sales: 15000 },
    { month: 'Mar', sales: 18000 },
    { month: 'Apr', sales: 22000 },
    { month: 'May', sales: 25000 },
    { month: 'Jun', sales: 28000 }
  ],
  topProducts: [
    { name: 'Cotton Bedsheet', sales: 150, revenue: 15000 },
    { name: 'Silk Suit', sales: 75, revenue: 22500 },
    { name: 'Linen Runner', sales: 200, revenue: 12000 }
  ]
};

// Analytics API functions
export const getOverview = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    success: true,
    data: MOCK_ANALYTICS_DATA.overview
  };
};

export const getSalesData = async (period = '6months') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    success: true,
    data: MOCK_ANALYTICS_DATA.salesData
  };
};

export const getTopProducts = async (limit = 10) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    success: true,
    data: MOCK_ANALYTICS_DATA.topProducts.slice(0, limit)
  };
};

export const getCustomerAnalytics = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    success: true,
    data: {
      newCustomers: 45,
      returningCustomers: 125,
      customerRetentionRate: 73.5
    }
  };
};

export const getInventoryAnalytics = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    success: true,
    data: {
      lowStockItems: 12,
      outOfStockItems: 3,
      totalProducts: 450,
      inventoryValue: 125000
    }
  };
};
