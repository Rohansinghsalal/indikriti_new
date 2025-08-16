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

export default function AnalyticsDashboardPage() {
  // State for date range filter
  const [dateRange, setDateRange] = useState('last30days');
  
  // Mock data for metrics
  const metrics = {
    revenue: {
      value: '$45,289.87',
      change: '+12.5%',
      trend: 'up'
    },
    orders: {
      value: '1,249',
      change: '+8.2%',
      trend: 'up'
    },
    customers: {
      value: '3,842',
      change: '+5.7%',
      trend: 'up'
    },
    averageOrder: {
      value: '$36.25',
      change: '+3.1%',
      trend: 'up'
    },
    conversionRate: {
      value: '3.2%',
      change: '-0.5%',
      trend: 'down'
    },
    returnRate: {
      value: '2.1%',
      change: '-0.3%',
      trend: 'down'
    }
  };
  
  // Mock data for top products
  const topProducts = [
    { id: 1, name: 'Wireless Headphones', sales: 245, revenue: '$12,250.00', trend: 'up' },
    { id: 2, name: 'Smart Watch', sales: 187, revenue: '$9,350.00', trend: 'up' },
    { id: 3, name: 'Bluetooth Speaker', sales: 156, revenue: '$7,800.00', trend: 'down' },
    { id: 4, name: 'Laptop Backpack', sales: 132, revenue: '$6,600.00', trend: 'up' },
    { id: 5, name: 'USB-C Hub', sales: 98, revenue: '$4,900.00', trend: 'down' }
  ];
  
  // Mock data for top acquisition channels
  const topChannels = [
    { id: 1, name: 'Direct', visitors: 12450, conversions: 432, rate: '3.5%' },
    { id: 2, name: 'Organic Search', visitors: 8320, conversions: 287, rate: '3.4%' },
    { id: 3, name: 'Social Media', visitors: 6540, conversions: 198, rate: '3.0%' },
    { id: 4, name: 'Email', visitors: 4210, conversions: 176, rate: '4.2%' },
    { id: 5, name: 'Referral', visitors: 2180, conversions: 84, rate: '3.9%' }
  ];
  
  // Handle date range change
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your business performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={handleDateRangeChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Revenue</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              metrics.revenue.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {metrics.revenue.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{metrics.revenue.value}</p>
            <p className="mt-1 text-sm text-gray-500">Total revenue in selected period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Orders</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              metrics.orders.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {metrics.orders.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{metrics.orders.value}</p>
            <p className="mt-1 text-sm text-gray-500">Total orders in selected period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Customers</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              metrics.customers.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {metrics.customers.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{metrics.customers.value}</p>
            <p className="mt-1 text-sm text-gray-500">Total customers in selected period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Average Order Value</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              metrics.averageOrder.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {metrics.averageOrder.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{metrics.averageOrder.value}</p>
            <p className="mt-1 text-sm text-gray-500">Average order value in selected period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Conversion Rate</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              metrics.conversionRate.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {metrics.conversionRate.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{metrics.conversionRate.value}</p>
            <p className="mt-1 text-sm text-gray-500">Visitors who completed a purchase</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Return Rate</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              metrics.returnRate.trend === 'up' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {metrics.returnRate.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{metrics.returnRate.value}</p>
            <p className="mt-1 text-sm text-gray-500">Orders that resulted in returns</p>
          </div>
        </Card>
      </div>
      
      {/* Revenue Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Revenue Over Time</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">Daily</Button>
            <Button size="sm">Weekly</Button>
            <Button size="sm" variant="outline">Monthly</Button>
          </div>
        </div>
        <Chart type="Line" data="revenue" />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Gross Revenue</p>
            <p className="mt-1 text-lg font-semibold">$48,192.75</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Refunds</p>
            <p className="mt-1 text-lg font-semibold">$2,902.88</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Net Revenue</p>
            <p className="mt-1 text-lg font-semibold">$45,289.87</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tax Collected</p>
            <p className="mt-1 text-lg font-semibold">$3,623.19</p>
          </div>
        </div>
      </Card>
      
      {/* Sales & Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Sales by Category</h3>
            <Link href="/dashboard/analytics/sales" passHref>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </Link>
          </div>
          <Chart type="Pie" data="categories" height={250} />
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-sm">Electronics (42%)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm">Clothing (28%)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              <span className="text-sm">Home & Kitchen (15%)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
              <span className="text-sm">Books (8%)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
              <span className="text-sm">Others (7%)</span>
            </div>
          </div>
        </Card>
        
        {/* Traffic Sources */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Traffic Sources</h3>
            <Link href="/dashboard/analytics/users" passHref>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </Link>
          </div>
          <Chart type="Bar" data="traffic" height={250} />
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-sm">Direct</span>
              </div>
              <span className="text-sm font-medium">36%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm">Organic Search</span>
              </div>
              <span className="text-sm font-medium">24%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                <span className="text-sm">Social Media</span>
              </div>
              <span className="text-sm font-medium">19%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                <span className="text-sm">Email</span>
              </div>
              <span className="text-sm font-medium">12%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                <span className="text-sm">Referral</span>
              </div>
              <span className="text-sm font-medium">9%</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Top Products & Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
            <Link href="/dashboard/analytics/products" passHref>
              <Button size="sm" variant="outline">
                View All
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.sales}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.revenue}</td>
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
        </Card>
        
        {/* Top Acquisition Channels */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Top Acquisition Channels</h3>
            <Link href="/dashboard/analytics/users" passHref>
              <Button size="sm" variant="outline">
                View All
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Visitors</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topChannels.map((channel) => (
                  <tr key={channel.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{channel.name}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{channel.visitors.toLocaleString()}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{channel.conversions.toLocaleString()}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{channel.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/analytics/sales" passHref>
          <Card className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Sales Analytics</h4>
                <p className="mt-1 text-sm text-gray-500">Detailed analysis of sales performance</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link href="/dashboard/analytics/users" passHref>
          <Card className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-md flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">User Analytics</h4>
                <p className="mt-1 text-sm text-gray-500">Customer behavior and demographics</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link href="/dashboard/analytics/products" passHref>
          <Card className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-md flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Product Analytics</h4>
                <p className="mt-1 text-sm text-gray-500">Performance metrics for products</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
      
      {/* Custom Reports */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Custom Reports</h3>
          <Link href="/dashboard/analytics/reports/create" passHref>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Report
            </Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-blue-600">Monthly Sales Summary</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Sales</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">2023-06-01</td>
                <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button size="sm" variant="outline" className="mr-2">Run</Button>
                  <Button size="sm" variant="outline">View</Button>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-blue-600">Customer Retention Analysis</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Customers</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Jane Smith</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">2023-05-15</td>
                <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button size="sm" variant="outline" className="mr-2">Run</Button>
                  <Button size="sm" variant="outline">View</Button>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-blue-600">Product Performance Q2</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Products</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">2023-04-30</td>
                <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button size="sm" variant="outline" className="mr-2">Run</Button>
                  <Button size="sm" variant="outline">View</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-right">
          <Link href="/dashboard/analytics/reports" passHref>
            <Button variant="outline">
              View All Reports
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}