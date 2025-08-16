'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FAQDetailsPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  // State for FAQ data
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // State for status change
  const [changingStatus, setChangingStatus] = useState(false);
  
  // Mock data for FAQs
  const mockFAQs = [
    {
      id: 'FAQ-001',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. You will receive an email with instructions to reset your password.',
      category: 'Account',
      status: 'published',
      isPublic: true,
      sortOrder: 1,
      createdAt: '2023-05-15T10:30:00',
      updatedAt: '2023-06-10T14:45:00',
      views: 1250,
      helpful: 120,
      notHelpful: 15,
      history: [
        { action: 'created', date: '2023-05-15T10:30:00', user: 'John Doe' },
        { action: 'updated', date: '2023-06-01T09:15:00', user: 'Jane Smith' },
        { action: 'published', date: '2023-06-10T14:45:00', user: 'John Doe' }
      ]
    },
    {
      id: 'FAQ-002',
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and navigating to the "Orders" section. Click on the order you want to track and you will see the current status and tracking information.',
      category: 'Orders',
      status: 'published',
      isPublic: true,
      sortOrder: 2,
      createdAt: '2023-05-18T09:15:00',
      updatedAt: '2023-06-12T11:30:00',
      views: 2300,
      helpful: 210,
      notHelpful: 25,
      history: [
        { action: 'created', date: '2023-05-18T09:15:00', user: 'Jane Smith' },
        { action: 'updated', date: '2023-06-05T13:20:00', user: 'John Doe' },
        { action: 'published', date: '2023-06-12T11:30:00', user: 'Jane Smith' }
      ]
    },
    {
      id: 'FAQ-003',
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For more information, please visit our Payment Methods page.',
      category: 'Payment',
      status: 'published',
      isPublic: true,
      sortOrder: 3,
      createdAt: '2023-05-20T14:20:00',
      updatedAt: '2023-06-15T16:45:00',
      views: 1800,
      helpful: 180,
      notHelpful: 20,
      history: [
        { action: 'created', date: '2023-05-20T14:20:00', user: 'John Doe' },
        { action: 'updated', date: '2023-06-08T10:35:00', user: 'Jane Smith' },
        { action: 'published', date: '2023-06-15T16:45:00', user: 'John Doe' }
      ]
    },
    {
      id: 'FAQ-008',
      question: 'How do I change my shipping address?',
      answer: 'You can update your shipping address in your account settings. If you need to change the address for an order that has already been placed but not yet shipped, please contact our customer support team immediately.',
      category: 'Shipping',
      status: 'draft',
      isPublic: false,
      sortOrder: 8,
      createdAt: '2023-06-05T15:20:00',
      updatedAt: '2023-06-28T17:45:00',
      views: 0,
      helpful: 0,
      notHelpful: 0,
      history: [
        { action: 'created', date: '2023-06-05T15:20:00', user: 'Jane Smith' },
        { action: 'updated', date: '2023-06-28T17:45:00', user: 'John Doe' }
      ]
    }
  ];
  
  // Fetch FAQ data
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundFaq = mockFAQs.find(faq => faq.id === id);
      if (foundFaq) {
        setFaq(foundFaq);
        setLoading(false);
      } else {
        setError('FAQ not found');
        setLoading(false);
      }
    }, 500);
  }, [id]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle delete
  const handleDelete = () => {
    // Simulate API call
    setTimeout(() => {
      console.log('Deleted FAQ:', id);
      router.push('/dashboard/support/faq');
    }, 500);
  };
  
  // Handle status change
  const handleStatusChange = () => {
    setChangingStatus(true);
    
    // Simulate API call
    setTimeout(() => {
      const newStatus = faq.status === 'published' ? 'draft' : 'published';
      setFaq({
        ...faq,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        history: [
          ...faq.history,
          { action: newStatus === 'published' ? 'published' : 'unpublished', date: new Date().toISOString(), user: 'Current User' }
        ]
      });
      setChangingStatus(false);
    }, 500);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">{error}</h3>
          <p className="mt-1 text-sm text-gray-500">The FAQ you are looking for could not be found.</p>
          <div className="mt-6">
            <Link href="/dashboard/support/faq" passHref>
              <Button>
                Back to FAQ List
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
          <h1 className="text-2xl font-bold">FAQ Details</h1>
          <p className="text-gray-500 mt-1">View and manage FAQ information</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/dashboard/support/faq" passHref>
            <Button variant="outline">
              Back to List
            </Button>
          </Link>
          <Link href={`/dashboard/support/faq/${id}/edit`} passHref>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit FAQ
            </Button>
          </Link>
        </div>
      </div>
      
      {/* FAQ Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question & Answer */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Question & Answer</h2>
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                faq.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {faq.status.charAt(0).toUpperCase() + faq.status.slice(1)}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Question</h3>
                <p className="mt-1 text-lg">{faq.question}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Answer</h3>
                <div className="mt-1 prose max-w-none">
                  <p>{faq.answer}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Category:</span>
                      <span className="ml-2">{faq.category}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Sort Order:</span>
                      <span className="ml-2">{faq.sortOrder}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Visibility:</span>
                    <span className="ml-2">{faq.isPublic ? 'Public' : 'Internal Only'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Performance Metrics */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Views</div>
                <div className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold">{faq.views.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Helpful</div>
                <div className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-green-600">{faq.helpful.toLocaleString()}</div>
                  {faq.views > 0 && (
                    <div className="ml-2 text-sm text-gray-500">
                      ({((faq.helpful / faq.views) * 100).toFixed(1)}%)
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Not Helpful</div>
                <div className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-red-600">{faq.notHelpful.toLocaleString()}</div>
                  {faq.views > 0 && (
                    <div className="ml-2 text-sm text-gray-500">
                      ({((faq.notHelpful / faq.views) * 100).toFixed(1)}%)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
          
          {/* History */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">History</h2>
            
            <div className="flow-root">
              <ul className="-mb-8">
                {faq.history.map((event, eventIdx) => (
                  <li key={eventIdx}>
                    <div className="relative pb-8">
                      {eventIdx !== faq.history.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            event.action === 'created' ? 'bg-green-500' :
                            event.action === 'updated' ? 'bg-blue-500' :
                            event.action === 'published' ? 'bg-purple-500' :
                            event.action === 'unpublished' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`}>
                            {event.action === 'created' && (
                              <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                            )}
                            {event.action === 'updated' && (
                              <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            )}
                            {event.action === 'published' && (
                              <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {event.action === 'unpublished' && (
                              <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {event.action.charAt(0).toUpperCase() + event.action.slice(1)} by <span className="font-medium text-gray-900">{event.user}</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {formatDate(event.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            
            <div className="space-y-4">
              <Button
                onClick={handleStatusChange}
                disabled={changingStatus}
                className="w-full justify-center"
                variant={faq.status === 'published' ? 'outline' : 'default'}
              >
                {changingStatus ? (
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    {faq.status === 'published' ? (
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </>
                )}
                {faq.status === 'published' ? 'Unpublish' : 'Publish'}
              </Button>
              
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full justify-center"
                variant="destructive"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete FAQ
              </Button>
            </div>
          </Card>
          
          {/* Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Information</h2>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-500">ID</div>
                <div className="mt-1 text-sm">{faq.id}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Created</div>
                <div className="mt-1 text-sm">{formatDate(faq.createdAt)}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Last Updated</div>
                <div className="mt-1 text-sm">{formatDate(faq.updatedAt)}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete FAQ
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this FAQ? This action cannot be undone.
                        All data associated with this FAQ will be permanently removed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="w-full sm:w-auto sm:ml-3"
                >
                  Delete
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="outline"
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}