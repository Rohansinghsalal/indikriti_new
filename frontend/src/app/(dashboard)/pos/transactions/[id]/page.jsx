'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function TransactionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  
  // Fetch transaction data
  useEffect(() => {
    // Simulate API call
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // await fetch(`/api/pos/transactions/${id}`)
        
        // Mock data for demonstration
        const mockTransaction = {
          id: id,
          date: '2023-06-15T14:30:00',
          customer: { 
            name: 'John Doe', 
            id: 'CUST-101',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567'
          },
          total: 129.99,
          subtotal: 119.99,
          tax: 10.00,
          discount: 0,
          items: [
            {
              id: 'PROD-001',
              name: 'Premium T-Shirt',
              sku: 'TS-PRE-L-BLK',
              quantity: 1,
              price: 29.99,
              total: 29.99
            },
            {
              id: 'PROD-002',
              name: 'Designer Jeans',
              sku: 'JN-DES-32-BLU',
              quantity: 1,
              price: 59.99,
              total: 59.99
            },
            {
              id: 'PROD-003',
              name: 'Casual Sneakers',
              sku: 'SN-CAS-10-WHT',
              quantity: 1,
              price: 40.01,
              total: 40.01
            }
          ],
          paymentMethod: 'Credit Card',
          paymentDetails: {
            type: 'Credit Card',
            cardType: 'Visa',
            lastFour: '4242',
            authCode: 'AUTH123456',
            status: 'approved'
          },
          status: 'completed',
          cashier: 'Sarah Johnson',
          register: 'POS-01',
          store: 'Main Store',
          notes: '',
          history: [
            {
              timestamp: '2023-06-15T14:28:30',
              action: 'Transaction initiated',
              user: 'Sarah Johnson'
            },
            {
              timestamp: '2023-06-15T14:29:45',
              action: 'Payment processed',
              user: 'Sarah Johnson'
            },
            {
              timestamp: '2023-06-15T14:30:00',
              action: 'Transaction completed',
              user: 'Sarah Johnson'
            }
          ]
        };
        
        // Simulate network delay
        setTimeout(() => {
          setTransaction(mockTransaction);
          setLoading(false);
        }, 800);
        
      } catch (err) {
        setError('Failed to load transaction details');
        setLoading(false);
      }
    };
    
    fetchTransaction();
  }, [id]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format timestamp for history
  const formatTimestamp = (dateString) => {
    const options = { 
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };
  
  // Handle print receipt
  const handlePrint = () => {
    window.print();
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p>Loading transaction details...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border border-red-200">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/dashboard/pos/transactions')}>
              Return to Transactions
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  // Not found state
  if (!transaction) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-yellow-50 border border-yellow-200">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-yellow-700 mb-2">Transaction Not Found</h2>
            <p className="text-yellow-600 mb-4">The transaction you are looking for does not exist or has been removed.</p>
            <Button onClick={() => router.push('/dashboard/pos/transactions')}>
              Return to Transactions
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Transaction {transaction.id}</h1>
          <p className="text-gray-500">{formatDate(transaction.date)}</p>
        </div>
        
        <div className="flex space-x-2">
          <Link href="/dashboard/pos/transactions" passHref>
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </Button>
          </Link>
          
          <Button onClick={handlePrint}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Print Receipt
          </Button>
        </div>
      </div>
      
      {/* Status Badge */}
      <div>
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
          transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
          transaction.status === 'voided' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </span>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${activeTab === 'summary' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`${activeTab === 'customer' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('customer')}
          >
            Customer
          </button>
          <button
            className={`${activeTab === 'items' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('items')}
          >
            Items
          </button>
          <button
            className={`${activeTab === 'payment' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('payment')}
          >
            Payment
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
      <div className="mt-6">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Transaction Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-medium">{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date & Time:</span>
                  <span>{formatDate(transaction.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-medium ${
                    transaction.status === 'completed' ? 'text-green-600' :
                    transaction.status === 'voided' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cashier:</span>
                  <span>{transaction.cashier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Register:</span>
                  <span>{transaction.register}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Store:</span>
                  <span>{transaction.store}</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span>${transaction.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax:</span>
                  <span>${transaction.tax.toFixed(2)}</span>
                </div>
                {transaction.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount:</span>
                    <span>-${transaction.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-700 font-medium">Total:</span>
                  <span className="text-lg font-bold">${transaction.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">Payment Method:</span>
                  <span>{transaction.paymentMethod}</span>
                </div>
                {transaction.paymentDetails.cardType && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Card:</span>
                    <span>{transaction.paymentDetails.cardType} ending in {transaction.paymentDetails.lastFour}</span>
                  </div>
                )}
                {transaction.paymentDetails.authCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Auth Code:</span>
                    <span>{transaction.paymentDetails.authCode}</span>
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="p-6 md:col-span-2">
              <h2 className="text-lg font-medium mb-4">Items ({transaction.items.length})</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transaction.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
        
        {/* Customer Tab */}
        {activeTab === 'customer' && (
          <Card className="p-6">
            {transaction.customer ? (
              <div>
                <h2 className="text-lg font-medium mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{transaction.customer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Customer ID:</span>
                      <span>{transaction.customer.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span>{transaction.customer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span>{transaction.customer.phone}</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Link href={`/dashboard/customers/${transaction.customer.id}`} passHref>
                      <Button variant="outline">
                        View Customer Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Walk-in Customer</h3>
                <p className="text-gray-500">No customer information was recorded for this transaction.</p>
              </div>
            )}
          </Card>
        )}
        
        {/* Items Tab */}
        {activeTab === 'items' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Items Purchased</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transaction.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${item.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/dashboard/products/${item.id}`} passHref>
                          <Button variant="ghost" size="sm">
                            View Product
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Subtotal:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${transaction.subtotal.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Tax:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${transaction.tax.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                  {transaction.discount > 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Discount:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        -${transaction.discount.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                      Total:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ${transaction.total.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        )}
        
        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="font-medium">{transaction.paymentMethod}</span>
                </div>
                {transaction.paymentDetails.cardType && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Card Type:</span>
                    <span>{transaction.paymentDetails.cardType}</span>
                  </div>
                )}
                {transaction.paymentDetails.lastFour && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Card Number:</span>
                    <span>**** **** **** {transaction.paymentDetails.lastFour}</span>
                  </div>
                )}
                {transaction.paymentDetails.authCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Authorization Code:</span>
                    <span>{transaction.paymentDetails.authCode}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status:</span>
                  <span className="capitalize font-medium text-green-600">{transaction.paymentDetails.status}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span>${transaction.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax:</span>
                  <span>${transaction.tax.toFixed(2)}</span>
                </div>
                {transaction.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount:</span>
                    <span>-${transaction.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-700 font-medium">Total:</span>
                  <span className="text-lg font-bold">${transaction.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Actions */}
            {transaction.status === 'completed' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-md font-medium mb-4">Payment Actions</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Void Transaction
                  </Button>
                  <Button variant="outline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Process Refund
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
        
        {/* History Tab */}
        {activeTab === 'history' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Transaction History</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {transaction.history.map((event, eventIdx) => (
                  <li key={eventIdx}>
                    <div className="relative pb-8">
                      {eventIdx !== transaction.history.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {event.action}{' '}
                              <span className="font-medium text-gray-900">
                                by {event.user}
                              </span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={event.timestamp}>{formatTimestamp(event.timestamp)}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Notes Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-md font-medium mb-4">Transaction Notes</h3>
              {transaction.notes ? (
                <p className="text-gray-700">{transaction.notes}</p>
              ) : (
                <p className="text-gray-500 italic">No notes for this transaction.</p>
              )}
              
              <div className="mt-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Add Note
                </label>
                <textarea
                  id="notes"
                  rows="3"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Add a note about this transaction..."
                ></textarea>
                <div className="mt-2 flex justify-end">
                  <Button size="sm">
                    Save Note
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}