'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

// Mock data for revenue chart
const generateMockData = (days, trend = 'up', volatility = 0.1) => {
  const data = [];
  let baseValue = trend === 'up' ? 1000 : 5000;
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some randomness to the data
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    
    // For upward trend, increase base value slightly each day
    if (trend === 'up') {
      baseValue *= 1.02;
    } else {
      baseValue *= 0.98;
    }
    
    const value = Math.round(baseValue * randomFactor);
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: value,
      orders: Math.round(value / (50 + Math.random() * 20)),
      refunds: Math.round(value * (0.01 + Math.random() * 0.02))
    });
  }
  
  return data;
};

const mockRevenueData = {
  daily: generateMockData(30, 'up', 0.2),
  weekly: generateMockData(12, 'up', 0.15).map(item => ({
    ...item,
    revenue: item.revenue * 7,
    orders: item.orders * 7,
    refunds: item.refunds * 7
  })),
  monthly: generateMockData(12, 'up', 0.1).map(item => ({
    ...item,
    revenue: item.revenue * 30,
    orders: item.orders * 30,
    refunds: item.refunds * 30
  })),
  yearly: generateMockData(5, 'up', 0.05).map(item => ({
    ...item,
    revenue: item.revenue * 365,
    orders: item.orders * 365,
    refunds: item.refunds * 365
  }))
};

