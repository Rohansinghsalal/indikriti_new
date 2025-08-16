'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import  Loader  from '@/components/ui/Loader';

export default function FinancialDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [financialData, setFinancialData] = useState(null);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    // Simulate API call to fetch financial data
    const fetchFinancialData = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        const response = await new Promise(resolve => {
          setTimeout(() => {
            resolve({
              revenue: {
                total: 125000,
                previous: 115000,
                change: 8.7
              },
              expenses: {
                total: 78000,
                previous: 82000,
                change: -4.9
              },
              profit: {
                total: 47000,
                previous: 33000,
                change: 42.4
              },
              transactions: {
                total: 1250,
                previous: 1180,
                change: 5.9
              },
              refunds: {
                total: 15,
                previous: 18,
                change: -16.7
              },
              pendingPayments: {
                total: 8,
                amount: 4200
              }
            });
          }, 1000);
        });

        setFinancialData(response);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialData();
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Dashboard</h1>
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === '7d' ? 'default' : 'outline'}
            onClick={() => handleTimeRangeChange('7d')}
          >
            7 Days
          </Button>
          <Button 
            variant={timeRange === '30d' ? 'default' : 'outline'}
            onClick={() => handleTimeRangeChange('30d')}
          >
            30 Days
          </Button>
          <Button 
            variant={timeRange === '90d' ? 'default' : 'outline'}
            onClick={() => handleTimeRangeChange('90d')}
          >
            90 Days
          </Button>
          <Button 
            variant={timeRange === '1y' ? 'default' : 'outline'}
            onClick={() => handleTimeRangeChange('1y')}
          >
            1 Year
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold mt-1">${financialData.revenue.total.toLocaleString()}</p>
            </div>
            <div className={`px-2 py-1 rounded text-sm ${financialData.revenue.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {financialData.revenue.change >= 0 ? '+' : ''}{financialData.revenue.change}%
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">vs. previous period</p>
        </Card>

        {/* Expenses Card */}
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
              <p className="text-2xl font-bold mt-1">${financialData.expenses.total.toLocaleString()}</p>
            </div>
            <div className={`px-2 py-1 rounded text-sm ${financialData.expenses.change <= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {financialData.expenses.change >= 0 ? '+' : ''}{financialData.expenses.change}%
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">vs. previous period</p>
        </Card>

        {/* Profit Card */}
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Net Profit</h3>
              <p className="text-2xl font-bold mt-1">${financialData.profit.total.toLocaleString()}</p>
            </div>
            <div className={`px-2 py-1 rounded text-sm ${financialData.profit.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {financialData.profit.change >= 0 ? '+' : ''}{financialData.profit.change}%
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">vs. previous period</p>
        </Card>

        {/* Transactions Card */}
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
              <p className="text-2xl font-bold mt-1">{financialData.transactions.total.toLocaleString()}</p>
            </div>
            <div className={`px-2 py-1 rounded text-sm ${financialData.transactions.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {financialData.transactions.change >= 0 ? '+' : ''}{financialData.transactions.change}%
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">vs. previous period</p>
        </Card>

        {/* Refunds Card */}
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Refunds</h3>
              <p className="text-2xl font-bold mt-1">{financialData.refunds.total}</p>
            </div>
            <div className={`px-2 py-1 rounded text-sm ${financialData.refunds.change <= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {financialData.refunds.change >= 0 ? '+' : ''}{financialData.refunds.change}%
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">vs. previous period</p>
        </Card>

        {/* Pending Payments Card */}
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
              <p className="text-2xl font-bold mt-1">{financialData.pendingPayments.total}</p>
            </div>
            <div className="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">
              ${financialData.pendingPayments.amount.toLocaleString()}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Total amount: ${financialData.pendingPayments.amount.toLocaleString()}</p>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            View Transactions
          </Button>
          <Button variant="outline" className="justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
            </svg>
            Manage Refunds
          </Button>
          <Button variant="outline" className="justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            Create Discount
          </Button>
        </div>
      </div>
    </div>
  );
}