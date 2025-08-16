'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

// Mock chart component - in a real application, you would use a charting library like Chart.js, Recharts, etc.
const Chart = ({ type, data, height = 300 }) => {
  return (
    <div 
      className="w-full bg-gray-50 rounded-md flex items-center justify-center" 
      style={{ height: `${height}px` }}
    >
      <div className="text-center">
        <div className="text-gray-400 mb-2">{type} Chart</div>
        <div className="text-sm text-gray-500">Chart visualization would appear here</div>
      </div>
    </div>
  );
};

export default function ProductAnalyticsPage() {
  // State for date range filter
  const [dateRange, setDateRange] = useState('last30days');
  const [comparisonPeriod, setComparisonPeriod] = useState('previousPeriod');
  const [productCategory, setProductCategory] = useState('all');
  
  // Mock data for product metrics
  const productMetrics = {
    totalProducts: {
      current: '1,245',
      previous: '1,187',
      change: '+4.9%',
      trend: 'up'
    },
    activeProducts: {
      current: '987',
      previous: '945',
      change: '+4.4%',
      trend: 'up'
    },
    averageRating: {
      current: '4.3',
      previous: '4.2',
      change: '+2.4%',
      trend: 'up'
    },
    outOfStock: {
      current: '32',
      previous: '45',
      change: '-28.9%',
      trend: 'up' // Trend is up because a decrease in out of stock is positive
    },
    lowStock: {
      current: '78',
      previous: '92',
      change: '-15.2%',
      trend: 'up' // Trend is up because a decrease in low stock is positive
    },
    returnRate: {
      current: '3.2%',
      previous: '3.5%',
      change: '-8.6%',
      trend: 'up' // Trend is up because a decrease in return rate is positive
    }
  };
  
  // Mock data for top selling products
  const topSellingProducts = [
    { id: 1, name: 'Wireless Headphones', sku: 'WH-001', sales: 245, revenue: '$12,250.00', profit: '$4,900.00', trend: 'up' },
    { id: 2, name: 'Smart Watch', sku: 'SW-002', sales: 187, revenue: '$9,350.00', profit: '$3,740.00', trend: 'up' },
    { id: 3, name: 'Bluetooth Speaker', sku: 'BS-003', sales: 156, revenue: '$7,800.00', profit: '$3,120.00', trend: 'down' },
    { id: 4, name: 'Laptop Backpack', sku: 'LB-004', sales: 132, revenue: '$6,600.00', profit: '$2,640.00', trend: 'up' },
    { id: 5, name: 'USB-C Hub', sku: 'UC-005', sales: 98, revenue: '$4,900.00', profit: '$1,960.00', trend: 'down' }
  ];
  
  // Mock data for product categories
  const productCategories = [
    { id: 1, name: 'Electronics', products: 325, sales: 1245, revenue: '$62,250.00', percentage: '42.5%' },
    { id: 2, name: 'Clothing', products: 287, sales: 987, revenue: '$29,610.00', percentage: '20.2%' },
    { id: 3, name: 'Home & Kitchen', products: 198, sales: 654, revenue: '$26,160.00', percentage: '17.9%' },
    { id: 4, name: 'Books', products: 156, sales: 432, revenue: '$8,640.00', percentage: '5.9%' },
    { id: 5, name: 'Beauty & Personal Care', products: 132, sales: 321, revenue: '$9,630.00', percentage: '6.6%' },
    { id: 6, name: 'Sports & Outdoors', products: 98, sales: 245, revenue: '$7,350.00', percentage: '5.0%' },
    { id: 7, name: 'Other', products: 49, sales: 123, revenue: '$2,952.00', percentage: '2.0%' }
  ];
  
  // Mock data for product performance
  const productPerformance = [
    { id: 1, metric: 'View-to-Purchase Rate', value: '3.2%', change: '+0.4%', trend: 'up' },
    { id: 2, metric: 'Cart Abandonment Rate', value: '68.3%', change: '-2.6%', trend: 'up' },
    { id: 3, metric: 'Average Order Value', value: '$36.25', change: '+3.9%', trend: 'up' },
    { id: 4, metric: 'Return Rate', value: '3.2%', change: '-0.3%', trend: 'up' },
    { id: 5, metric: 'Review Rate', value: '12.8%', change: '+1.5%', trend: 'up' },
    { id: 6, metric: 'Cross-sell Rate', value: '24.5%', change: '+2.1%', trend: 'up' }
  ];
  
  // Mock data for inventory metrics
  const inventoryMetrics = [
    { id: 1, metric: 'Total Inventory Value', value: '$245,678.00', change: '+5.2%', trend: 'up' },
    { id: 2, metric: 'Inventory Turnover Rate', value: '4.8', change: '+0.3', trend: 'up' },
    { id: 3, metric: 'Average Days to Sell', value: '18.2', change: '-1.5', trend: 'up' },
    { id: 4, metric: 'Out of Stock Rate', value: '3.2%', change: '-1.1%', trend: 'up' },
    { id: 5, metric: 'Slow-moving Inventory', value: '8.5%', change: '-0.7%', trend: 'up' },
    { id: 6, metric: 'Dead Stock', value: '2.1%', change: '-0.4%', trend: 'up' }
  ];
  
  // Handle date range change
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };
  
  // Handle comparison period change
  const handleComparisonPeriodChange = (e) => {
    setComparisonPeriod(e.target.value);
  };
  
  // Handle product category change
  const handleProductCategoryChange = (e) => {
    setProductCategory(e.target.value);
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Product Analytics</h1>
          <p className="text-gray-500 mt-1">Detailed analysis of your product performance and inventory</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export
          </Button>
          <Link href="/dashboard/analytics/reports/create" passHref>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Report
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              id="dateRange"
              value={dateRange}
              onChange={handleDateRangeChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="lastQuarter">Last Quarter</option>
              <option value="thisYear">This Year</option>
              <option value="lastYear">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="comparisonPeriod" className="block text-sm font-medium text-gray-700 mb-1">
              Compare To
            </label>
            <select
              id="comparisonPeriod"
              value={comparisonPeriod}
              onChange={handleComparisonPeriodChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="previousPeriod">Previous Period</option>
              <option value="samePeroidLastYear">Same Period Last Year</option>
              <option value="noComparison">No Comparison</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Product Category
            </label>
            <select
              id="productCategory"
              value={productCategory}
              onChange={handleProductCategoryChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="homeKitchen">Home & Kitchen</option>
              <option value="books">Books</option>
              <option value="beautyPersonalCare">Beauty & Personal Care</option>
              <option value="sportsOutdoors">Sports & Outdoors</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              productMetrics.totalProducts.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {productMetrics.totalProducts.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{productMetrics.totalProducts.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {productMetrics.totalProducts.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Active Products</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              productMetrics.activeProducts.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {productMetrics.activeProducts.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{productMetrics.activeProducts.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {productMetrics.activeProducts.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Average Rating</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              productMetrics.averageRating.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {productMetrics.averageRating.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{productMetrics.averageRating.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {productMetrics.averageRating.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Out of Stock</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              productMetrics.outOfStock.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {productMetrics.outOfStock.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{productMetrics.outOfStock.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {productMetrics.outOfStock.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Low Stock</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              productMetrics.lowStock.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {productMetrics.lowStock.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{productMetrics.lowStock.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {productMetrics.lowStock.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Return Rate</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              productMetrics.returnRate.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {productMetrics.returnRate.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{productMetrics.returnRate.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {productMetrics.returnRate.previous} previous period</p>
          </div>
        </Card>
      </div>
      
      {/* Product Sales Trend */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Product Sales Trend</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">Units Sold</Button>
            <Button size="sm" variant="outline">Revenue</Button>
            <Button size="sm" variant="outline">Profit</Button>
          </div>
        </div>
        <Chart type="Line" data="productSalesTrend" />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Highest Sales Day</p>
            <p className="mt-1 text-lg font-semibold">Jun 15, 2023</p>
            <p className="text-sm text-gray-500">124 units</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Lowest Sales Day</p>
            <p className="mt-1 text-lg font-semibold">Jun 5, 2023</p>
            <p className="text-sm text-gray-500">32 units</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average Daily Sales</p>
            <p className="mt-1 text-lg font-semibold">68 units</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Sales Trend</p>
            <p className="mt-1 text-lg font-semibold text-green-600">+8.3%</p>
            <p className="text-sm text-gray-500">Week over week</p>
          </div>
        </div>
      </Card>
      
      {/* Product Categories and Top Selling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Categories */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Product Categories</h3>
          <Chart type="Pie" data="productCategories" height={250} />
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{category.products}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{category.sales}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{category.revenue}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{category.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        {/* Top Selling Products */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Top Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topSellingProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.sales}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.revenue}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.profit}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-right">
                      {product.trend === 'up' ? (
                        <svg className="h-5 w-5 text-green-500 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-500 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                        </svg>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Button size="sm" variant="outline">
              View All Products
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Product Performance and Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Product Performance Metrics</h3>
          <div className="space-y-4">
            {productPerformance.map((metric) => (
              <div key={metric.id} className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.metric}</span>
                <div className="flex items-center">
                  <span className="text-sm font-semibold mr-2">{metric.value}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    metric.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Chart type="Bar" data="productPerformance" height={200} />
          </div>
        </Card>
        
        {/* Inventory Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Inventory Metrics</h3>
          <div className="space-y-4">
            {inventoryMetrics.map((metric) => (
              <div key={metric.id} className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.metric}</span>
                <div className="flex items-center">
                  <span className="text-sm font-semibold mr-2">{metric.value}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    metric.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Chart type="Bar" data="inventoryMetrics" height={200} />
          </div>
        </Card>
      </div>
      
      {/* Product Ratings and Reviews */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Product Ratings Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Chart type="Bar" data="ratingDistribution" height={250} />
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-full">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">5 Stars</span>
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-4 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                  <span className="text-sm font-medium ml-2">58%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-full">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">4 Stars</span>
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-green-400 h-4 rounded-full" style={{ width: '27%' }}></div>
                  </div>
                  <span className="text-sm font-medium ml-2">27%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-full">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">3 Stars</span>
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-4 rounded-full" style={{ width: '9%' }}></div>
                  </div>
                  <span className="text-sm font-medium ml-2">9%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-full">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">2 Stars</span>
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-orange-400 h-4 rounded-full" style={{ width: '4%' }}></div>
                  </div>
                  <span className="text-sm font-medium ml-2">4%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-full">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">1 Star</span>
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-4 rounded-full" style={{ width: '2%' }}></div>
                  </div>
                  <span className="text-sm font-medium ml-2">2%</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Average Rating</p>
                  <p className="text-lg font-semibold">4.3/5.0</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                  <p className="text-lg font-semibold">2,458</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Review Rate</p>
                  <p className="text-lg font-semibold">12.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Product Recommendations */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Product Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">Restock Soon</h4>
            <p className="text-sm text-yellow-700 mb-4">These products are selling well and will be out of stock soon.</p>
            <ul className="space-y-2">
              <li className="text-sm">Wireless Headphones (5 left)</li>
              <li className="text-sm">Smart Watch (8 left)</li>
              <li className="text-sm">USB-C Hub (7 left)</li>
            </ul>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full">
                View All (12)
              </Button>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-800 mb-2">Poor Performers</h4>
            <p className="text-sm text-red-700 mb-4">These products have low sales and high return rates.</p>
            <ul className="space-y-2">
              <li className="text-sm">Bluetooth Keyboard (8.5% return rate)</li>
              <li className="text-sm">Wireless Mouse (7.2% return rate)</li>
              <li className="text-sm">Phone Stand (6.8% return rate)</li>
            </ul>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full">
                View All (8)
              </Button>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">Top Performers</h4>
            <p className="text-sm text-green-700 mb-4">These products have high sales and profit margins.</p>
            <ul className="space-y-2">
              <li className="text-sm">Wireless Headphones (40% margin)</li>
              <li className="text-sm">Smart Watch (38% margin)</li>
              <li className="text-sm">Laptop Backpack (42% margin)</li>
            </ul>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full">
                View All (10)
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Product Forecast */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Product Sales Forecast</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">30 Days</Button>
            <Button size="sm" variant="outline">90 Days</Button>
            <Button size="sm">1 Year</Button>
          </div>
        </div>
        <Chart type="Line" data="productForecast" />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Forecasted Sales (Next 30 Days)</p>
            <p className="mt-1 text-lg font-semibold">2,450 units</p>
            <p className="text-sm text-green-600">+12.4% vs. current period</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Forecasted Revenue (Next 30 Days)</p>
            <p className="mt-1 text-lg font-semibold">$85,750.00</p>
            <p className="text-sm text-green-600">+15.8% vs. current period</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Forecasted Profit (Next 30 Days)</p>
            <p className="mt-1 text-lg font-semibold">$34,300.00</p>
            <p className="text-sm text-green-600">+18.2% vs. current period</p>
          </div>
        </div>
      </Card>
    </div>
  );
}