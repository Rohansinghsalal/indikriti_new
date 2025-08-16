'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function TicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id;
  
  // State for ticket data
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for reply form
  const [replyText, setReplyText] = useState('');
  const [replyAttachments, setReplyAttachments] = useState([]);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  
  // State for ticket actions
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);
  const [isUpdatingAssignee, setIsUpdatingAssignee] = useState(false);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('conversation'); // 'conversation', 'details', 'attachments', 'history'
  
  // Mock data for agents (would come from API)
  const agents = [
    { id: 'AGT-001', name: 'Sarah Johnson' },
    { id: 'AGT-002', name: 'David Wilson' },
    { id: 'AGT-003', name: 'Jennifer Taylor' },
  ];
  
  // Fetch ticket data
  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock ticket data
        const mockTicket = {
          id: ticketId,
          subject: 'Payment failed but money deducted',
          description: 'I made a payment for my order #ORD-10001 using my credit card. The payment was deducted from my account but the order still shows as "Payment Pending". Please help resolve this issue as soon as possible.',
          status: 'open', // 'open', 'in_progress', 'resolved', 'closed'
          priority: 'high', // 'low', 'medium', 'high'
          category: 'payment',
          createdAt: '2023-06-18T09:30:00',
          updatedAt: '2023-06-18T10:15:00',
          customer: {
            id: 'CUST-001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567'
          },
          assignedTo: null,
          order: {
            id: 'ORD-10001',
            date: '2023-06-15',
            total: '$129.99',
            status: 'Payment Pending'
          },
          attachments: [
            { id: 'ATT-001', name: 'payment_screenshot.png', size: '245 KB', type: 'image/png', uploadedAt: '2023-06-18T09:30:00' }
          ],
          conversation: [
            {
              id: 'MSG-001',
              type: 'customer',
              sender: { id: 'CUST-001', name: 'John Doe' },
              content: 'I made a payment for my order #ORD-10001 using my credit card. The payment was deducted from my account but the order still shows as "Payment Pending". Please help resolve this issue as soon as possible.',
              attachments: [
                { id: 'ATT-001', name: 'payment_screenshot.png', size: '245 KB', type: 'image/png' }
              ],
              timestamp: '2023-06-18T09:30:00'
            },
            {
              id: 'MSG-002',
              type: 'system',
              content: 'Ticket created and assigned to support queue.',
              timestamp: '2023-06-18T09:30:00'
            }
          ],
          history: [
            { id: 'HIST-001', action: 'created', user: { id: 'CUST-001', name: 'John Doe' }, timestamp: '2023-06-18T09:30:00' },
            { id: 'HIST-002', action: 'status_changed', from: 'new', to: 'open', user: { id: 'SYSTEM', name: 'System' }, timestamp: '2023-06-18T09:30:00' }
          ]
        };
        
        setTicket(mockTicket);
      } catch (err) {
        setError('Failed to load ticket details. Please try again.');
        console.error('Error fetching ticket:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTicket();
  }, [ticketId]);
  
  // Handle reply submission
  const handleSubmitReply = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      return;
    }
    
    setIsSubmittingReply(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new reply object
      const newReply = {
        id: `MSG-${ticket.conversation.length + 1}`,
        type: 'agent',
        sender: { id: 'AGT-001', name: 'Sarah Johnson' }, // This would be the logged-in agent
        content: replyText,
        attachments: replyAttachments,
        timestamp: new Date().toISOString()
      };
      
      // Create history entry
      const newHistoryEntry = {
        id: `HIST-${ticket.history.length + 1}`,
        action: 'reply_added',
        user: { id: 'AGT-001', name: 'Sarah Johnson' }, // This would be the logged-in agent
        timestamp: new Date().toISOString()
      };
      
      // Update ticket with new reply and history
      setTicket(prev => ({
        ...prev,
        conversation: [...prev.conversation, newReply],
        history: [...prev.history, newHistoryEntry],
        updatedAt: new Date().toISOString()
      }));
      
      // Clear reply form
      setReplyText('');
      setReplyAttachments([]);
    } catch (err) {
      console.error('Error submitting reply:', err);
      alert('Failed to submit reply. Please try again.');
    } finally {
      setIsSubmittingReply(false);
    }
  };
  
  // Handle file uploads for reply
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setReplyAttachments(prev => [...prev, ...files]);
  };
  
  // Remove an attachment from reply
  const handleRemoveAttachment = (index) => {
    setReplyAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle status change
  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create history entry
      const newHistoryEntry = {
        id: `HIST-${ticket.history.length + 1}`,
        action: 'status_changed',
        from: ticket.status,
        to: newStatus,
        user: { id: 'AGT-001', name: 'Sarah Johnson' }, // This would be the logged-in agent
        timestamp: new Date().toISOString()
      };
      
      // Update ticket status and history
      setTicket(prev => ({
        ...prev,
        status: newStatus,
        history: [...prev.history, newHistoryEntry],
        updatedAt: new Date().toISOString()
      }));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  // Handle priority change
  const handlePriorityChange = async (newPriority) => {
    setIsUpdatingPriority(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create history entry
      const newHistoryEntry = {
        id: `HIST-${ticket.history.length + 1}`,
        action: 'priority_changed',
        from: ticket.priority,
        to: newPriority,
        user: { id: 'AGT-001', name: 'Sarah Johnson' }, // This would be the logged-in agent
        timestamp: new Date().toISOString()
      };
      
      // Update ticket priority and history
      setTicket(prev => ({
        ...prev,
        priority: newPriority,
        history: [...prev.history, newHistoryEntry],
        updatedAt: new Date().toISOString()
      }));
    } catch (err) {
      console.error('Error updating priority:', err);
      alert('Failed to update priority. Please try again.');
    } finally {
      setIsUpdatingPriority(false);
    }
  };
  
  // Handle assignee change
  const handleAssigneeChange = async (agentId) => {
    setIsUpdatingAssignee(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find agent details
      const agent = agents.find(a => a.id === agentId);
      
      // Create history entry
      const newHistoryEntry = {
        id: `HIST-${ticket.history.length + 1}`,
        action: 'assignee_changed',
        from: ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned',
        to: agent ? agent.name : 'Unassigned',
        user: { id: 'AGT-001', name: 'Sarah Johnson' }, // This would be the logged-in agent
        timestamp: new Date().toISOString()
      };
      
      // Update ticket assignee and history
      setTicket(prev => ({
        ...prev,
        assignedTo: agentId === 'unassign' ? null : { id: agent.id, name: agent.name },
        history: [...prev.history, newHistoryEntry],
        updatedAt: new Date().toISOString()
      }));
    } catch (err) {
      console.error('Error updating assignee:', err);
      alert('Failed to update assignee. Please try again.');
    } finally {
      setIsUpdatingAssignee(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Ticket</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <div className="flex justify-center space-x-3">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Link href="/dashboard/support/tickets" passHref>
              <Button variant="outline">
                Back to Tickets
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }
  
  // Render ticket not found
  if (!ticket) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
          <p className="text-gray-500 mb-4">The ticket you are looking for does not exist or has been deleted.</p>
          <Link href="/dashboard/support/tickets" passHref>
            <Button>
              Back to Tickets
            </Button>
          </Link>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header with ticket info and actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/support/tickets" passHref>
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{ticket.id}</h1>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
              ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {ticket.status === 'in_progress' ? 'In Progress' : 
               ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </span>
          </div>
          <h2 className="text-xl font-medium mt-1">{ticket.subject}</h2>
          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
            <span>Created {formatDate(ticket.createdAt)}</span>
            <span>•</span>
            <span>Updated {formatDate(ticket.updatedAt)}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-5 7a1 1 0 100-2 1 1 0 000 2zm0 2a1 1 0 100 2 1 1 0 000-2zm6-2a1 1 0 100-2 1 1 0 000 2zm0 2a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            Print
          </Button>
          
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </Button>
          
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
            </svg>
            Merge
          </Button>
        </div>
      </div>
      
      {/* Main content area with sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - takes up 2/3 of the space */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${activeTab === 'conversation' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('conversation')}
              >
                Conversation
              </button>
              <button
                className={`${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button
                className={`${activeTab === 'attachments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('attachments')}
              >
                Attachments
                {ticket.attachments.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100">
                    {ticket.attachments.length}
                  </span>
                )}
              </button>
              <button
                className={`${activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('history')}
              >
                History
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div>
            {/* Conversation Tab */}
            {activeTab === 'conversation' && (
              <div className="space-y-6">
                {/* Conversation Messages */}
                <div className="space-y-6">
                  {ticket.conversation.map((message) => (
                    <Card key={message.id} className={`p-4 ${message.type === 'system' ? 'bg-gray-50' : ''}`}>
                      {message.type === 'system' ? (
                        <div className="text-center text-sm text-gray-500">
                          {message.content}
                          <div className="mt-1 text-xs">{formatDate(message.timestamp)}</div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${message.type === 'customer' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                {message.sender.name.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-gray-900">{message.sender.name}</span>
                                  <span className="ml-2 text-sm text-gray-500">{message.type === 'customer' ? 'Customer' : 'Support Agent'}</span>
                                </div>
                                <span className="text-sm text-gray-500">{formatDate(message.timestamp)}</span>
                              </div>
                              <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                                {message.content}
                              </div>
                              
                              {/* Message Attachments */}
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Attachments</h4>
                                  <ul className="mt-2 divide-y divide-gray-200">
                                    {message.attachments.map((attachment) => (
                                      <li key={attachment.id} className="py-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                                          {attachment.name}
                                        </div>
                                        <span className="ml-2 text-xs text-gray-500">{attachment.size}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
                
                {/* Reply Form */}
                <Card className="p-4">
                  <form onSubmit={handleSubmitReply}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-1">Reply</label>
                        <textarea
                          id="reply"
                          rows="4"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Type your reply here..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        ></textarea>
                      </div>
                      
                      {/* Attachments */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                        <div className="flex items-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload files</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileUpload} />
                          </label>
                          <p className="pl-1 text-sm text-gray-500">or drag and drop</p>
                        </div>
                        
                        {/* Display uploaded files */}
                        {replyAttachments.length > 0 && (
                          <div className="mt-2">
                            <ul className="divide-y divide-gray-200">
                              {replyAttachments.map((file, index) => (
                                <li key={index} className="py-2 flex justify-between items-center">
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    <span className="text-sm text-gray-900">{file.name}</span>
                                  </div>
                                  <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleRemoveAttachment(index)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setReplyText(prev => prev + '\n\nBest regards,\nSupport Team')}
                          >
                            Add Signature
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                          >
                            Save Draft
                          </Button>
                        </div>
                        
                        <Button
                          type="submit"
                          disabled={isSubmittingReply || !replyText.trim()}
                        >
                          {isSubmittingReply ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>
                          ) : 'Send Reply'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Card>
              </div>
            )}
            
            {/* Details Tab */}
            {activeTab === 'details' && (
              <Card className="p-6">
                <div className="space-y-6">
                  {/* Ticket Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Ticket Information</h3>
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Ticket ID</dt>
                          <dd className="mt-1 text-sm text-gray-900">{ticket.id}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                              ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {ticket.status === 'in_progress' ? 'In Progress' : 
                               ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Priority</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                              ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Category</dt>
                          <dd className="mt-1 text-sm text-gray-900">{ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Created</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formatDate(ticket.createdAt)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formatDate(ticket.updatedAt)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {ticket.assignedTo ? ticket.assignedTo.name : (
                              <span className="text-yellow-500">Unassigned</span>
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  
                  {/* Customer Information */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{ticket.customer.name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900">{ticket.customer.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Phone</dt>
                          <dd className="mt-1 text-sm text-gray-900">{ticket.customer.phone}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Customer ID</dt>
                          <dd className="mt-1 text-sm text-gray-900">{ticket.customer.id}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  
                  {/* Order Information */}
                  {ticket.order && (
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Order Information</h3>
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                            <dd className="mt-1 text-sm text-gray-900">{ticket.order.id}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">{ticket.order.date}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Order Total</dt>
                            <dd className="mt-1 text-sm text-gray-900">{ticket.order.total}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Order Status</dt>
                            <dd className="mt-1 text-sm text-gray-900">{ticket.order.status}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
            
            {/* Attachments Tab */}
            {activeTab === 'attachments' && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Attachments</h3>
                
                {ticket.attachments.length === 0 ? (
                  <div className="text-center py-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-gray-500">No attachments found for this ticket.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ticket.attachments.map((attachment) => (
                      <div key={attachment.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {attachment.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {attachment.size} • {formatDate(attachment.uploadedAt)}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <button
                              type="button"
                              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
            
            {/* History Tab */}
            {activeTab === 'history' && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket History</h3>
                
                <div className="flow-root">
                  <ul className="-mb-8">
                    {ticket.history.map((historyItem, index) => (
                      <li key={historyItem.id}>
                        <div className="relative pb-8">
                          {index !== ticket.history.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                historyItem.action === 'created' ? 'bg-green-500' :
                                historyItem.action.includes('status') ? 'bg-blue-500' :
                                historyItem.action.includes('priority') ? 'bg-yellow-500' :
                                historyItem.action.includes('assignee') ? 'bg-purple-500' :
                                historyItem.action.includes('reply') ? 'bg-indigo-500' :
                                'bg-gray-500'
                              }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  {historyItem.action === 'created' ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  ) : historyItem.action.includes('status') ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  ) : historyItem.action.includes('priority') ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  ) : historyItem.action.includes('assignee') ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  ) : historyItem.action.includes('reply') ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  )}
                                </svg>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {historyItem.action === 'created' ? (
                                    <span>Ticket created by <span className="font-medium text-gray-900">{historyItem.user.name}</span></span>
                                  ) : historyItem.action === 'status_changed' ? (
                                    <span>Status changed from <span className="font-medium text-gray-900">{historyItem.from.charAt(0).toUpperCase() + historyItem.from.slice(1)}</span> to <span className="font-medium text-gray-900">{historyItem.to.charAt(0).toUpperCase() + historyItem.to.slice(1)}</span> by <span className="font-medium text-gray-900">{historyItem.user.name}</span></span>
                                  ) : historyItem.action === 'priority_changed' ? (
                                    <span>Priority changed from <span className="font-medium text-gray-900">{historyItem.from.charAt(0).toUpperCase() + historyItem.from.slice(1)}</span> to <span className="font-medium text-gray-900">{historyItem.to.charAt(0).toUpperCase() + historyItem.to.slice(1)}</span> by <span className="font-medium text-gray-900">{historyItem.user.name}</span></span>
                                  ) : historyItem.action === 'assignee_changed' ? (
                                    <span>Assignee changed from <span className="font-medium text-gray-900">{historyItem.from}</span> to <span className="font-medium text-gray-900">{historyItem.to}</span> by <span className="font-medium text-gray-900">{historyItem.user.name}</span></span>
                                  ) : historyItem.action === 'reply_added' ? (
                                    <span>Reply added by <span className="font-medium text-gray-900">{historyItem.user.name}</span></span>
                                  ) : (
                                    <span>{historyItem.action.replace('_', ' ')} by <span className="font-medium text-gray-900">{historyItem.user.name}</span></span>
                                  )}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {formatDate(historyItem.timestamp)}
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
          </div>
        </div>
        
        {/* Sidebar - takes up 1/3 of the space */}
        <div className="space-y-6">
          {/* Ticket Actions */}
          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Actions</h3>
            
            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={ticket.status === 'open' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('open')}
                  disabled={isUpdatingStatus || ticket.status === 'open'}
                >
                  Open
                </Button>
                <Button
                  variant={ticket.status === 'in_progress' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('in_progress')}
                  disabled={isUpdatingStatus || ticket.status === 'in_progress'}
                >
                  In Progress
                </Button>
                <Button
                  variant={ticket.status === 'resolved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('resolved')}
                  disabled={isUpdatingStatus || ticket.status === 'resolved'}
                >
                  Resolved
                </Button>
                <Button
                  variant={ticket.status === 'closed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('closed')}
                  disabled={isUpdatingStatus || ticket.status === 'closed'}
                >
                  Closed
                </Button>
              </div>
            </div>
            
            {/* Priority */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={ticket.priority === 'low' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePriorityChange('low')}
                  disabled={isUpdatingPriority || ticket.priority === 'low'}
                >
                  Low
                </Button>
                <Button
                  variant={ticket.priority === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePriorityChange('medium')}
                  disabled={isUpdatingPriority || ticket.priority === 'medium'}
                >
                  Medium
                </Button>
                <Button
                  variant={ticket.priority === 'high' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePriorityChange('high')}
                  disabled={isUpdatingPriority || ticket.priority === 'high'}
                >
                  High
                </Button>
              </div>
            </div>
            
            {/* Assignee */}
            <div>
              <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select
                id="assignee"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={ticket.assignedTo ? ticket.assignedTo.id : 'unassign'}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                disabled={isUpdatingAssignee}
              >
                <option value="unassign">Unassigned</option>
                <option value="self">Assign to Me</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
            </div>
          </Card>
          
          {/* Customer Information Card */}
          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer</h3>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {ticket.customer.name.charAt(0)}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{ticket.customer.name}</h4>
                <p className="text-sm text-gray-500">{ticket.customer.email}</p>
                {ticket.customer.phone && <p className="text-sm text-gray-500">{ticket.customer.phone}</p>}
                <div className="mt-2">
                  <Link href={`/dashboard/customers/${ticket.customer.id}`} passHref>
                    <Button variant="outline" size="sm">
                      View Customer
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Order Information Card */}
          {ticket.order && (
            <Card className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Related Order</h3>
              <div>
                <p className="text-sm font-medium text-gray-900">{ticket.order.id}</p>
                <p className="text-sm text-gray-500">Date: {ticket.order.date}</p>
                <p className="text-sm text-gray-500">Total: {ticket.order.total}</p>
                <p className="text-sm text-gray-500">Status: {ticket.order.status}</p>
                <div className="mt-2">
                  <Link href={`/dashboard/orders/${ticket.order.id}`} passHref>
                    <Button variant="outline" size="sm">
                      View Order
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}
          
          {/* Similar Tickets */}
          <Card className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Similar Tickets</h3>
            <ul className="divide-y divide-gray-200">
              <li className="py-3">
                <Link href="/dashboard/support/tickets/TKT-1004" className="block hover:bg-gray-50">
                  <div className="text-sm font-medium text-blue-600">TKT-1004</div>
                  <div className="text-sm text-gray-900">Discount code not working</div>
                  <div className="text-xs text-gray-500 mt-1">Emily Davis • 2 days ago</div>
                </Link>
              </li>
              <li className="py-3">
                <Link href="/dashboard/support/tickets/TKT-0987" className="block hover:bg-gray-50">
                  <div className="text-sm font-medium text-blue-600">TKT-0987</div>
                  <div className="text-sm text-gray-900">Payment processed twice</div>
                  <div className="text-xs text-gray-500 mt-1">Alex Johnson • 5 days ago</div>
                </Link>
              </li>
              <li className="py-3">
                <Link href="/dashboard/support/tickets/TKT-0954" className="block hover:bg-gray-50">
                  <div className="text-sm font-medium text-blue-600">TKT-0954</div>
                  <div className="text-sm text-gray-900">Credit card charge but no order confirmation</div>
                  <div className="text-xs text-gray-500 mt-1">Maria Garcia • 1 week ago</div>
                </Link>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}