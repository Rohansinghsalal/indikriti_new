'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import Link from 'next/link';

export default function UserActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: '', end: '' });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for user activities
  const mockActivities = [
    {
      id: 'act-001',
      user: {
        id: 'user-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      action: 'LOGIN',
      module: 'Authentication',
      description: 'User logged in successfully',
      timestamp: '2023-06-15 08:30:45',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      location: {
        country: 'United States',
        region: 'California',
        city: 'San Francisco'
      },
      status: 'SUCCESS',
      details: {
        sessionId: 'sess_12345abcde',
        authMethod: 'password',
        deviceType: 'desktop'
      }
    },
    {
      id: 'act-002',
      user: {
        id: 'user-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      action: 'VIEW',
      module: 'Products',
      description: 'Viewed product "Wireless Headphones"',
      timestamp: '2023-06-15 09:15:22',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      location: {
        country: 'United States',
        region: 'California',
        city: 'San Francisco'
      },
      status: 'SUCCESS',
      details: {
        productId: 'prod-123',
        productName: 'Wireless Headphones',
        category: 'Electronics'
      }
    },
    {
      id: 'act-003',
      user: {
        id: 'user-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      action: 'CREATE',
      module: 'Orders',
      description: 'Created new order #ORD-12345',
      timestamp: '2023-06-15 10:22:18',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      location: {
        country: 'United States',
        region: 'California',
        city: 'San Francisco'
      },
      status: 'SUCCESS',
      details: {
        orderId: 'ORD-12345',
        amount: 129.99,
        items: 2,
        paymentMethod: 'Credit Card'
      }
    },
    {
      id: 'act-004',
      user: {
        id: 'user-002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      action: 'UPDATE',
      module: 'Users',
      description: 'Updated user profile',
      timestamp: '2023-06-15 11:05:33',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      location: {
        country: 'United States',
        region: 'New York',
        city: 'New York'
      },
      status: 'SUCCESS',
      details: {
        userId: 'user-002',
        fields: ['name', 'phone', 'address']
      }
    },
    {
      id: 'act-005',
      user: {
        id: 'user-003',
        name: 'Robert Johnson',
        email: 'robert.johnson@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
      },
      action: 'DELETE',
      module: 'Products',
      description: 'Deleted product "Outdated Item"',
      timestamp: '2023-06-15 12:45:10',
      ipAddress: '192.168.1.115',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
      location: {
        country: 'United States',
        region: 'Texas',
        city: 'Austin'
      },
      status: 'SUCCESS',
      details: {
        productId: 'prod-456',
        productName: 'Outdated Item',
        category: 'Miscellaneous'
      }
    },
    {
      id: 'act-006',
      user: {
        id: 'user-004',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
      },
      action: 'EXPORT',
      module: 'Reports',
      description: 'Exported sales report',
      timestamp: '2023-06-15 14:10:25',
      ipAddress: '192.168.1.120',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      location: {
        country: 'United States',
        region: 'Illinois',
        city: 'Chicago'
      },
      status: 'SUCCESS',
      details: {
        reportType: 'Sales',
        format: 'CSV',
        dateRange: 'Last 30 days',
        fileSize: '2.4 MB'
      }
    },
    {
      id: 'act-007',
      user: {
        id: 'user-005',
        name: 'Michael Wilson',
        email: 'michael.wilson@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
      },
      action: 'PERMISSION_CHANGE',
      module: 'Users',
      description: 'Changed permissions for user "Jane Smith"',
      timestamp: '2023-06-15 15:30:42',
      ipAddress: '192.168.1.125',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      location: {
        country: 'United States',
        region: 'Washington',
        city: 'Seattle'
      },
      status: 'SUCCESS',
      details: {
        targetUserId: 'user-002',
        targetUserName: 'Jane Smith',
        oldRole: 'Editor',
        newRole: 'Admin',
        permissions: ['create', 'read', 'update', 'delete', 'export']
      }
    },
    {
      id: 'act-008',
      user: {
        id: 'user-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      action: 'FAILED_LOGIN',
      module: 'Authentication',
      description: 'Failed login attempt',
      timestamp: '2023-06-15 16:45:18',
      ipAddress: '203.0.113.42',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      location: {
        country: 'Russia',
        region: 'Moscow',
        city: 'Moscow'
      },
      status: 'FAILED',
      details: {
        reason: 'Invalid password',
        attemptCount: 3
      }
    },
    {
      id: 'act-009',
      user: {
        id: 'user-006',
        name: 'Sarah Brown',
        email: 'sarah.brown@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
      },
      action: 'SETTINGS_CHANGE',
      module: 'System',
      description: 'Updated system settings',
      timestamp: '2023-06-15 17:20:55',
      ipAddress: '192.168.1.130',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
      location: {
        country: 'United States',
        region: 'Florida',
        city: 'Miami'
      },
      status: 'SUCCESS',
      details: {
        settings: ['email_notifications', 'security_level', 'session_timeout'],
        changes: {
          email_notifications: { from: false, to: true },
          security_level: { from: 'medium', to: 'high' },
          session_timeout: { from: '30 minutes', to: '15 minutes' }
        }
      }
    },
    {
      id: 'act-010',
      user: {
        id: 'user-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      action: 'LOGOUT',
      module: 'Authentication',
      description: 'User logged out',
      timestamp: '2023-06-15 18:05:30',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      location: {
        country: 'United States',
        region: 'California',
        city: 'San Francisco'
      },
      status: 'SUCCESS',
      details: {
        sessionId: 'sess_12345abcde',
        sessionDuration: '9h 34m 45s'
      }
    },
    {
      id: 'act-011',
      user: {
        id: 'user-007',
        name: 'David Miller',
        email: 'david.miller@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
      },
      action: 'API_ACCESS',
      module: 'API',
      description: 'API key generated',
      timestamp: '2023-06-16 09:15:22',
      ipAddress: '192.168.1.135',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      location: {
        country: 'United States',
        region: 'Massachusetts',
        city: 'Boston'
      },
      status: 'SUCCESS',
      details: {
        apiKeyId: 'key_789xyz',
        permissions: ['read', 'write'],
        expiresAt: '2024-06-16 09:15:22'
      }
    },
    {
      id: 'act-012',
      user: {
        id: 'user-008',
        name: 'Lisa Taylor',
        email: 'lisa.taylor@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/8.jpg'
      },
      action: 'IMPORT',
      module: 'Products',
      description: 'Imported products from CSV',
      timestamp: '2023-06-16 10:45:33',
      ipAddress: '192.168.1.140',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
      location: {
        country: 'United States',
        region: 'Georgia',
        city: 'Atlanta'
      },
      status: 'SUCCESS',
      details: {
        fileName: 'products_import_june2023.csv',
        fileSize: '1.2 MB',
        recordsProcessed: 150,
        recordsImported: 148,
        recordsFailed: 2
      }
    }
  ];
  
  // Simulate fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, this would be an API call
        // const response = await fetch('/api/user-activities');
        // const data = await response.json();
        
        // Simulate API delay
        setTimeout(() => {
          setActivities(mockActivities);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Failed to fetch user activity data:', err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter activities based on search and filters
  const filteredActivities = activities.filter(activity => {
    // Tab filter
    if (activeTab === 'login' && !['LOGIN', 'LOGOUT', 'FAILED_LOGIN'].includes(activity.action)) {
      return false;
    }
    if (activeTab === 'data' && !['CREATE', 'UPDATE', 'DELETE', 'IMPORT', 'EXPORT'].includes(activity.action)) {
      return false;
    }
    if (activeTab === 'security' && !['PERMISSION_CHANGE', 'SETTINGS_CHANGE', 'API_ACCESS'].includes(activity.action)) {
      return false;
    }
    
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // User filter
    const matchesUser = userFilter === '' || 
      activity.user.name.toLowerCase().includes(userFilter.toLowerCase()) ||
      activity.user.email.toLowerCase().includes(userFilter.toLowerCase());
    
    // Action filter
    const matchesAction = actionFilter === 'all' || activity.action === actionFilter;
    
    // Module filter
    const matchesModule = moduleFilter === 'all' || activity.module === moduleFilter;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRangeFilter.start && dateRangeFilter.end) {
      const activityDate = new Date(activity.timestamp);
      const startDate = new Date(dateRangeFilter.start);
      const endDate = new Date(dateRangeFilter.end);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      
      matchesDateRange = activityDate >= startDate && activityDate <= endDate;
    }
    
    return matchesSearch && matchesUser && matchesAction && matchesModule && matchesDateRange;
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredActivities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  
  // Get unique modules for filter
  const uniqueModules = [...new Set(activities.map(activity => activity.module))].sort();
  
  // Get unique actions for filter
  const uniqueActions = [...new Set(activities.map(activity => activity.action))].sort();
  
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
      case 'LOGIN':
        return 'bg-green-100 text-green-800';
      case 'LOGOUT':
        return 'bg-blue-100 text-blue-800';
      case 'FAILED_LOGIN':
        return 'bg-red-100 text-red-800';
      case 'CREATE':
        return 'bg-purple-100 text-purple-800';
      case 'UPDATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'EXPORT':
        return 'bg-indigo-100 text-indigo-800';
      case 'IMPORT':
        return 'bg-pink-100 text-pink-800';
      case 'VIEW':
        return 'bg-gray-100 text-gray-800';
      case 'PERMISSION_CHANGE':
        return 'bg-orange-100 text-orange-800';
      case 'SETTINGS_CHANGE':
        return 'bg-teal-100 text-teal-800';
      case 'API_ACCESS':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dateString;
  };
  
  // Format JSON for display
  const formatJSON = (obj) => {
    return JSON.stringify(obj, null, 2);
  };
  
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user activity data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">User Activity Logs</h1>
          <p className="text-gray-500 mt-1">Monitor and track user actions across the system</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Advanced Filters
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-800">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Activities</h2>
              <p className="text-2xl font-semibold text-gray-900">{activities.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-800">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Login Activities</h2>
              <p className="text-2xl font-semibold text-gray-900">
                {activities.filter(a => a.action === 'LOGIN').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-800">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Failed Logins</h2>
              <p className="text-2xl font-semibold text-gray-900">
                {activities.filter(a => a.action === 'FAILED_LOGIN').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-800">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Delete Operations</h2>
              <p className="text-2xl font-semibold text-gray-900">
                {activities.filter(a => a.action === 'DELETE').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex">
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="login">Login Activities</TabsTrigger>
          <TabsTrigger value="data">Data Operations</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="user-filter">User</Label>
                <Input
                  id="user-filter"
                  placeholder="Filter by user..."
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="action-filter">Action</Label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger id="action-filter">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {uniqueActions.map(action => (
                      <SelectItem key={action} value={action}>{action}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="module-filter">Module</Label>
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger id="module-filter">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    {uniqueModules.map(module => (
                      <SelectItem key={module} value={module}>{module}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="date-start">Start Date</Label>
                  <Input
                    id="date-start"
                    type="date"
                    value={dateRangeFilter.start}
                    onChange={(e) => setDateRangeFilter({...dateRangeFilter, start: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="date-end">End Date</Label>
                  <Input
                    id="date-end"
                    type="date"
                    value={dateRangeFilter.end}
                    onChange={(e) => setDateRangeFilter({...dateRangeFilter, end: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Activities Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={activity.user.avatar} alt={activity.user.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{activity.user.name}</div>
                              <div className="text-sm text-gray-500">{activity.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionBadgeColor(activity.action)}`}>
                            {activity.action}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{activity.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {activity.module}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(activity.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedActivity(activity);
                              setShowDetailsDialog(true);
                            }}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No activities found matching the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredActivities.length > 0 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">
                        {indexOfLastItem > filteredActivities.length ? filteredActivities.length : indexOfLastItem}
                      </span> of <span className="font-medium">{filteredActivities.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <Button
                        variant="outline"
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </Button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? 'default' : 'outline'}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNumber
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                      
                      <Button
                        variant="outline"
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="login" className="space-y-4">
          {/* Same content structure as "all" tab but with login-specific activities */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="login-search">Search</Label>
                <Input
                  id="login-search"
                  placeholder="Search login activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="login-user-filter">User</Label>
                <Input
                  id="login-user-filter"
                  placeholder="Filter by user..."
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="login-date-start">Start Date</Label>
                  <Input
                    id="login-date-start"
                    type="date"
                    value={dateRangeFilter.start}
                    onChange={(e) => setDateRangeFilter({...dateRangeFilter, start: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="login-date-end">End Date</Label>
                  <Input
                    id="login-date-end"
                    type="date"
                    value={dateRangeFilter.end}
                    onChange={(e) => setDateRangeFilter({...dateRangeFilter, end: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="login-status-filter">Status</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="login-status-filter">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
          
          {/* Activities Table - Same structure as "all" tab */}
          <Card className="overflow-hidden">
            {/* Table content similar to "all" tab but filtered for login activities */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table header and body similar to "all" tab */}
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={activity.user.avatar} alt={activity.user.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{activity.user.name}</div>
                              <div className="text-sm text-gray-500">{activity.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionBadgeColor(activity.action)}`}>
                            {activity.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(activity.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {activity.ipAddress}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {activity.location ? `${activity.location.city}, ${activity.location.country}` : 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedActivity(activity);
                              setShowDetailsDialog(true);
                            }}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No login activities found matching the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination - Same as "all" tab */}
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          {/* Similar structure to other tabs but for data operations */}
          <Card className="p-4">
            {/* Filters for data operations */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Similar filter structure */}
            </div>
          </Card>
          
          <Card className="overflow-hidden">
            {/* Table for data operations */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table header and body */}
              </table>
            </div>
            
            {/* Pagination */}
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          {/* Similar structure to other tabs but for security events */}
          <Card className="p-4">
            {/* Filters for security events */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Similar filter structure */}
            </div>
          </Card>
          
          <Card className="overflow-hidden">
            {/* Table for security events */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table header and body */}
              </table>
            </div>
            
            {/* Pagination */}
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Activity Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-6 py-4">
              {/* Activity Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Activity Summary</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Activity ID:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedActivity.id}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Timestamp:</span>
                      <span className="ml-2 text-sm text-gray-900">{formatDate(selectedActivity.timestamp)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Action:</span>
                      <span className="ml-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionBadgeColor(selectedActivity.action)}`}>
                          {selectedActivity.action}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Module:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedActivity.module}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className="ml-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(selectedActivity.status)}`}>
                          {selectedActivity.status}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Description:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedActivity.description}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">User Information</h3>
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={selectedActivity.user.avatar} alt={selectedActivity.user.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{selectedActivity.user.name}</div>
                      <div className="text-sm text-gray-500">{selectedActivity.user.email}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">User ID:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedActivity.user.id}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">IP Address:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedActivity.ipAddress}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Location:</span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedActivity.location ? `${selectedActivity.location.city}, ${selectedActivity.location.region}, ${selectedActivity.location.country}` : 'Unknown'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">User Agent:</span>
                      <span className="ml-2 text-sm text-gray-900 break-all">{selectedActivity.userAgent}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Activity Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Activity Details</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {formatJSON(selectedActivity.details)}
                  </pre>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-between">
                <div>
                  <Button variant="outline" size="sm">
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export
                  </Button>
                </div>
                <div>
                  {selectedActivity.action === 'FAILED_LOGIN' && (
                    <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 mr-2">
                      <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Block IP
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}