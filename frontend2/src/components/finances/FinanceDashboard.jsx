import React from 'react';
import { Card } from '../ui';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiCreditCard } from 'react-icons/fi';

export default function FinanceDashboard({ 
  revenue = 0, 
  expenses = 0, 
  profit = 0, 
  transactions = [],
  recentTransactions = []
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'income':
        return <FiTrendingUp className="h-5 w-5 text-green-500" />;
      case 'expense':
        return <FiTrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <FiCreditCard className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiDollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenue)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiTrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(expenses)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiTrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Net Profit</p>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(profit)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiCreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <tr key={transaction.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.type)}
                        <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status || 'completed'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No recent transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Monthly Summary">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Revenue Growth</span>
              <span className="text-sm font-medium text-green-600">+12.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Expense Ratio</span>
              <span className="text-sm font-medium text-gray-900">
                {revenue > 0 ? ((expenses / revenue) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Profit Margin</span>
              <span className={`text-sm font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </Card>

        <Card title="Payment Methods">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Cash</span>
              <span className="text-sm font-medium text-gray-900">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Card</span>
              <span className="text-sm font-medium text-gray-900">35%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">UPI</span>
              <span className="text-sm font-medium text-gray-900">20%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
