'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, ShoppingBag, DollarSign, TrendingUp,
  ShoppingCart, AlertCircle, CheckCircle, Clock,
  Info, AlertTriangle
} from 'lucide-react';
// Ensure your api import provides analytics, or import analytics separately if needed
import api from '@/utils/api';
// If api.analytics does not exist, you may need to import analytics directly:
import { useAuthContext } from '@/context/AuthContext';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  totalOrders: number;
  userGrowth: number;
  productGrowth: number;
  revenueGrowth: number;
  orderGrowth: number;
  pos?: {
    total_sales: number;
    today_sales: number;
    total_transactions: number;
    today_transactions: number;
  };
  sales?: {
    total: number;
    today: number;
    yesterday: number;
    this_week: number;
    this_month: number;
    last_month: number;
    change: {
      daily: number;
      monthly: number;
    };
  };
  orders?: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
  inventory?: {
    low_stock: number;
    out_of_stock: number;
  };
  customers?: {
    total: number;
    new_today: number;
  };
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface Alert {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'error';
  createdAt: string;
}

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    userGrowth: 0,
    productGrowth: 0,
    revenueGrowth: 0,
    orderGrowth: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all dashboard data in parallel
      const [
        statsResponse,
        activityResponse,
        notificationsResponse,
        chartsResponse
      ] = await Promise.all([
        api.analytics.getDashboardStats(timeRange),
        api.analytics.getRecentActivity(),
        api.analytics.getNotifications(),
        api.analytics.getDashboardCharts(timeRange)
      ]);

      // Update stats
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      } else {
        console.error('Failed to fetch dashboard stats');
      }

      // Update recent orders
      if (activityResponse.success && activityResponse.data) {
        setRecentOrders(activityResponse.data);
      } else {
        console.error('Failed to fetch recent activity');
      }

      // Update alerts
      if (notificationsResponse.success && notificationsResponse.data) {
        setAlerts(notificationsResponse.data);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
      
      // Set empty states on error
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalRevenue: 0,
        totalOrders: 0,
        userGrowth: 0,
        productGrowth: 0,
        revenueGrowth: 0,
        orderGrowth: 0
      });
      setRecentOrders([]);
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }

    // Start polling for real-time updates
    const pollingInterval = setInterval(async () => {
      try {
        const [activityResponse, notificationsResponse] = await Promise.all([
          api.analytics.getRecentActivity(),
          api.analytics.getNotifications()
        ]);

        if (activityResponse.success && activityResponse.data) {
          setRecentOrders(activityResponse.data);
        }

        if (notificationsResponse.success && notificationsResponse.data) {
          setAlerts(notificationsResponse.data);
        }
      } catch (error) {
        console.error('Error polling dashboard updates:', error);
      }
    }, 30000); // Poll every 30 seconds

    // Cleanup polling on component unmount
    return () => clearInterval(pollingInterval);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertCircle;
      case 'success':
        return CheckCircle;
      case 'info':
        return Clock;
      case 'error':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'info':
        return 'bg-blue-100 text-blue-600';
      case 'error':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Dashboard stat cards
  const statCards = [
    {
      name: 'Total Users',
      value: formatNumber(stats.totalUsers),
      icon: Users,
      change: formatGrowth(stats.userGrowth),
      color: 'bg-blue-500',
      positive: stats.userGrowth >= 0
    },
    {
      name: 'Total Products',
      value: formatNumber(stats.totalProducts),
      icon: ShoppingBag,
      change: formatGrowth(stats.productGrowth),
      color: 'bg-green-500',
      positive: stats.productGrowth >= 0
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      change: formatGrowth(stats.revenueGrowth),
      color: 'bg-purple-500',
      positive: stats.revenueGrowth >= 0
    },
    {
      name: 'Total Orders',
      value: formatNumber(stats.totalOrders),
      icon: ShoppingCart,
      change: formatGrowth(stats.orderGrowth),
      color: 'bg-yellow-500',
      positive: stats.orderGrowth >= 0
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div>
          <select 
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="month">This month</option>
            <option value="lastMonth">Last month</option>
            <option value="year">This year</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]"></div>
            <h2 className="text-lg font-semibold text-gray-700">Loading dashboard data...</h2>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <div key={stat.name} className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`rounded-md p-3 ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                        <p className={`ml-2 flex items-baseline text-sm font-semibold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.positive ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                          )}
                          <span className="ml-1">{stat.change}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* POS Analytics Section */}
          {stats.pos && (
            <div className="rounded-lg bg-white shadow">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Point of Sale Analytics</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(stats.pos.total_sales)}
                    </div>
                    <div className="text-sm text-gray-500">Total POS Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(stats.pos.today_sales)}
                    </div>
                    <div className="text-sm text-gray-500">Today's Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatNumber(stats.pos.total_transactions)}
                    </div>
                    <div className="text-sm text-gray-500">Total Transactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatNumber(stats.pos.today_transactions)}
                    </div>
                    <div className="text-sm text-gray-500">Today's Transactions</div>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <Link
                    href="/dashboard/pos"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Open POS System
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders & Alerts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Orders */}
            <div className="col-span-2 rounded-lg bg-white shadow">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
              </div>
              {isLoading && recentOrders.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-gray-500">No recent orders found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">#{order.orderNumber}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">{order.customerName}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">{formatCurrency(order.total)}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.status)}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="border-t px-6 py-4">
                <Link href="/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View all orders
                </Link>
              </div>
            </div>

            {/* Alerts */}
            <div className="rounded-lg bg-white shadow">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Recent Alerts</h2>
              </div>
              {isLoading && alerts.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                </div>
              ) : alerts.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-gray-500">No alerts found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {alerts.map((alert) => {
                    const AlertIcon = getAlertIcon(alert.type);
                    return (
                      <div key={alert.id} className="px-6 py-4">
                        <div className="flex items-start">
                          <div className={`rounded-full p-2 ${getAlertColor(alert.type)}`}>
                            <AlertIcon className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-800">{alert.message}</p>
                            <p className="mt-1 text-xs text-gray-500">{formatDate(alert.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="border-t px-6 py-4">
                <Link href="/system/alerts" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View all alerts
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}