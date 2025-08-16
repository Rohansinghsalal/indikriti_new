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

export default function SalesAnalyticsPage() {
  // State for date range filter
  const [dateRange, setDateRange] = useState('last30days');
  const [comparisonPeriod, setComparisonPeriod] = useState('previousPeriod');
  const [groupBy, setGroupBy] = useState('day');
  
  // Mock data for sales metrics
  const salesMetrics = {
    revenue: {
      current: '$45,289.87',
      previous: '$40,256.32',
      change: '+12.5%',
      trend: 'up'
    },
    orders: {
      current: '1,249',
      previous: '1,154',
      change: '+8.2%',
      trend: 'up'
    },
    averageOrderValue: {
      current: '$36.25',
      previous: '$34.88',
      change: '+3.9%',
      trend: 'up'
    },
    conversionRate: {
      current: '3.2%',
      previous: '3.4%',
      change: '-5.9%',
      trend: 'down'
    },
    revenuePerVisitor: {
      current: '$1.16',
      previous: '$1.08',
      change: '+7.4%',
      trend: 'up'
    },
    cartAbandonment: {
      current: '68.3%',
      previous: '70.1%',
      change: '-2.6%',
      trend: 'up' // Trend is up because a decrease in cart abandonment is positive
    }
  };
  
  // Mock data for top products
  const topProducts = [
    { id: 1, name: 'Wireless Headphones', sales: 245, revenue: '$12,250.00', aov: '$50.00', trend: 'up' },
    { id: 2, name: 'Smart Watch', sales: 187, revenue: '$9,350.00', aov: '$50.00', trend: 'up' },
    { id: 3, name: 'Bluetooth Speaker', sales: 156, revenue: '$7,800.00', aov: '$50.00', trend: 'down' },
    { id: 4, name: 'Laptop Backpack', sales: 132, revenue: '$6,600.00', aov: '$50.00', trend: 'up' },
    { id: 5, name: 'USB-C Hub', sales: 98, revenue: '$4,900.00', aov: '$50.00', trend: 'down' }
  ];
  
  // Mock data for sales by region
  const salesByRegion = [
    { id: 1, region: 'North America', sales: 523, revenue: '$18,305.00', percentage: '40.4%' },
    { id: 2, region: 'Europe', sales: 348, revenue: '$12,180.00', percentage: '26.9%' },
    { id: 3, region: 'Asia Pacific', sales: 215, revenue: '$7,525.00', percentage: '16.6%' },
    { id: 4, region: 'Latin America', sales: 98, revenue: '$3,430.00', percentage: '7.6%' },
    { id: 5, region: 'Middle East & Africa', sales: 65, revenue: '$2,275.00', percentage: '5.0%' },
    { id: 6, region: 'Other', sales: 45, revenue: '$1,575.00', percentage: '3.5%' }
  ];
  
  // Mock data for sales by channel
  const salesByChannel = [
    { id: 1, channel: 'Website', sales: 687, revenue: '$24,045.00', percentage: '53.1%' },
    { id: 2, channel: 'Mobile App', sales: 312, revenue: '$10,920.00', percentage: '24.1%' },
    { id: 3, channel: 'Marketplace', sales: 156, revenue: '$5,460.00', percentage: '12.1%' },
    { id: 4, channel: 'In-store', sales: 94, revenue: '$3,290.00', percentage: '7.3%' },
    { id: 5, channel: 'Phone Orders', sales: 45, revenue: '$1,575.00', percentage: '3.5%' }
  ];
  
  // Handle date range change
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };
  
  // Handle comparison period change
  const handleComparisonPeriodChange = (e) => {
    setComparisonPeriod(e.target.value);
  };
  
  // Handle group by change
  const handleGroupByChange = (e) => {
    setGroupBy(e.target.value);
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Sales Analytics</h1>
          <p className="text-gray-500 mt-1">Detailed analysis of your sales performance</p>
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
            <label htmlFor="groupBy" className="block text-sm font-medium text-gray-700 mb-1">
              Group By
            </label>
            <select
              id="groupBy"
              value={groupBy}
              onChange={handleGroupByChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Revenue</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              salesMetrics.revenue.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {salesMetrics.revenue.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{salesMetrics.revenue.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {salesMetrics.revenue.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Orders</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              salesMetrics.orders.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {salesMetrics.orders.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{salesMetrics.orders.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {salesMetrics.orders.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Average Order Value</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              salesMetrics.averageOrderValue.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {salesMetrics.averageOrderValue.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{salesMetrics.averageOrderValue.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {salesMetrics.averageOrderValue.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Conversion Rate</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              salesMetrics.conversionRate.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {salesMetrics.conversionRate.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{salesMetrics.conversionRate.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {salesMetrics.conversionRate.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Revenue Per Visitor</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              salesMetrics.revenuePerVisitor.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {salesMetrics.revenuePerVisitor.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{salesMetrics.revenuePerVisitor.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {salesMetrics.revenuePerVisitor.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Cart Abandonment</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              salesMetrics.cartAbandonment.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {salesMetrics.cartAbandonment.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{salesMetrics.cartAbandonment.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {salesMetrics.cartAbandonment.previous} previous period</p>
          </div>
        </Card>
      </div>
      
      {/* Revenue Trend */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">Revenue</Button>
            <Button size="sm" variant="outline">Orders</Button>
            <Button size="sm" variant="outline">AOV</Button>
          </div>
        </div>
        <Chart type="Line" data="revenueTrend" />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Highest Revenue Day</p>
            <p className="mt-1 text-lg font-semibold">Jun 15, 2023</p>
            <p className="text-sm text-gray-500">$2,845.32</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Lowest Revenue Day</p>
            <p className="mt-1 text-lg font-semibold">Jun 5, 2023</p>
            <p className="text-sm text-gray-500">$1,021.87</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average Daily Revenue</p>
            <p className="mt-1 text-lg font-semibold">$1,509.66</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Revenue Trend</p>
            <p className="mt-1 text-lg font-semibold text-green-600">+8.3%</p>
            <p className="text-sm text-gray-500">Week over week</p>
          </div>
        </div>
      </Card>
      
      {/* Sales Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Sales by Category</h3>
          <Chart type="Pie" data="salesByCategory" height={250} />
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-sm">Electronics</span>
              </div>
              <span className="text-sm font-medium">$18,116.00 (40%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm">Clothing</span>
              </div>
              <span className="text-sm font-medium">$12,681.00 (28%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                <span className="text-sm">Home & Kitchen</span>
              </div>
              <span className="text-sm font-medium">$6,793.00 (15%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                <span className="text-sm">Books</span>
              </div>
              <span className="text-sm font-medium">$3,623.00 (8%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                <span className="text-sm">Others</span>
              </div>
              <span className="text-sm font-medium">$4,077.00 (9%)</span>
            </div>
          </div>
        </Card>
        
        {/* Sales by Channel */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Sales by Channel</h3>
          <Chart type="Bar" data="salesByChannel" height={250} />
          <div className="mt-4 space-y-2">
            {salesByChannel.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                    channel.id === 1 ? 'bg-blue-500' :
                    channel.id === 2 ? 'bg-green-500' :
                    channel.id === 3 ? 'bg-yellow-500' :
                    channel.id === 4 ? 'bg-purple-500' : 'bg-gray-500'
                  }`}></span>
                  <span className="text-sm">{channel.channel}</span>
                </div>
                <span className="text-sm font-medium">{channel.revenue} ({channel.percentage})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* More Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Region */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Sales by Region</h3>
          <Chart type="Map" data="salesByRegion" height={300} />
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesByRegion.map((region) => (
                  <tr key={region.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{region.region}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{region.sales}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{region.revenue}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{region.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        {/* Top Products */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Top Products</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">AOV</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.sales}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.revenue}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.aov}</td>
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
            <Link href="/dashboard/analytics/products" passHref>
              <Button size="sm" variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
        </Card>
      </div>
      
      {/* Sales Funnel */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Sales Funnel</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-lg font-semibold">34,521</div>
            <div className="text-sm text-gray-500 mt-1">Visitors</div>
            <div className="mt-2 text-xs text-gray-400">100%</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-lg font-semibold">12,632</div>
            <div className="text-sm text-gray-500 mt-1">Product Views</div>
            <div className="mt-2 text-xs text-gray-400">36.6%</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-lg font-semibold">3,945</div>
            <div className="text-sm text-gray-500 mt-1">Add to Cart</div>
            <div className="mt-2 text-xs text-gray-400">11.4%</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-lg font-semibold">1,249</div>
            <div className="text-sm text-gray-500 mt-1">Checkout</div>
            <div className="mt-2 text-xs text-gray-400">3.6%</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-lg font-semibold">1,104</div>
            <div className="text-sm text-gray-500 mt-1">Purchased</div>
            <div className="mt-2 text-xs text-gray-400">3.2%</div>
          </div>
        </div>
        <div className="mt-6">
          <Chart type="Funnel" data="salesFunnel" height={200} />
        </div>
      </Card>
      
      {/* Sales Forecast */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Sales Forecast</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">30 Days</Button>
            <Button size="sm" variant="outline">90 Days</Button>
            <Button size="sm">1 Year</Button>
          </div>
        </div>
        <Chart type="Line" data="salesForecast" />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Forecasted Revenue (Next 30 Days)</p>
            <p className="mt-1 text-lg font-semibold">$52,450.00</p>
            <p className="text-sm text-green-600">+15.8% vs. current period</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Forecasted Orders (Next 30 Days)</p>
            <p className="mt-1 text-lg font-semibold">1,425</p>
            <p className="text-sm text-green-600">+14.1% vs. current period</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Forecasted AOV (Next 30 Days)</p>
            <p className="mt-1 text-lg font-semibold">$36.81</p>
            <p className="text-sm text-green-600">+1.5% vs. current period</p>
          </div>
        </div>
      </Card>
    </div>
  );
}