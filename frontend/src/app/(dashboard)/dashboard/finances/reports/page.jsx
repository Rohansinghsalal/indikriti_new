'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import  Loader  from '@/components/ui/Loader';
import { Table } from '@/components/ui/Table';

export default function FinancialReports() {
  const [isLoading, setIsLoading] = useState(true);
  const [reportType, setReportType] = useState('revenue');
  const [timeRange, setTimeRange] = useState('30d');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch report data
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        const response = await new Promise(resolve => {
          setTimeout(() => {
            // Sample data for different report types
            const data = {
              revenue: {
                summary: {
                  total: 125000,
                  average: 4166.67,
                  highest: 7500,
                  lowest: 2100
                },
                details: [
                  { date: '2023-06-01', amount: 4200, transactions: 42 },
                  { date: '2023-06-02', amount: 3800, transactions: 38 },
                  { date: '2023-06-03', amount: 5100, transactions: 51 },
                  { date: '2023-06-04', amount: 4700, transactions: 47 },
                  { date: '2023-06-05', amount: 3900, transactions: 39 },
                  { date: '2023-06-06', amount: 4500, transactions: 45 },
                  { date: '2023-06-07', amount: 5300, transactions: 53 },
                ]
              },
              expenses: {
                summary: {
                  total: 78000,
                  average: 2600,
                  highest: 4500,
                  lowest: 1200
                },
                details: [
                  { date: '2023-06-01', amount: 2200, category: 'Inventory' },
                  { date: '2023-06-02', amount: 1800, category: 'Marketing' },
                  { date: '2023-06-03', amount: 3100, category: 'Salaries' },
                  { date: '2023-06-04', amount: 2700, category: 'Operations' },
                  { date: '2023-06-05', amount: 1900, category: 'Utilities' },
                  { date: '2023-06-06', amount: 2500, category: 'Rent' },
                  { date: '2023-06-07', amount: 3300, category: 'Inventory' },
                ]
              },
              profit: {
                summary: {
                  total: 47000,
                  average: 1566.67,
                  highest: 3000,
                  lowest: 900
                },
                details: [
                  { date: '2023-06-01', revenue: 4200, expenses: 2200, profit: 2000 },
                  { date: '2023-06-02', revenue: 3800, expenses: 1800, profit: 2000 },
                  { date: '2023-06-03', revenue: 5100, expenses: 3100, profit: 2000 },
                  { date: '2023-06-04', revenue: 4700, expenses: 2700, profit: 2000 },
                  { date: '2023-06-05', revenue: 3900, expenses: 1900, profit: 2000 },
                  { date: '2023-06-06', revenue: 4500, expenses: 2500, profit: 2000 },
                  { date: '2023-06-07', revenue: 5300, expenses: 3300, profit: 2000 },
                ]
              },
              tax: {
                summary: {
                  total: 15600,
                  average: 520,
                  highest: 900,
                  lowest: 240
                },
                details: [
                  { date: '2023-06-01', amount: 840, type: 'Sales Tax' },
                  { date: '2023-06-02', amount: 760, type: 'Sales Tax' },
                  { date: '2023-06-03', amount: 1020, type: 'Sales Tax' },
                  { date: '2023-06-04', amount: 940, type: 'Sales Tax' },
                  { date: '2023-06-05', amount: 780, type: 'Sales Tax' },
                  { date: '2023-06-06', amount: 900, type: 'Sales Tax' },
                  { date: '2023-06-07', amount: 1060, type: 'Sales Tax' },
                ]
              }
            };
            
            resolve(data[reportType]);
          }, 1000);
        });

        setReportData(response);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [reportType, timeRange]);

  const handleReportTypeChange = (type) => {
    setReportType(type);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const renderReportTable = () => {
    if (!reportData || !reportData.details) return null;

    switch (reportType) {
      case 'revenue':
        return (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Date</Table.Head>
                <Table.Head>Amount</Table.Head>
                <Table.Head>Transactions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {reportData.details.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.date}</Table.Cell>
                  <Table.Cell>${item.amount.toLocaleString()}</Table.Cell>
                  <Table.Cell>{item.transactions}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        );
      case 'expenses':
        return (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Date</Table.Head>
                <Table.Head>Amount</Table.Head>
                <Table.Head>Category</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {reportData.details.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.date}</Table.Cell>
                  <Table.Cell>${item.amount.toLocaleString()}</Table.Cell>
                  <Table.Cell>{item.category}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        );
      case 'profit':
        return (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Date</Table.Head>
                <Table.Head>Revenue</Table.Head>
                <Table.Head>Expenses</Table.Head>
                <Table.Head>Profit</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {reportData.details.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.date}</Table.Cell>
                  <Table.Cell>${item.revenue.toLocaleString()}</Table.Cell>
                  <Table.Cell>${item.expenses.toLocaleString()}</Table.Cell>
                  <Table.Cell>${item.profit.toLocaleString()}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        );
      case 'tax':
        return (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Date</Table.Head>
                <Table.Head>Amount</Table.Head>
                <Table.Head>Type</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {reportData.details.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.date}</Table.Cell>
                  <Table.Cell>${item.amount.toLocaleString()}</Table.Cell>
                  <Table.Cell>{item.type}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        );
      default:
        return null;
    }
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
        <h1 className="text-2xl font-bold">Financial Reports</h1>
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

      <div className="flex space-x-4 overflow-x-auto pb-2">
        <Button 
          variant={reportType === 'revenue' ? 'default' : 'outline'}
          onClick={() => handleReportTypeChange('revenue')}
        >
          Revenue Report
        </Button>
        <Button 
          variant={reportType === 'expenses' ? 'default' : 'outline'}
          onClick={() => handleReportTypeChange('expenses')}
        >
          Expense Report
        </Button>
        <Button 
          variant={reportType === 'profit' ? 'default' : 'outline'}
          onClick={() => handleReportTypeChange('profit')}
        >
          Profit & Loss
        </Button>
        <Button 
          variant={reportType === 'tax' ? 'default' : 'outline'}
          onClick={() => handleReportTypeChange('tax')}
        >
          Tax Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total {reportType === 'profit' ? 'Profit' : reportType === 'expenses' ? 'Expenses' : reportType === 'tax' ? 'Tax' : 'Revenue'}</h3>
          <p className="text-2xl font-bold mt-1">${reportData.summary.total.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Average Daily</h3>
          <p className="text-2xl font-bold mt-1">${reportData.summary.average.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Highest Day</h3>
          <p className="text-2xl font-bold mt-1">${reportData.summary.highest.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Lowest Day</h3>
          <p className="text-2xl font-bold mt-1">${reportData.summary.lowest.toLocaleString()}</p>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Detailed Report</h2>
        <Card>
          {renderReportTable()}
        </Card>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download CSV
        </Button>
        <Button variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          Download PDF
        </Button>
        <Button variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-5 7a1 1 0 100-2 1 1 0 000 2zm1 2a1 1 0 11-2 0 1 1 0 012 0zm3-2a1 1 0 100-2 1 1 0 000 2zm1 2a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
          Print Report
        </Button>
      </div>
    </div>
  );
}