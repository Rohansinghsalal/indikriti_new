import React from 'react';
import { Card } from '../components/ui';
import { FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  // Mock data for dashboard stats
  const stats = [
    {
      name: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: FiUsers,
    },
    {
      name: 'Total Products',
      value: '456',
      change: '+8%',
      changeType: 'increase',
      icon: FiShoppingBag,
    },
    {
      name: 'Revenue',
      value: '$12,345',
      change: '+15%',
      changeType: 'increase',
      icon: FiDollarSign,
    },
    {
      name: 'Growth',
      value: '23%',
      change: '+3%',
      changeType: 'increase',
      icon: FiTrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Recent Orders" className="col-span-1">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">Order #{item}001</p>
                  <p className="text-sm text-gray-500">Customer Name</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">$99.99</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top Products" className="col-span-1">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">Product {item}</p>
                  <p className="text-sm text-gray-500">Category</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{50 - item * 5} sold</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
