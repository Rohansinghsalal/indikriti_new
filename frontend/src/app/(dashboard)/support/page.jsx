'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function SupportDashboardPage() {
  // State for time range filter
  const [timeRange, setTimeRange] = useState('7d'); // '24h', '7d', '30d', '90d'
  
  // Mock data for ticket statistics
  const ticketStats = {
    '24h': {
      total: 24,
      open: 8,
      inProgress: 10,
      resolved: 6,
      avgResponseTime: '1.2 hours',
      avgResolutionTime: '5.8 hours',
      satisfaction: 92
    },
    '7d': {
      total: 87,
      open: 15,
      inProgress: 22,
      resolved: 50,
      avgResponseTime: '1.5 hours',
      avgResolutionTime: '8.2 hours',
      satisfaction: 89
    },
    '30d': {
      total: 342,
      open: 28,
      inProgress: 45,
      resolved: 269,
      avgResponseTime: '1.8 hours',
      avgResolutionTime: '9.5 hours',
      satisfaction: 87
    },
    '90d': {
      total: 1024,
      open: 42,
      inProgress: 68,
      resolved: 914,
      avgResponseTime: '2.1 hours',
      avgResolutionTime: '10.3 hours',
      satisfaction: 85
    }
  };
  
  // Mock data for recent tickets
  const recentTickets = [
    {
      id: 'TKT-1001',
      subject: 'Payment failed but money deducted',
      customer: { name: 'John Doe', email: 'john.doe@example.com' },
      priority: 'high',
      status: 'open',
      category: 'Payment',
      createdAt: '2023-06-18T09:30:00',
      assignedTo: null
    },
    {
      id: 'TKT-1002',
      subject: 'How to change my shipping address?',
      customer: { name: 'Jane Smith', email: 'jane.smith@example.com' },
      priority: 'medium',
      status: 'in_progress',
      category: 'Orders',
      createdAt: '2023-06-18T10:15:00',
      assignedTo: { name: 'Sarah Johnson', id: 'AGT-001' }
    },
    {
      id: 'TKT-1003',
      subject: 'Product arrived damaged',
      customer: { name: 'Michael Brown', email: 'michael.brown@example.com' },
      priority: 'high',
      status: 'in_progress',
      category: 'Returns',
      createdAt: '2023-06-17T14:20:00',
      assignedTo: { name: 'David Wilson', id: 'AGT-002' }
    },
    {
      id: 'TKT-1004',
      subject: 'Discount code not working',
      customer: { name: 'Emily Davis', email: 'emily.davis@example.com' },
      priority: 'medium',
      status: 'open',
      category: 'Discounts',
      createdAt: '2023-06-17T16:45:00',
      assignedTo: null
    },
    {
      id: 'TKT-1005',
      subject: 'Request for product information',
      customer: { name: 'Robert Miller', email: 'robert.miller@example.com' },
      priority: 'low',
      status: 'resolved',
      category: 'Product Info',
      createdAt: '2023-06-16T11:30:00',
      resolvedAt: '2023-06-16T13:45:00',
      assignedTo: { name: 'Sarah Johnson', id: 'AGT-001' }
    },
  ];
  
  // Mock data for agent performance
  const agentPerformance = [
    {
      id: 'AGT-001',
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      ticketsAssigned: 28,
      ticketsResolved: 24,
      avgResponseTime: '0.8 hours',
      avgResolutionTime: '6.5 hours',
      customerSatisfaction: 94,
      status: 'online'
    },
    {
      id: 'AGT-002',
      name: 'David Wilson',
      avatar: '/avatars/david.jpg',
      ticketsAssigned: 32,
      ticketsResolved: 27,
      avgResponseTime: '1.2 hours',
      avgResolutionTime: '7.8 hours',
      customerSatisfaction: 88,
      status: 'online'
    },
    {
      id: 'AGT-003',
      name: 'Jennifer Taylor',
      avatar: '/avatars/jennifer.jpg',
      ticketsAssigned: 24,
      ticketsResolved: 21,
      avgResponseTime: '1.0 hours',
      avgResolutionTime: '7.2 hours',
      customerSatisfaction: 91,
      status: 'offline'
    },
  ];
  
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
  
  // Get current stats based on selected time range
  const currentStats = ticketStats[timeRange];
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Support Dashboard</h1>
        
        <div className="flex space-x-2">
          <Link href="/dashboard/support/tickets/create" passHref>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Ticket
            </Button>
          </Link>
          
          <Link href="/dashboard/support/tickets" passHref>
            <Button variant="outline">
              View All Tickets
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Time Range Filter */}
      <div className="flex space-x-2">
        <Button 
          variant={timeRange === '24h' ? 'default' : 'outline'} 
          onClick={() => setTimeRange('24h')}
          size="sm"
        >
          Last 24 Hours
        </Button>
        <Button 
          variant={timeRange === '7d' ? 'default' : 'outline'} 
          onClick={() => setTimeRange('7d')}
          size="sm"
        >
          Last 7 Days
        </Button>
        <Button 
          variant={timeRange === '30d' ? 'default' : 'outline'} 
          onClick={() => setTimeRange('30d')}
          size="sm"
        >
          Last 30 Days
        </Button>
        <Button 
          variant={timeRange === '90d' ? 'default' : 'outline'} 
          onClick={() => setTimeRange('90d')}
          size="sm"
        >
          Last 90 Days
        </Button>
      </div>
      
      {/* Ticket Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tickets</p>
              <p className="text-3xl font-bold mt-1">{currentStats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <div>
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-1"></span>
              <span className="text-xs text-gray-500">Open: {currentStats.open}</span>
            </div>
            <div>
              <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-1"></span>
              <span className="text-xs text-gray-500">In Progress: {currentStats.inProgress}</span>
            </div>
            <div>
              <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-1"></span>
              <span className="text-xs text-gray-500">Resolved: {currentStats.resolved}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Response Time</p>
              <p className="text-3xl font-bold mt-1">{currentStats.avgResponseTime}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">Time until first response to customer</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Resolution Time</p>
              <p className="text-3xl font-bold mt-1">{currentStats.avgResolutionTime}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">Time until ticket is resolved</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Customer Satisfaction</p>
              <p className="text-3xl font-bold mt-1">{currentStats.satisfaction}%</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${currentStats.satisfaction}%` }}></div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Recent Tickets and Agent Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Recent Tickets</h2>
                <Link href="/dashboard/support/tickets" passHref>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-blue-600">
                              <Link href={`/dashboard/support/tickets/${ticket.id}`}>
                                {ticket.id}
                              </Link>
                            </div>
                            <div className="text-sm text-gray-900">{ticket.subject}</div>
                            <div className="text-xs text-gray-500">{ticket.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{ticket.customer.name}</div>
                        <div className="text-sm text-gray-500">{ticket.customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
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
                        {formatDate(ticket.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        {/* Agent Performance */}
        <div>
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Agent Performance</h2>
            </div>
            <div className="p-6 space-y-6">
              {agentPerformance.map((agent) => (
                <div key={agent.id} className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      {agent.name.charAt(0)}
                    </div>
                    <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                      agent.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {agent.name}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="mr-2">{agent.ticketsResolved} resolved</span>
                      <span className="mr-2">•</span>
                      <span>{agent.customerSatisfaction}% satisfaction</span>
                    </div>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    <span className="flex w-8 h-8 rounded-full items-center justify-center bg-blue-100 text-blue-800">

                      {agent.ticketsAssigned}
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <Link href="/dashboard/support/agents" passHref>
                  <Button variant="outline" className="w-full">
                    View All Agents
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Category Distribution and Ticket Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Ticket Categories</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Payment Issues</span>
                <span className="text-sm text-gray-500">32%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Order Status</span>
                <span className="text-sm text-gray-500">24%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Returns & Refunds</span>
                <span className="text-sm text-gray-500">18%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Product Information</span>
                <span className="text-sm text-gray-500">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Account Issues</span>
                <span className="text-sm text-gray-500">11%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '11%' }}></div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Ticket Trends */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Ticket Trends</h2>
          <div className="h-64 flex items-end space-x-2">
            {/* This is a simplified chart representation */}
            <div className="flex-1 flex flex-col justify-end">
              <div className="bg-blue-500 rounded-t w-full" style={{ height: '40%' }}></div>
              <span className="text-xs text-center mt-1">Mon</span>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <div className="bg-blue-500 rounded-t w-full" style={{ height: '65%' }}></div>
              <span className="text-xs text-center mt-1">Tue</span>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <div className="bg-blue-500 rounded-t w-full" style={{ height: '50%' }}></div>
              <span className="text-xs text-center mt-1">Wed</span>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <div className="bg-blue-500 rounded-t w-full" style={{ height: '70%' }}></div>
              <span className="text-xs text-center mt-1">Thu</span>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <div className="bg-blue-500 rounded-t w-full" style={{ height: '85%' }}></div>
              <span className="text-xs text-center mt-1">Fri</span>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <div className="bg-blue-500 rounded-t w-full" style={{ height: '45%' }}></div>
              <span className="text-xs text-center mt-1">Sat</span>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <div className="bg-blue-500 rounded-t w-full" style={{ height: '30%' }}></div>
              <span className="text-xs text-center mt-1">Sun</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Highest volume on Friday with 42 tickets</p>
            <p>Lowest volume on Sunday with 14 tickets</p>
          </div>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/support/tickets/create" passHref>
          <Card className="p-6 hover:bg-blue-50 transition-colors cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-md mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Create Ticket</h3>
                <p className="text-sm text-gray-500">Create a new support ticket</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link href="/dashboard/support/faq" passHref>
          <Card className="p-6 hover:bg-blue-50 transition-colors cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-md mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Manage FAQs</h3>
                <p className="text-sm text-gray-500">Update frequently asked questions</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link href="/dashboard/support/contacts" passHref>
          <Card className="p-6 hover:bg-blue-50 transition-colors cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-md mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Manage Contacts</h3>
                <p className="text-sm text-gray-500">View and update support contacts</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}