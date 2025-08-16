'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function SupportTicketsPage() {
  // State for filters
  const [filters, setFilters] = useState({
    status: 'all', // 'all', 'open', 'in_progress', 'resolved', 'closed'
    priority: 'all', // 'all', 'low', 'medium', 'high'
    category: 'all', // 'all', 'payment', 'order', 'return', 'product', 'account', 'other'
    assignee: 'all', // 'all', 'unassigned', 'assigned_to_me', specific agent IDs
    dateRange: 'all', // 'all', 'today', 'yesterday', 'last_7_days', 'last_30_days', 'custom'
    customDateStart: '',
    customDateEnd: '',
    searchQuery: ''
  });
  
  // State for pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 87 // This would come from API in real implementation
  });
  
  // State for sorting
  const [sorting, setSorting] = useState({
    field: 'created_at',
    direction: 'desc' // 'asc' or 'desc'
  });
  
  // Mock data for tickets
  const tickets = [
    {
      id: 'TKT-1001',
      subject: 'Payment failed but money deducted',
      customer: { name: 'John Doe', email: 'john.doe@example.com' },
      priority: 'high',
      status: 'open',
      category: 'payment',
      createdAt: '2023-06-18T09:30:00',
      updatedAt: '2023-06-18T10:15:00',
      assignedTo: null,
      lastRepliedBy: { type: 'customer', name: 'John Doe' },
      lastRepliedAt: '2023-06-18T10:15:00'
    },
    {
      id: 'TKT-1002',
      subject: 'How to change my shipping address?',
      customer: { name: 'Jane Smith', email: 'jane.smith@example.com' },
      priority: 'medium',
      status: 'in_progress',
      category: 'order',
      createdAt: '2023-06-18T10:15:00',
      updatedAt: '2023-06-18T11:30:00',
      assignedTo: { name: 'Sarah Johnson', id: 'AGT-001' },
      lastRepliedBy: { type: 'agent', name: 'Sarah Johnson' },
      lastRepliedAt: '2023-06-18T11:30:00'
    },
    {
      id: 'TKT-1003',
      subject: 'Product arrived damaged',
      customer: { name: 'Michael Brown', email: 'michael.brown@example.com' },
      priority: 'high',
      status: 'in_progress',
      category: 'return',
      createdAt: '2023-06-17T14:20:00',
      updatedAt: '2023-06-18T09:45:00',
      assignedTo: { name: 'David Wilson', id: 'AGT-002' },
      lastRepliedBy: { type: 'agent', name: 'David Wilson' },
      lastRepliedAt: '2023-06-18T09:45:00'
    },
    {
      id: 'TKT-1004',
      subject: 'Discount code not working',
      customer: { name: 'Emily Davis', email: 'emily.davis@example.com' },
      priority: 'medium',
      status: 'open',
      category: 'payment',
      createdAt: '2023-06-17T16:45:00',
      updatedAt: '2023-06-17T16:45:00',
      assignedTo: null,
      lastRepliedBy: { type: 'customer', name: 'Emily Davis' },
      lastRepliedAt: '2023-06-17T16:45:00'
    },
    {
      id: 'TKT-1005',
      subject: 'Request for product information',
      customer: { name: 'Robert Miller', email: 'robert.miller@example.com' },
      priority: 'low',
      status: 'resolved',
      category: 'product',
      createdAt: '2023-06-16T11:30:00',
      updatedAt: '2023-06-16T13:45:00',
      assignedTo: { name: 'Sarah Johnson', id: 'AGT-001' },
      lastRepliedBy: { type: 'agent', name: 'Sarah Johnson' },
      lastRepliedAt: '2023-06-16T13:45:00'
    },
    {
      id: 'TKT-1006',
      subject: 'Cannot login to my account',
      customer: { name: 'Thomas Wilson', email: 'thomas.wilson@example.com' },
      priority: 'high',
      status: 'in_progress',
      category: 'account',
      createdAt: '2023-06-16T09:15:00',
      updatedAt: '2023-06-17T10:30:00',
      assignedTo: { name: 'Jennifer Taylor', id: 'AGT-003' },
      lastRepliedBy: { type: 'customer', name: 'Thomas Wilson' },
      lastRepliedAt: '2023-06-17T10:30:00'
    },
    {
      id: 'TKT-1007',
      subject: 'Need to cancel my order',
      customer: { name: 'Lisa Johnson', email: 'lisa.johnson@example.com' },
      priority: 'medium',
      status: 'resolved',
      category: 'order',
      createdAt: '2023-06-15T14:20:00',
      updatedAt: '2023-06-16T11:05:00',
      assignedTo: { name: 'David Wilson', id: 'AGT-002' },
      lastRepliedBy: { type: 'agent', name: 'David Wilson' },
      lastRepliedAt: '2023-06-16T11:05:00'
    },
    {
      id: 'TKT-1008',
      subject: 'Wrong item received in my order',
      customer: { name: 'Daniel Brown', email: 'daniel.brown@example.com' },
      priority: 'high',
      status: 'open',
      category: 'order',
      createdAt: '2023-06-15T11:30:00',
      updatedAt: '2023-06-15T11:30:00',
      assignedTo: null,
      lastRepliedBy: { type: 'customer', name: 'Daniel Brown' },
      lastRepliedAt: '2023-06-15T11:30:00'
    },
    {
      id: 'TKT-1009',
      subject: 'Question about product warranty',
      customer: { name: 'Olivia Martinez', email: 'olivia.martinez@example.com' },
      priority: 'low',
      status: 'closed',
      category: 'product',
      createdAt: '2023-06-14T16:45:00',
      updatedAt: '2023-06-15T09:20:00',
      assignedTo: { name: 'Sarah Johnson', id: 'AGT-001' },
      lastRepliedBy: { type: 'agent', name: 'Sarah Johnson' },
      lastRepliedAt: '2023-06-15T09:20:00'
    },
    {
      id: 'TKT-1010',
      subject: 'Shipping delay for my order',
      customer: { name: 'William Taylor', email: 'william.taylor@example.com' },
      priority: 'medium',
      status: 'resolved',
      category: 'order',
      createdAt: '2023-06-14T10:15:00',
      updatedAt: '2023-06-14T14:30:00',
      assignedTo: { name: 'Jennifer Taylor', id: 'AGT-003' },
      lastRepliedBy: { type: 'agent', name: 'Jennifer Taylor' },
      lastRepliedAt: '2023-06-14T14:30:00'
    },
  ];
  
  // Mock data for agents
  const agents = [
    { id: 'AGT-001', name: 'Sarah Johnson' },
    { id: 'AGT-002', name: 'David Wilson' },
    { id: 'AGT-003', name: 'Jennifer Taylor' },
  ];
  
  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };
  
  // Handle sorting changes
  const handleSortChange = (field) => {
    setSorting(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Handle pagination changes
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };
  
  // Handle items per page changes
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1 // Reset to first page when changing items per page
    }));
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return `Today at ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Within a week
      return `${diffDays} days ago`;
    } else {
      // More than a week
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end page numbers
      let startPage = Math.max(2, pagination.currentPage - 1);
      let endPage = Math.min(totalPages - 1, pagination.currentPage + 1);
      
      // Adjust if we're at the start or end
      if (pagination.currentPage <= 2) {
        endPage = 3;
      } else if (pagination.currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        
        <div className="flex space-x-2">
          <Link href="/dashboard/support/tickets/create" passHref>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Ticket
            </Button>
          </Link>
          
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export
          </Button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search tickets..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          {/* Priority Filter */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              id="priority"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="payment">Payment</option>
              <option value="order">Order</option>
              <option value="return">Return</option>
              <option value="product">Product</option>
              <option value="account">Account</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* Assignee Filter */}
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
            <select
              id="assignee"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.assignee}
              onChange={(e) => handleFilterChange('assignee', e.target.value)}
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              <option value="assigned_to_me">Assigned to Me</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>
          
          {/* Date Range Filter */}
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              id="dateRange"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          {/* Custom Date Range */}
          {filters.dateRange === 'custom' && (
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="customDateStart" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  id="customDateStart"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.customDateStart}
                  onChange={(e) => handleFilterChange('customDateStart', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="customDateEnd" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  id="customDateEnd"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.customDateEnd}
                  onChange={(e) => handleFilterChange('customDateEnd', e.target.value)}
                />
              </div>
            </div>
          )}
          
          {/* Filter Actions */}
          <div className="lg:col-span-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setFilters({
              status: 'all',
              priority: 'all',
              category: 'all',
              assignee: 'all',
              dateRange: 'all',
              customDateStart: '',
              customDateEnd: '',
              searchQuery: ''
            })}>
              Reset Filters
            </Button>
            <Button>
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Tickets Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('id')}>
                  <div className="flex items-center">
                    ID
                    {sorting.field === 'id' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-4 w-4 ${sorting.direction === 'asc' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('subject')}>
                  <div className="flex items-center">
                    Subject
                    {sorting.field === 'subject' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-4 w-4 ${sorting.direction === 'asc' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('customer.name')}>
                  <div className="flex items-center">
                    Customer
                    {sorting.field === 'customer.name' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-4 w-4 ${sorting.direction === 'asc' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('status')}>
                  <div className="flex items-center">
                    Status
                    {sorting.field === 'status' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-4 w-4 ${sorting.direction === 'asc' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('priority')}>
                  <div className="flex items-center">
                    Priority
                    {sorting.field === 'priority' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-4 w-4 ${sorting.direction === 'asc' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('category')}>
                  <div className="flex items-center">
                    Category
                    {sorting.field === 'category' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-4 w-4 ${sorting.direction === 'asc' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('assignedTo.name')}>
                  <div className="flex items-center">
                    Assignee
                    {sorting.field === 'assignedTo.name' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-4 w-4 ${sorting.direction === 'asc' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('lastRepliedAt')}>
                  <div className="flex items-center">
                    Last Reply
                    {sorting.field === 'lastRepliedAt' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-4 w-4 ${sorting.direction === 'asc' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('createdAt')}>
                  <div className="flex items-center">
                    Created
                    {sorting.field === 'createdAt' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-4 w-4 ${sorting.direction === 'asc' ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <Link href={`/dashboard/support/tickets/${ticket.id}`}>
                      {ticket.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Link href={`/dashboard/support/tickets/${ticket.id}`} className="hover:underline">
                      {ticket.subject}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ticket.customer.name}</div>
                    <div className="text-sm text-gray-500">{ticket.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status === 'in_progress' ? 'In Progress' : 
                       ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.assignedTo ? ticket.assignedTo.name : (
                      <span className="text-yellow-500">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        ticket.lastRepliedBy.type === 'customer' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></span>
                      {formatDate(ticket.lastRepliedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/dashboard/support/tickets/${ticket.id}`} passHref>
                        <Button variant="ghost" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
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
              disabled={pagination.currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span> of <span className="font-medium">{pagination.totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </Button>
                
                {getPageNumbers().map((pageNumber, index) => (
                  pageNumber === '...' ? (
                    <span key={`ellipsis-${index}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={`page-${pageNumber}`}
                      variant={pagination.currentPage === pageNumber ? 'default' : 'outline'}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.currentPage === pageNumber
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  )
                ))}
                
                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Button>
              </nav>
            </div>
          </div>
          
          {/* Items per page selector */}
          <div className="hidden sm:block ml-4">
            <label htmlFor="itemsPerPage" className="sr-only">Items Per Page</label>
            <select
              id="itemsPerPage"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={pagination.itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}