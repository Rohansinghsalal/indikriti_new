'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function CustomReportsPage() {
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState('all');
  const [sortBy, setSortBy] = useState('lastRun');
  
  // Mock data for saved reports
  const savedReports = [
    {
      id: 1,
      name: 'Monthly Sales Overview',
      description: 'Comprehensive overview of sales performance for the current month',
      type: 'sales',
      createdBy: 'John Doe',
      createdAt: '2023-05-15',
      lastRun: '2023-06-10',
      schedule: 'Monthly',
      favorite: true
    },
    {
      id: 2,
      name: 'Customer Acquisition Report',
      description: 'Analysis of new customer acquisition channels and conversion rates',
      type: 'customers',
      createdBy: 'Jane Smith',
      createdAt: '2023-04-22',
      lastRun: '2023-06-08',
      schedule: 'Weekly',
      favorite: true
    },
    {
      id: 3,
      name: 'Product Performance Analysis',
      description: 'Detailed analysis of product performance, sales, and inventory levels',
      type: 'products',
      createdBy: 'John Doe',
      createdAt: '2023-03-10',
      lastRun: '2023-06-05',
      schedule: 'Weekly',
      favorite: false
    },
    {
      id: 4,
      name: 'Marketing Campaign ROI',
      description: 'Return on investment analysis for all marketing campaigns',
      type: 'marketing',
      createdBy: 'Sarah Johnson',
      createdAt: '2023-05-28',
      lastRun: '2023-06-07',
      schedule: 'Weekly',
      favorite: false
    },
    {
      id: 5,
      name: 'Inventory Turnover Report',
      description: 'Analysis of inventory turnover rates and stock efficiency',
      type: 'inventory',
      createdBy: 'Mike Wilson',
      createdAt: '2023-04-15',
      lastRun: '2023-06-01',
      schedule: 'Monthly',
      favorite: false
    },
    {
      id: 6,
      name: 'Customer Retention Analysis',
      description: 'Detailed analysis of customer retention rates and churn factors',
      type: 'customers',
      createdBy: 'Jane Smith',
      createdAt: '2023-02-18',
      lastRun: '2023-05-25',
      schedule: 'Monthly',
      favorite: true
    },
    {
      id: 7,
      name: 'Sales by Region',
      description: 'Breakdown of sales performance by geographic regions',
      type: 'sales',
      createdBy: 'John Doe',
      createdAt: '2023-05-05',
      lastRun: '2023-06-09',
      schedule: 'Weekly',
      favorite: false
    },
    {
      id: 8,
      name: 'Product Category Performance',
      description: 'Comparative analysis of different product categories',
      type: 'products',
      createdBy: 'Mike Wilson',
      createdAt: '2023-04-30',
      lastRun: '2023-06-02',
      schedule: 'Bi-weekly',
      favorite: false
    }
  ];
  
  // Mock data for recent report runs
  const recentReportRuns = [
    {
      id: 1,
      reportName: 'Monthly Sales Overview',
      runBy: 'John Doe',
      runAt: '2023-06-10 09:15 AM',
      status: 'completed',
      duration: '45 seconds'
    },
    {
      id: 2,
      reportName: 'Customer Acquisition Report',
      runBy: 'System',
      runAt: '2023-06-08 08:00 AM',
      status: 'completed',
      duration: '38 seconds'
    },
    {
      id: 3,
      reportName: 'Sales by Region',
      runBy: 'John Doe',
      runAt: '2023-06-09 02:30 PM',
      status: 'completed',
      duration: '52 seconds'
    },
    {
      id: 4,
      reportName: 'Marketing Campaign ROI',
      runBy: 'Sarah Johnson',
      runAt: '2023-06-07 11:45 AM',
      status: 'completed',
      duration: '67 seconds'
    },
    {
      id: 5,
      reportName: 'Product Performance Analysis',
      runBy: 'System',
      runAt: '2023-06-05 08:00 AM',
      status: 'completed',
      duration: '41 seconds'
    }
  ];
  
  // Filter reports based on search query and report type
  const filteredReports = savedReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = reportType === 'all' || report.type === reportType;
    return matchesSearch && matchesType;
  });
  
  // Sort reports based on sort criteria
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'lastRun') {
      return new Date(b.lastRun) - new Date(a.lastRun);
    } else if (sortBy === 'type') {
      return a.type.localeCompare(b.type);
    }
    return 0;
  });
  
  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle report type filter change
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };
  
  // Handle sort by change
  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Toggle favorite status
  const toggleFavorite = (reportId) => {
    // In a real application, this would update the state and make an API call
    console.log(`Toggled favorite status for report ${reportId}`);
  };
  
  // Delete report
  const deleteReport = (reportId) => {
    // In a real application, this would update the state and make an API call
    console.log(`Deleted report ${reportId}`);
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Custom Reports</h1>
          <p className="text-gray-500 mt-1">Create, manage, and schedule custom analytics reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/dashboard/analytics/reports/create" passHref>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Report
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Reports
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by name or description"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              id="reportType"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={reportType}
              onChange={handleReportTypeChange}
            >
              <option value="all">All Types</option>
              <option value="sales">Sales</option>
              <option value="customers">Customers</option>
              <option value="products">Products</option>
              <option value="inventory">Inventory</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={sortBy}
              onChange={handleSortByChange}
            >
              <option value="lastRun">Last Run (Newest First)</option>
              <option value="createdAt">Created Date (Newest First)</option>
              <option value="name">Name (A-Z)</option>
              <option value="type">Type (A-Z)</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Favorite Reports */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Favorite Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedReports.filter(report => report.favorite).map((report) => (
            <Card key={report.id} className="p-6 flex flex-col h-full">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                  </span>
                </div>
                <button
                  onClick={() => toggleFavorite(report.id)}
                  className="text-yellow-400 hover:text-yellow-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2 flex-grow">{report.description}</p>
              <div className="mt-4 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Last run:</span>
                  <span>{report.lastRun}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Schedule:</span>
                  <span>{report.schedule}</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Link href={`/dashboard/analytics/reports/${report.id}`} passHref className="flex-1">
                  <Button variant="outline" className="w-full">
                    View
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1">
                  Run Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* All Reports */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">All Reports</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Run
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleFavorite(report.id)}
                          className={`mr-2 ${report.favorite ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-500`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {report.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {report.description.length > 50 ? `${report.description.substring(0, 50)}...` : report.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.lastRun}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.schedule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/dashboard/analytics/reports/${report.id}`} passHref>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          Run
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => deleteReport(report.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      
      {/* Recent Report Runs */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Report Runs</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Run By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Run At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReportRuns.map((run) => (
                  <tr key={run.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {run.reportName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {run.runBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {run.runAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        run.status === 'completed' ? 'bg-green-100 text-green-800' :
                        run.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {run.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}