'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AuditLogsPage() {
  // State for filters
  const [filters, setFilters] = useState({
    dateRange: 'last7days',
    user: '',
    action: '',
    module: '',
    status: '',
    searchQuery: ''
  });
  
  // State for pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 10,
    totalRecords: 245,
    recordsPerPage: 25
  });
  
  // Mock data for audit logs
  const auditLogs = [
    {
      id: 'log-001',
      timestamp: '2023-06-15 14:32:45',
      user: {
        id: 'user-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Administrator'
      },
      action: 'CREATE',
      module: 'Products',
      description: 'Created new product "Wireless Headphones"',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      status: 'SUCCESS',
      details: {
        productId: 'prod-123',
        productName: 'Wireless Headphones',
        category: 'Electronics',
        price: 129.99
      }
    },
    {
      id: 'log-002',
      timestamp: '2023-06-15 13:45:12',
      user: {
        id: 'user-002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'Manager'
      },
      action: 'UPDATE',
      module: 'Orders',
      description: 'Updated order status to "Shipped"',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
      status: 'SUCCESS',
      details: {
        orderId: 'order-456',
        oldStatus: 'Processing',
        newStatus: 'Shipped',
        customer: 'Michael Johnson'
      }
    },
    {
      id: 'log-003',
      timestamp: '2023-06-15 12:18:33',
      user: {
        id: 'user-003',
        name: 'Robert Brown',
        email: 'robert.brown@example.com',
        role: 'Support Agent'
      },
      action: 'READ',
      module: 'Customers',
      description: 'Viewed customer profile',
      ipAddress: '192.168.1.115',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      status: 'SUCCESS',
      details: {
        customerId: 'cust-789',
        customerName: 'Sarah Williams',
        email: 'sarah.williams@example.com'
      }
    },
    {
      id: 'log-004',
      timestamp: '2023-06-15 11:05:27',
      user: {
        id: 'user-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Administrator'
      },
      action: 'DELETE',
      module: 'Products',
      description: 'Deleted product "Outdated Item"',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      status: 'SUCCESS',
      details: {
        productId: 'prod-456',
        productName: 'Outdated Item',
        category: 'Miscellaneous'
      }
    },
    {
      id: 'log-005',
      timestamp: '2023-06-15 10:42:18',
      user: {
        id: 'user-004',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        role: 'Manager'
      },
      action: 'UPDATE',
      module: 'Settings',
      description: 'Updated system settings',
      ipAddress: '192.168.1.120',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      status: 'SUCCESS',
      details: {
        changes: [
          { setting: 'Email Notifications', oldValue: 'Disabled', newValue: 'Enabled' },
          { setting: 'Session Timeout', oldValue: '30 minutes', newValue: '60 minutes' }
        ]
      }
    },
    {
      id: 'log-006',
      timestamp: '2023-06-15 09:30:55',
      user: {
        id: 'user-005',
        name: 'Michael Wilson',
        email: 'michael.wilson@example.com',
        role: 'Support Agent'
      },
      action: 'CREATE',
      module: 'Support',
      description: 'Created new support ticket',
      ipAddress: '192.168.1.125',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
      status: 'SUCCESS',
      details: {
        ticketId: 'ticket-123',
        subject: 'Payment Issue',
        priority: 'High',
        customer: 'David Thompson'
      }
    },
    {
      id: 'log-007',
      timestamp: '2023-06-15 08:15:42',
      user: {
        id: 'user-002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'Manager'
      },
      action: 'LOGIN',
      module: 'Authentication',
      description: 'User logged in',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
      status: 'SUCCESS',
      details: {
        method: '2FA',
        location: 'New York, USA'
      }
    },
    {
      id: 'log-008',
      timestamp: '2023-06-14 23:45:10',
      user: {
        id: 'user-006',
        name: 'Unknown',
        email: 'unknown@example.com',
        role: 'Guest'
      },
      action: 'LOGIN',
      module: 'Authentication',
      description: 'Failed login attempt',
      ipAddress: '203.0.113.42',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      status: 'FAILED',
      details: {
        reason: 'Invalid credentials',
        attempts: 3,
        location: 'Unknown'
      }
    },
    {
      id: 'log-009',
      timestamp: '2023-06-14 22:30:05',
      user: {
        id: 'user-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Administrator'
      },
      action: 'UPDATE',
      module: 'Users',
      description: 'Updated user role',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      status: 'SUCCESS',
      details: {
        targetUser: 'Lisa Johnson',
        oldRole: 'Editor',
        newRole: 'Manager'
      }
    },
    {
      id: 'log-010',
      timestamp: '2023-06-14 21:15:33',
      user: {
        id: 'user-003',
        name: 'Robert Brown',
        email: 'robert.brown@example.com',
        role: 'Support Agent'
      },
      action: 'UPDATE',
      module: 'Support',
      description: 'Updated ticket status',
      ipAddress: '192.168.1.115',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      status: 'SUCCESS',
      details: {
        ticketId: 'ticket-456',
        oldStatus: 'Open',
        newStatus: 'Resolved',
        resolution: 'Issue fixed'
      }
    }
  ];
  
  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: value
    }));
    setPagination(prevPagination => ({
      ...prevPagination,
      currentPage: 1 // Reset to first page on filter change
    }));
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prevPagination => ({
      ...prevPagination,
      currentPage: newPage
    }));
  };
  
  // Handle records per page change
  const handleRecordsPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setPagination(prevPagination => ({
      ...prevPagination,
      recordsPerPage: value,
      currentPage: 1 // Reset to first page when changing records per page
    }));
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get action badge color
  const getActionBadgeColor = (action) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'READ':
        return 'bg-gray-100 text-gray-800';
      case 'LOGIN':
        return 'bg-purple-100 text-purple-800';
      case 'LOGOUT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Generate pagination array
  const getPaginationArray = () => {
    const { currentPage, totalPages } = pagination;
    const paginationArray = [];
    
    // Always show first page
    paginationArray.push(1);
    
    // Calculate start and end of pagination range
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      paginationArray.push('...');
    }
    
    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      paginationArray.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      paginationArray.push('...');
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      paginationArray.push(totalPages);
    }
    
    return paginationArray;
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-gray-500 mt-1">View and monitor system activity and user actions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Logs
          </Button>
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Filters
          </Button>
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
              User
            </label>
            <select
              id="user"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={filters.user}
              onChange={(e) => handleFilterChange('user', e.target.value)}
            >
              <option value="">All Users</option>
              <option value="user-001">John Doe</option>
              <option value="user-002">Jane Smith</option>
              <option value="user-003">Robert Brown</option>
              <option value="user-004">Emily Davis</option>
              <option value="user-005">Michael Wilson</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <select
              id="action"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="READ">Read</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-1">
              Module
            </label>
            <select
              id="module"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={filters.module}
              onChange={(e) => handleFilterChange('module', e.target.value)}
            >
              <option value="">All Modules</option>
              <option value="Products">Products</option>
              <option value="Orders">Orders</option>
              <option value="Customers">Customers</option>
              <option value="Users">Users</option>
              <option value="Settings">Settings</option>
              <option value="Authentication">Authentication</option>
              <option value="Support">Support</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="searchQuery"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search logs..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>
      
      {/* Audit Logs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-0">
                        <div className="text-sm font-medium text-gray-900">
                          {log.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.user.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.module}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {log.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/dashboard/settings/audit-logs/${log.id}`} passHref>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.recordsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * pagination.recordsPerPage, pagination.totalRecords)}
                </span> of{' '}
                <span className="font-medium">{pagination.totalRecords}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {getPaginationArray().map((page, index) => (
                  page === '...' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border ${pagination.currentPage === page ? 'bg-blue-50 border-blue-500 text-blue-600 z-10' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
                    >
                      {page}
                    </button>
                  )
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
          
          <div className="hidden sm:block ml-4">
            <label htmlFor="recordsPerPage" className="sr-only">Records per page</label>
            <select
              id="recordsPerPage"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={pagination.recordsPerPage}
              onChange={handleRecordsPerPageChange}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Logs</h3>
          <p className="text-3xl font-bold text-gray-900">{pagination.totalRecords}</p>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-green-600">94.5%</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed Actions</h3>
          <p className="text-3xl font-bold text-red-600">12</p>
          <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Most Active User</h3>
          <p className="text-xl font-bold text-gray-900">John Doe</p>
          <p className="text-sm text-gray-500 mt-1">145 actions this month</p>
        </Card>
      </div>
    </div>
  );
}