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

export default function UserAnalyticsPage() {
  // State for date range filter
  const [dateRange, setDateRange] = useState('last30days');
  const [comparisonPeriod, setComparisonPeriod] = useState('previousPeriod');
  const [userSegment, setUserSegment] = useState('all');
  
  // Mock data for user metrics
  const userMetrics = {
    totalUsers: {
      current: '24,587',
      previous: '22,104',
      change: '+11.2%',
      trend: 'up'
    },
    newUsers: {
      current: '1,245',
      previous: '1,087',
      change: '+14.5%',
      trend: 'up'
    },
    activeUsers: {
      current: '8,932',
      previous: '8,456',
      change: '+5.6%',
      trend: 'up'
    },
    retentionRate: {
      current: '68.4%',
      previous: '65.2%',
      change: '+4.9%',
      trend: 'up'
    },
    churnRate: {
      current: '4.2%',
      previous: '4.8%',
      change: '-12.5%',
      trend: 'up' // Trend is up because a decrease in churn rate is positive
    },
    averageSessionDuration: {
      current: '8m 24s',
      previous: '7m 56s',
      change: '+5.9%',
      trend: 'up'
    }
  };
  
  // Mock data for user segments
  const userSegments = [
    { id: 1, name: 'New Users (< 30 days)', count: 1245, percentage: '14.0%', growth: '+14.5%', trend: 'up' },
    { id: 2, name: 'Casual Users (1-5 orders)', count: 3567, percentage: '39.9%', growth: '+3.2%', trend: 'up' },
    { id: 3, name: 'Regular Users (6-20 orders)', count: 2845, percentage: '31.9%', growth: '+7.8%', trend: 'up' },
    { id: 4, name: 'Power Users (> 20 orders)', count: 1275, percentage: '14.3%', growth: '+9.1%', trend: 'up' }
  ];
  
  // Mock data for user acquisition channels
  const acquisitionChannels = [
    { id: 1, channel: 'Organic Search', users: 3245, percentage: '36.3%', costPerUser: '$0.00' },
    { id: 2, channel: 'Direct', users: 2187, percentage: '24.5%', costPerUser: '$0.00' },
    { id: 3, channel: 'Social Media', users: 1456, percentage: '16.3%', costPerUser: '$2.45' },
    { id: 4, channel: 'Paid Search', users: 987, percentage: '11.0%', costPerUser: '$3.78' },
    { id: 5, channel: 'Email', users: 678, percentage: '7.6%', costPerUser: '$0.52' },
    { id: 6, channel: 'Referral', users: 379, percentage: '4.2%', costPerUser: '$1.25' }
  ];
  
  // Mock data for user demographics
  const userDemographics = {
    age: [
      { group: '18-24', percentage: '18%' },
      { group: '25-34', percentage: '32%' },
      { group: '35-44', percentage: '24%' },
      { group: '45-54', percentage: '15%' },
      { group: '55-64', percentage: '8%' },
      { group: '65+', percentage: '3%' }
    ],
    gender: [
      { group: 'Male', percentage: '45%' },
      { group: 'Female', percentage: '53%' },
      { group: 'Other/Not Specified', percentage: '2%' }
    ],
    location: [
      { country: 'United States', percentage: '42%' },
      { country: 'United Kingdom', percentage: '15%' },
      { country: 'Canada', percentage: '8%' },
      { country: 'Australia', percentage: '7%' },
      { country: 'Germany', percentage: '6%' },
      { country: 'France', percentage: '5%' },
      { country: 'Other', percentage: '17%' }
    ],
    device: [
      { type: 'Mobile', percentage: '58%' },
      { type: 'Desktop', percentage: '34%' },
      { type: 'Tablet', percentage: '8%' }
    ]
  };
  
  // Mock data for top user actions
  const topUserActions = [
    { id: 1, action: 'Product View', count: 45678, percentage: '38.2%', avgTimeSpent: '1m 24s' },
    { id: 2, action: 'Add to Cart', count: 12543, percentage: '10.5%', avgTimeSpent: '0m 45s' },
    { id: 3, action: 'Checkout', count: 5432, percentage: '4.5%', avgTimeSpent: '2m 38s' },
    { id: 4, action: 'Search', count: 34521, percentage: '28.9%', avgTimeSpent: '1m 12s' },
    { id: 5, action: 'Category Browse', count: 21345, percentage: '17.9%', avgTimeSpent: '2m 05s' }
  ];
  
  // Handle date range change
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };
  
  // Handle comparison period change
  const handleComparisonPeriodChange = (e) => {
    setComparisonPeriod(e.target.value);
  };
  
  // Handle user segment change
  const handleUserSegmentChange = (e) => {
    setUserSegment(e.target.value);
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">User Analytics</h1>
          <p className="text-gray-500 mt-1">Detailed analysis of your user behavior and demographics</p>
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
            <label htmlFor="userSegment" className="block text-sm font-medium text-gray-700 mb-1">
              User Segment
            </label>
            <select
              id="userSegment"
              value={userSegment}
              onChange={handleUserSegmentChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Users</option>
              <option value="new">New Users</option>
              <option value="returning">Returning Users</option>
              <option value="inactive">Inactive Users</option>
              <option value="highValue">High-Value Users</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              userMetrics.totalUsers.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {userMetrics.totalUsers.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{userMetrics.totalUsers.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {userMetrics.totalUsers.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">New Users</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              userMetrics.newUsers.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {userMetrics.newUsers.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{userMetrics.newUsers.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {userMetrics.newUsers.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              userMetrics.activeUsers.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {userMetrics.activeUsers.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{userMetrics.activeUsers.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {userMetrics.activeUsers.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Retention Rate</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              userMetrics.retentionRate.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {userMetrics.retentionRate.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{userMetrics.retentionRate.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {userMetrics.retentionRate.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Churn Rate</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              userMetrics.churnRate.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {userMetrics.churnRate.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{userMetrics.churnRate.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {userMetrics.churnRate.previous} previous period</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Avg. Session Duration</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              userMetrics.averageSessionDuration.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {userMetrics.averageSessionDuration.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{userMetrics.averageSessionDuration.current}</p>
            <p className="mt-1 text-sm text-gray-500">vs {userMetrics.averageSessionDuration.previous} previous period</p>
          </div>
        </Card>
      </div>
      
      {/* User Growth Trend */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">User Growth Trend</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">Total Users</Button>
            <Button size="sm" variant="outline">New Users</Button>
            <Button size="sm" variant="outline">Active Users</Button>
          </div>
        </div>
        <Chart type="Line" data="userGrowthTrend" />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Highest Growth Day</p>
            <p className="mt-1 text-lg font-semibold">Jun 12, 2023</p>
            <p className="text-sm text-gray-500">+124 users</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Lowest Growth Day</p>
            <p className="mt-1 text-lg font-semibold">Jun 8, 2023</p>
            <p className="text-sm text-gray-500">+18 users</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average Daily Growth</p>
            <p className="mt-1 text-lg font-semibold">+41.5 users</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Growth Trend</p>
            <p className="mt-1 text-lg font-semibold text-green-600">+14.5%</p>
            <p className="text-sm text-gray-500">Month over month</p>
          </div>
        </div>
      </Card>
      
      {/* User Segments and Acquisition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Segments */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">User Segments</h3>
          <Chart type="Pie" data="userSegments" height={250} />
          <div className="mt-4 space-y-2">
            {userSegments.map((segment) => (
              <div key={segment.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                    segment.id === 1 ? 'bg-blue-500' :
                    segment.id === 2 ? 'bg-green-500' :
                    segment.id === 3 ? 'bg-yellow-500' :
                    segment.id === 4 ? 'bg-purple-500' : 'bg-gray-500'
                  }`}></span>
                  <span className="text-sm">{segment.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{segment.count} ({segment.percentage})</span>
                  <span className={`ml-2 text-xs ${
                    segment.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>{segment.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Acquisition Channels */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Acquisition Channels</h3>
          <Chart type="Bar" data="acquisitionChannels" height={250} />
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/User</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {acquisitionChannels.map((channel) => (
                  <tr key={channel.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{channel.channel}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{channel.users}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{channel.percentage}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{channel.costPerUser}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      
      {/* User Demographics */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">User Demographics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Age Distribution */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-4">Age Distribution</h4>
            <div className="space-y-2">
              {userDemographics.age.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.group}</span>
                  <span className="text-sm font-medium">{item.percentage}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Gender Distribution */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-4">Gender Distribution</h4>
            <div className="space-y-2">
              {userDemographics.gender.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.group}</span>
                  <span className="text-sm font-medium">{item.percentage}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Location */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-4">Location</h4>
            <div className="space-y-2">
              {userDemographics.location.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.country}</span>
                  <span className="text-sm font-medium">{item.percentage}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Device Type */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-4">Device Type</h4>
            <div className="space-y-2">
              {userDemographics.device.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.type}</span>
                  <span className="text-sm font-medium">{item.percentage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      
      {/* User Behavior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Retention Cohort */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">User Retention Cohort</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cohort</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Week 1</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Week 2</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Week 3</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Week 4</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Week 8</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">May 2023</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-100">100%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-100">68%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-50">54%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-50">48%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-gray-50">42%</td>
                </tr>
                <tr>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Apr 2023</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-100">100%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-100">65%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-50">52%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-50">45%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-gray-50">38%</td>
                </tr>
                <tr>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mar 2023</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-100">100%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-100">62%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-50">49%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-50">42%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-gray-50">35%</td>
                </tr>
                <tr>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Feb 2023</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-100">100%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-100">60%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-50">47%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-50">40%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-gray-50">32%</td>
                </tr>
                <tr>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Jan 2023</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-100">100%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-100">58%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-50">45%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-green-50">38%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center bg-gray-50">30%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        
        {/* Top User Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Top User Actions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topUserActions.map((action) => (
                  <tr key={action.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{action.action}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{action.count}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{action.percentage}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{action.avgTimeSpent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      
      {/* User Journey */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">User Journey</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-lg font-semibold">24,587</div>
            <div className="text-sm text-gray-500 mt-1">Visitors</div>
            <div className="mt-2 text-xs text-gray-400">100%</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-lg font-semibold">12,294</div>
            <div className="text-sm text-gray-500 mt-1">Account Creation</div>
            <div className="mt-2 text-xs text-gray-400">50.0%</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-lg font-semibold">9,835</div>
            <div className="text-sm text-gray-500 mt-1">Profile Completion</div>
            <div className="mt-2 text-xs text-gray-400">40.0%</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-lg font-semibold">7,376</div>
            <div className="text-sm text-gray-500 mt-1">First Purchase</div>
            <div className="mt-2 text-xs text-gray-400">30.0%</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-lg font-semibold">3,688</div>
            <div className="text-sm text-gray-500 mt-1">Repeat Purchase</div>
            <div className="mt-2 text-xs text-gray-400">15.0%</div>
          </div>
        </div>
        <div className="mt-6">
          <Chart type="Funnel" data="userJourney" height={200} />
        </div>
      </Card>
      
      {/* User Engagement */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">User Engagement</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">Daily</Button>
            <Button size="sm" variant="outline">Weekly</Button>
            <Button size="sm">Monthly</Button>
          </div>
        </div>
        <Chart type="Line" data="userEngagement" />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Average Sessions per User</p>
            <p className="mt-1 text-lg font-semibold">4.2</p>
            <p className="text-sm text-green-600">+8.3% vs. previous period</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average Pages per Session</p>
            <p className="mt-1 text-lg font-semibold">3.8</p>
            <p className="text-sm text-green-600">+5.6% vs. previous period</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average Session Duration</p>
            <p className="mt-1 text-lg font-semibold">8m 24s</p>
            <p className="text-sm text-green-600">+5.9% vs. previous period</p>
          </div>
        </div>
      </Card>
    </div>
  );
}