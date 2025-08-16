'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function LogDetailsPage({ params }) {
  const { id } = params;
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for a single audit log
  const mockLog = {
    id: 'log-001',
    timestamp: '2023-06-15 14:32:45',
    user: {
      id: 'user-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Administrator',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
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
      price: 129.99,
      sku: 'WH-BT-001',
      stock: 50,
      attributes: [
        { name: 'Color', value: 'Black' },
        { name: 'Connectivity', value: 'Bluetooth 5.0' },
        { name: 'Battery Life', value: '20 hours' }
      ]
    },
    metadata: {
      sessionId: 'sess_12345abcde',
      requestId: 'req_67890fghij',
      processingTime: '245ms',
      apiVersion: 'v2.3',
      source: 'web-dashboard'
    },
    location: {
      country: 'United States',
      region: 'California',
      city: 'San Francisco',
      coordinates: {
        latitude: '37.7749',
        longitude: '-122.4194'
      }
    },
    relatedLogs: [
      {
        id: 'log-002',
        timestamp: '2023-06-15 14:35:12',
        action: 'UPDATE',
        module: 'Inventory',
        description: 'Updated inventory for product "Wireless Headphones"',
        status: 'SUCCESS'
      },
      {
        id: 'log-003',
        timestamp: '2023-06-15 14:36:30',
        action: 'CREATE',
        module: 'Notifications',
        description: 'Sent notification about new product to subscribers',
        status: 'SUCCESS'
      }
    ],
    timeline: [
      {
        time: '2023-06-15 14:32:40',
        event: 'Request received',
        details: 'User initiated product creation'
      },
      {
        time: '2023-06-15 14:32:42',
        event: 'Validation passed',
        details: 'All required fields validated successfully'
      },
      {
        time: '2023-06-15 14:32:44',
        event: 'Database operation',
        details: 'Product record created in database'
      },
      {
        time: '2023-06-15 14:32:45',
        event: 'Operation completed',
        details: 'Product creation completed successfully'
      }
    ]
  };
  
  // Simulate fetching log data
  useEffect(() => {
    const fetchLogData = async () => {
      try {
        // In a real application, this would be an API call
        // const response = await fetch(`/api/audit-logs/${id}`);
        // const data = await response.json();
        
        // Simulate API delay
        setTimeout(() => {
          setLog(mockLog);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load log details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchLogData();
  }, [id]);
  
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
  
  // Format JSON for display
  const formatJSON = (obj) => {
    return JSON.stringify(obj, null, 2);
  };
  
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading log details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border border-red-200">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-medium text-red-800">{error}</h2>
          </div>
          <div className="mt-4 flex justify-end">
            <Link href="/dashboard/settings/audit-logs" passHref>
              <Button>
                Back to Audit Logs
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }
  
  if (!log) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-yellow-50 border border-yellow-200">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-yellow-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-medium text-yellow-800">Log not found</h2>
          </div>
          <p className="mt-2 text-yellow-700">The requested audit log could not be found. It may have been deleted or you may not have permission to view it.</p>
          <div className="mt-4 flex justify-end">
            <Link href="/dashboard/settings/audit-logs" passHref>
              <Button>
                Back to Audit Logs
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center">
            <Link href="/dashboard/settings/audit-logs" passHref>
              <button className="mr-2 text-gray-500 hover:text-gray-700">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </Link>
            <h1 className="text-2xl font-bold">Audit Log Details</h1>
          </div>
          <p className="text-gray-500 mt-1">Viewing detailed information for log #{log.id}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Log
          </Button>
          <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Log
          </Button>
        </div>
      </div>
      
      {/* Log Summary Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Log Summary</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Log ID:</span>
                <span className="ml-2 text-sm text-gray-900">{log.id}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Timestamp:</span>
                <span className="ml-2 text-sm text-gray-900">{log.timestamp}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Action:</span>
                <span className="ml-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionBadgeColor(log.action)}`}>
                    {log.action}
                  </span>
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Module:</span>
                <span className="ml-2 text-sm text-gray-900">{log.module}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className="ml-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(log.status)}`}>
                    {log.status}
                  </span>
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Description:</span>
                <span className="ml-2 text-sm text-gray-900">{log.description}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">User Information</h2>
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 h-10 w-10">
                <img className="h-10 w-10 rounded-full" src={log.user.avatar} alt={log.user.name} />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{log.user.name}</div>
                <div className="text-sm text-gray-500">{log.user.email}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">User ID:</span>
                <span className="ml-2 text-sm text-gray-900">{log.user.id}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Role:</span>
                <span className="ml-2 text-sm text-gray-900">{log.user.role}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">IP Address:</span>
                <span className="ml-2 text-sm text-gray-900">{log.ipAddress}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Location:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {log.location ? `${log.location.city}, ${log.location.region}, ${log.location.country}` : 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">User Agent:</span>
                <span className="ml-2 text-sm text-gray-900 break-all">{log.userAgent}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'timeline' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'related' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('related')}
          >
            Related Logs
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'technical' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('technical')}
          >
            Technical Info
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Event Overview</h2>
            <p className="text-gray-700 mb-6">
              This log entry records a <strong>{log.action}</strong> action performed by <strong>{log.user.name}</strong> in the <strong>{log.module}</strong> module. 
              The action was <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(log.status)}`}>{log.status}</span>.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{log.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Action Details</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {formatJSON(log.details)}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Context Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Date & Time:</span>
                    <span className="ml-2 text-sm text-gray-900">{log.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">IP Address:</span>
                    <span className="ml-2 text-sm text-gray-900">{log.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Location:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {log.location ? `${log.location.city}, ${log.location.region}, ${log.location.country}` : 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Browser/Device:</span>
                    <span className="ml-2 text-sm text-gray-900">{log.userAgent}</span>
                  </div>
                  {log.metadata && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Session ID:</span>
                      <span className="ml-2 text-sm text-gray-900">{log.metadata.sessionId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Details Tab */}
        {activeTab === 'details' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Detailed Information</h2>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Action Details</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {formatJSON(log.details)}
              </pre>
            </div>
            
            {log.details && log.details.attributes && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Attributes</h3>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {log.details.attributes.map((attr, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {attr.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {attr.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">User Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={log.user.avatar} alt={log.user.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{log.user.name}</div>
                      <div className="text-sm text-gray-500">{log.user.email}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">User ID:</span>
                      <span className="ml-2 text-sm text-gray-900">{log.user.id}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Role:</span>
                      <span className="ml-2 text-sm text-gray-900">{log.user.role}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Location Information</h3>
                {log.location ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Country:</span>
                        <span className="ml-2 text-sm text-gray-900">{log.location.country}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Region:</span>
                        <span className="ml-2 text-sm text-gray-900">{log.location.region}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">City:</span>
                        <span className="ml-2 text-sm text-gray-900">{log.location.city}</span>
                      </div>
                      {log.location.coordinates && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Coordinates:</span>
                          <span className="ml-2 text-sm text-gray-900">
                            {log.location.coordinates.latitude}, {log.location.coordinates.longitude}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">No location information available</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
        
        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Event Timeline</h2>
            
            <div className="flow-root">
              <ul className="-mb-8">
                {log.timeline.map((item, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== log.timeline.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {item.event} <span className="font-medium text-gray-900">{item.details}</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {item.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        )}
        
        {/* Related Logs Tab */}
        {activeTab === 'related' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Related Logs</h2>
            
            {log.relatedLogs && log.relatedLogs.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Log ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
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
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {log.relatedLogs.map((relatedLog) => (
                      <tr key={relatedLog.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {relatedLog.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {relatedLog.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionBadgeColor(relatedLog.action)}`}>
                            {relatedLog.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {relatedLog.module}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {relatedLog.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(relatedLog.status)}`}>
                            {relatedLog.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/dashboard/settings/audit-logs/${relatedLog.id}`} passHref>
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
            ) : (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">No related logs found for this event.</p>
              </div>
            )}
          </Card>
        )}
        
        {/* Technical Info Tab */}
        {activeTab === 'technical' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Technical Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Request Details</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="space-y-2">
                    {log.metadata && (
                      <>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Session ID:</span>
                          <span className="ml-2 text-sm text-gray-900">{log.metadata.sessionId}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Request ID:</span>
                          <span className="ml-2 text-sm text-gray-900">{log.metadata.requestId}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Processing Time:</span>
                          <span className="ml-2 text-sm text-gray-900">{log.metadata.processingTime}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">API Version:</span>
                          <span className="ml-2 text-sm text-gray-900">{log.metadata.apiVersion}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Source:</span>
                          <span className="ml-2 text-sm text-gray-900">{log.metadata.source}</span>
                        </div>
                      </>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-500">IP Address:</span>
                      <span className="ml-2 text-sm text-gray-900">{log.ipAddress}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">User Agent:</span>
                      <span className="ml-2 text-sm text-gray-900 break-all">{log.userAgent}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Raw Log Data</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-96">
                    {formatJSON(log)}
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}