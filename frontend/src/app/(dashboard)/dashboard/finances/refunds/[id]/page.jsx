'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import  Loader  from '@/components/ui/Loader';
import { Table } from '@/components/ui/Table';
import Link from 'next/link';

export default function RefundDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [refund, setRefund] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch refund details
    const fetchRefundDetails = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        const response = await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Mock refund data based on ID
            if (id) {
              const mockRefund = {
                id: id,
                date: '2023-06-01',
                requestDate: '2023-05-30',
                processedDate: '2023-06-01',
                amount: 125.00,
                status: 'completed',
                customer: {
                  id: 'CUST-003',
                  name: 'Alice Johnson',
                  email: 'alice.johnson@example.com',
                  phone: '+1 (555) 987-6543'
                },
                reason: 'Item damaged during shipping',
                description: 'The product arrived with visible damage to the packaging and the item inside. Customer has provided photos of the damage.',
                originalTransaction: {
                  id: 'TRX-003',
                  date: '2023-05-25',
                  amount: 125.00
                },
                orderNumber: 'ORD-2023-003',
                refundMethod: {
                  type: 'Credit Card',
                  details: {
                    cardType: 'Visa',
                    last4: '4242',
                    expiryDate: '05/25'
                  }
                },
                items: [
                  {
                    id: 'ITEM-005',
                    name: 'Ceramic Vase',
                    quantity: 1,
                    price: 125.00,
                    total: 125.00,
                    returnCondition: 'Damaged'
                  }
                ],
                attachments: [
                  {
                    id: 'ATT-001',
                    name: 'damage_photo_1.jpg',
                    type: 'image/jpeg',
                    size: '1.2 MB',
                    uploadDate: '2023-05-30'
                  },
                  {
                    id: 'ATT-002',
                    name: 'damage_photo_2.jpg',
                    type: 'image/jpeg',
                    size: '0.9 MB',
                    uploadDate: '2023-05-30'
                  }
                ],
                history: [
                  {
                    date: '2023-05-30T10:15:00',
                    action: 'Refund requested',
                    user: 'Alice Johnson (Customer)'
                  },
                  {
                    date: '2023-05-31T09:30:00',
                    action: 'Refund request reviewed',
                    user: 'Jane Smith (Support Agent)'
                  },
                  {
                    date: '2023-05-31T14:45:00',
                    action: 'Refund approved',
                    user: 'Michael Brown (Manager)'
                  },
                  {
                    date: '2023-06-01T11:20:00',
                    action: 'Refund processed',
                    user: 'System'
                  },
                  {
                    date: '2023-06-01T11:25:00',
                    action: 'Customer notified',
                    user: 'System'
                  }
                ],
                notes: [
                  {
                    id: 'NOTE-001',
                    date: '2023-05-31T09:35:00',
                    text: 'Customer provided clear photos of the damage. Damage appears to have occurred during shipping.',
                    author: 'Jane Smith (Support Agent)'
                  },
                  {
                    id: 'NOTE-002',
                    date: '2023-05-31T14:40:00',
                    text: 'Approved full refund as per our policy for damaged items. No need to return the item.',
                    author: 'Michael Brown (Manager)'
                  }
                ]
              };
              resolve(mockRefund);
            } else {
              reject(new Error('Refund not found'));
            }
          }, 1000);
        });

        setRefund(response);
      } catch (error) {
        console.error('Error fetching refund details:', error);
        setError(error.message || 'Failed to load refund details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRefundDetails();
    }
  }, [id]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border border-red-200">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/financial/refunds')}
          >
            Back to Refunds
          </Button>
        </Card>
      </div>
    );
  }

  if (!refund) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-yellow-50 border border-yellow-200">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">Refund Not Found</h2>
          <p className="text-yellow-600">The requested refund could not be found.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/financial/refunds')}
          >
            Back to Refunds
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Refund {refund.id}</h1>
          <p className="text-gray-500">Requested on {refund.requestDate}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-5 7a1 1 0 100-2 1 1 0 000 2zm1 2a1 1 0 11-2 0 1 1 0 012 0zm3-2a1 1 0 100-2 1 1 0 000 2zm1 2a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
            Print
          </Button>
          <Link href="/financial/refunds">
            <Button variant="outline">
              Back to Refunds
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Refund Summary Card */}
        <Card className="p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Refund Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(refund.status)}`}>
                {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="font-bold">${refund.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Request Date</p>
              <p>{refund.requestDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Processed Date</p>
              <p>{refund.processedDate || 'Pending'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Original Transaction</p>
              <p>{refund.originalTransaction.id}</p>
              <p className="text-sm text-gray-500">{refund.originalTransaction.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Order Number</p>
              <p>{refund.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Refund Method</p>
              <p>{refund.refundMethod.type}</p>
              {refund.refundMethod.details && (
                <p className="text-sm text-gray-500">
                  {refund.refundMethod.details.cardType} ending in {refund.refundMethod.details.last4}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Reason</p>
              <p>{refund.reason}</p>
            </div>
          </div>
        </Card>

        {/* Customer Information Card */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Customer Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p>{refund.customer.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{refund.customer.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p>{refund.customer.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Customer ID</p>
              <p>{refund.customer.id}</p>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Contact Customer
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Refund Description */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Refund Description</h2>
        <p>{refund.description}</p>
      </Card>

      {/* Refunded Items */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Refunded Items</h2>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Item ID</Table.Head>
              <Table.Head>Name</Table.Head>
              <Table.Head>Quantity</Table.Head>
              <Table.Head>Price</Table.Head>
              <Table.Head>Total</Table.Head>
              <Table.Head>Condition</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {refund.items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>${item.price.toFixed(2)}</Table.Cell>
                <Table.Cell>${item.total.toFixed(2)}</Table.Cell>
                <Table.Cell>{item.returnCondition}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={4} className="text-right font-bold">Total Refund Amount</Table.Cell>
              <Table.Cell className="font-bold">${refund.amount.toFixed(2)}</Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Card>

      {/* Attachments */}
      {refund.attachments && refund.attachments.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Attachments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {refund.attachments.map((attachment) => (
              <div key={attachment.id} className="border rounded-md p-4 flex items-center">
                <div className="bg-gray-100 p-2 rounded-md mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-gray-500">{attachment.size} • {attachment.uploadDate}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Refund History */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Refund History</h2>
        <div className="space-y-4">
          {refund.history.map((event, index) => {
            const eventDate = new Date(event.date);
            return (
              <div key={index} className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  {index < refund.history.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1"></div>}
                </div>
                <div>
                  <p className="font-medium">{event.action}</p>
                  <p className="text-sm text-gray-500">
                    {eventDate.toLocaleString()} by {event.user}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Notes */}
      {refund.notes && refund.notes.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Notes</h2>
            <Button variant="outline" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Note
            </Button>
          </div>
          <div className="space-y-4">
            {refund.notes.map((note) => {
              const noteDate = new Date(note.date);
              return (
                <div key={note.id} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{note.author}</p>
                    <p className="text-sm text-gray-500">{noteDate.toLocaleString()}</p>
                  </div>
                  <p className="mt-2">{note.text}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        {refund.status === 'pending' && (
          <>
            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Approve Refund
            </Button>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Reject Refund
            </Button>
          </>
        )}
        <Button variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Contact Customer
        </Button>
        <Button variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit Details
        </Button>
      </div>
    </div>
  );
}