const RevenueChart = ({ height = 300 }) => {
  const [timeframe, setTimeframe] = useState('daily');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    currentRevenue: 0,
    previousRevenue: 0,
    percentChange: 0,
    isPositive: true,
    currentOrders: 0,
    previousOrders: 0,
    ordersPercentChange: 0,
    isOrdersPositive: true,
    averageOrderValue: 0,
    previousAverageOrderValue: 0,
    aovPercentChange: 0,
    isAovPositive: true
  });
  
  useEffect(() => {
    // Simulate API call to fetch revenue data
    setLoading(true);
    
    setTimeout(() => {
      const data = mockRevenueData[timeframe];
      setChartData(data);
      
      // Calculate stats
      const currentPeriodData = data.slice(-Math.floor(data.length / 2));
      const previousPeriodData = data.slice(0, Math.floor(data.length / 2));
      
      const currentRevenue = currentPeriodData.reduce((sum, item) => sum + item.revenue, 0);
      const previousRevenue = previousPeriodData.reduce((sum, item) => sum + item.revenue, 0);
      const percentChange = previousRevenue > 0 ? 
        ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
      
      const currentOrders = currentPeriodData.reduce((sum, item) => sum + item.orders, 0);
      const previousOrders = previousPeriodData.reduce((sum, item) => sum + item.orders, 0);
      const ordersPercentChange = previousOrders > 0 ? 
        ((currentOrders - previousOrders) / previousOrders) * 100 : 0;
      
      const averageOrderValue = currentOrders > 0 ? currentRevenue / currentOrders : 0;
      const previousAverageOrderValue = previousOrders > 0 ? previousRevenue / previousOrders : 0;
      const aovPercentChange = previousAverageOrderValue > 0 ? 
        ((averageOrderValue - previousAverageOrderValue) / previousAverageOrderValue) * 100 : 0;
      
      setStats({
        currentRevenue,
        previousRevenue,
        percentChange,
        isPositive: percentChange >= 0,
        currentOrders,
        previousOrders,
        ordersPercentChange,
        isOrdersPositive: ordersPercentChange >= 0,
        averageOrderValue,
        previousAverageOrderValue,
        aovPercentChange,
        isAovPositive: aovPercentChange >= 0
      });
      
      setLoading(false);
    }, 800);
  }, [timeframe, comparisonPeriod]);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatPercentage = (percent) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(percent / 100);
  };
  
  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      default:
        return 'Daily';
    }
  };
  
  const getComparisonLabel = () => {
    switch (comparisonPeriod) {
      case 'previous':
        return `Previous ${getTimeframeLabel()}`;
      case 'yoy':
        return 'Year over Year';
      default:
        return `Previous ${getTimeframeLabel()}`;
    }
  };
  
  // Function to render the SVG chart
  const renderChart = () => {
    if (chartData.length === 0) return null;
    
    const chartWidth = 100;
    const chartHeight = height - 60;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    
    // Find min and max values for scaling
    const maxRevenue = Math.max(...chartData.map(d => d.revenue)) * 1.1;
    const minRevenue = Math.min(...chartData.map(d => d.revenue)) * 0.9;
    
    // Scale functions
    const xScale = (index) => (index / (chartData.length - 1)) * (chartWidth - padding.left - padding.right) + padding.left;
    const yScale = (value) => chartHeight - ((value - minRevenue) / (maxRevenue - minRevenue)) * (chartHeight - padding.top - padding.bottom) - padding.bottom;
    
    // Generate path data for the line
    const pathData = chartData.map((d, i) => {
      const x = xScale(i);
      const y = yScale(d.revenue);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    // Generate area under the line
    const areaData = `${pathData} L ${xScale(chartData.length - 1)} ${chartHeight - padding.bottom} L ${xScale(0)} ${chartHeight - padding.bottom} Z`;
    
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`} preserveAspectRatio="none">
        {/* Y-axis grid lines */}
        {[0.25, 0.5, 0.75].map((ratio, i) => {
          const y = chartHeight - padding.bottom - ratio * (chartHeight - padding.top - padding.bottom);
          return (
            <line 
              key={i}
              x1={padding.left}
              y1={y}
              x2={chartWidth - padding.right}
              y2={y}
              stroke="#e5e7eb"
              strokeDasharray="2,2"
            />
          );
        })}
        
        {/* Area under the line */}
        <path 
          d={areaData}
          fill="url(#gradient)"
          opacity="0.2"
        />
        
        {/* Line chart */}
        <path 
          d={pathData}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {chartData.map((d, i) => (
          <circle 
            key={i}
            cx={xScale(i)}
            cy={yScale(d.revenue)}
            r="0.8"
            fill="#3b82f6"
          />
        ))}
        
        {/* X-axis labels (only show a few) */}
        {chartData.filter((_, i) => i % Math.ceil(chartData.length / 5) === 0).map((d, i) => {
          const originalIndex = i * Math.ceil(chartData.length / 5);
          return (
            <text 
              key={i}
              x={xScale(originalIndex)}
              y={chartHeight - 10}
              fontSize="2"
              textAnchor="middle"
              fill="#6b7280"
            >
              {d.date.split('-')[2]}
            </text>
          );
        })}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Financial performance analysis</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Comparison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous">Previous Period</SelectItem>
                <SelectItem value="yoy">Year over Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Revenue Card */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">
                  {loading ? '...' : formatCurrency(stats.currentRevenue)}
                </h3>
              </div>
              <div className={`flex items-center ${stats.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stats.isPositive ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {loading ? '...' : formatPercentage(Math.abs(stats.percentChange))}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              vs {getComparisonLabel()}: {loading ? '...' : formatCurrency(stats.previousRevenue)}
            </p>
          </div>
          
          {/* Orders Card */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold mt-1">
                  {loading ? '...' : stats.currentOrders.toLocaleString()}
                </h3>
              </div>
              <div className={`flex items-center ${stats.isOrdersPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stats.isOrdersPositive ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {loading ? '...' : formatPercentage(Math.abs(stats.ordersPercentChange))}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              vs {getComparisonLabel()}: {loading ? '...' : stats.previousOrders.toLocaleString()}
            </p>
          </div>
          
          {/* Average Order Value Card */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Avg. Order Value</p>
                <h3 className="text-2xl font-bold mt-1">
                  {loading ? '...' : formatCurrency(stats.averageOrderValue)}
                </h3>
              </div>
              <div className={`flex items-center ${stats.isAovPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stats.isAovPositive ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {loading ? '...' : formatPercentage(Math.abs(stats.aovPercentChange))}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              vs {getComparisonLabel()}: {loading ? '...' : formatCurrency(stats.previousAverageOrderValue)}
            </p>
          </div>
        </div>
        
        <div className="relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
              <p>Loading chart data...</p>
            </div>
          ) : null}
          
          <div className="h-[300px]">
            {renderChart()}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="w-full flex justify-between items-center text-sm text-gray-500">
          <div>
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2 opacity-70"></span>
            Revenue
          </div>
          
          <Button variant="link" size="sm" className="text-blue-600">
            View Detailed Report
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RevenueChart;