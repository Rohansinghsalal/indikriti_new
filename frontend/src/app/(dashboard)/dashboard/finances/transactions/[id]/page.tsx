// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { Card } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Loader } from '@/components/ui/Loader';
// import { Table } from '@/components/ui/Table';
// import Link from 'next/link';

// export default function TransactionDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { id } = params;
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [transaction, setTransaction] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Simulate API call to fetch transaction details
//     const fetchTransactionDetails = async () => {
//       setIsLoading(true);
//       try {
//         // Replace with actual API call
//         const response = await new Promise((resolve, reject) => {
//           setTimeout(() => {
//             // Mock transaction data based on ID
//             if (id) {
//               const mockTransaction = {
//                 id: id,
//                 date: '2023-06-01',
//                 time: '14:30:25',
//                 amount: 1250.00,
//                 type: 'sale',
//                 status: 'completed',
//                 customer: {
//                   id: 'CUST-001',
//                   name: 'John Doe',
//                   email: 'john.doe@example.com',
//                   phone: '+1 (555) 123-4567'
//                 },
//                 paymentMethod: {
//                   type: 'Credit Card',
//                   details: {
//                     cardType: 'Visa',
//                     last4: '4242',
//                     expiryDate: '05/25'
//                   }
//                 },
//                 reference: 'ORD-2023-001',
//                 items: [
//                   {
//                     id: 'ITEM-001',
//                     name: 'Product A',
//                     quantity: 2,
//                     price: 500.00,
//                     total: 1000.00
//                   },
//                   {
//                     id: 'ITEM-002',
//                     name: 'Product B',
//                     quantity: 1,
//                     price: 250.00,
//                     total: 250.00
//                   }
//                 ],
//                 billing: {
//                   subtotal: 1250.00,
//                   tax: 100.00,
//                   shipping: 15.00,
//                   discount: 0.00,
//                   total: 1365.00
//                 },
//                 shipping: {
//                   address: {
//                     line1: '123 Main St',
//                     line2: 'Apt 4B',
//                     city: 'New York',
//                     state: 'NY',
//                     postalCode: '10001',
//                     country: 'USA'
//                   },
//                   method: 'Standard Shipping',
//                   trackingNumber: 'TRK12345678'
//                 },
//                 notes: 'Customer requested gift wrapping',
//                 history: [
//                   {
//                     date: '2023-06-01T14:30:25',
//                     action: 'Transaction created',
//                     user: 'System'
//                   },
//                   {
//                     date: '2023-06-01T14:30:30',
//                     action: 'Payment authorized',
//                     user: 'Payment Gateway'
//                   },
//                   {
//                     date: '2023-06-01T14:31:00',
//                     action: 'Transaction completed',
//                     user: 'System'
//                   }
//                 ]
//               };
//               resolve(mockTransaction);
//             } else {
//               reject(new Error('Transaction not found'));
//             }
//           }, 1000);
//         });

//         setTransaction(response);
//       } catch (error) {
//         console.error('Error fetching transaction details:', error);
//         setError(error.message || 'Failed to load transaction details');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) {
//       fetchTransactionDetails();
//     }
//   }, [id]);

//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case 'completed':
//         return 'bg-green-100 text-green-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'failed':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getTypeBadgeClass = (type) => {
//     switch (type) {
//       case 'sale':
//         return 'bg-blue-100 text-blue-800';
//       case 'refund':
//         return 'bg-orange-100 text-orange-800';
//       case 'payout':
//         return 'bg-purple-100 text-purple-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader size="lg" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <Card className="p-6 bg-red-50 border border-red-200">
//           <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
//           <p className="text-red-600">{error}</p>
//           <Button 
//             variant="outline" 
//             className="mt-4"
//             onClick={() => router.push('/financial/transactions')}
//           >
//             Back to Transactions
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   if (!transaction) {
//     return (
//       <div className="p-6">
//         <Card className="p-6 bg-yellow-50 border border-yellow-200">
//           <h2 className="text-xl font-bold text-yellow-700 mb-2">Transaction Not Found</h2>
//           <p className="text-yellow-600">The requested transaction could not be found.</p>
//           <Button 
//             variant="outline" 
//             className="mt-4"
//             onClick={() => router.push('/financial/transactions')}
//           >
//             Back to Transactions
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold">Transaction {transaction.id}</h1>
//           <p className="text-gray-500">{transaction.date} at {transaction.time}</p>
//         </div>
//         <div className="flex space-x-2">
//           <Button variant="outline" onClick={handlePrint}>
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-5 7a1 1 0 100-2 1 1 0 000 2zm1 2a1 1 0 11-2 0 1 1 0 012 0zm3-2a1 1 0 100-2 1 1 0 000 2zm1 2a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
//             </svg>
//             Print
//           </Button>
//           <Link href="/financial/transactions">
//             <Button variant="outline">
//               Back to Transactions
//             </Button>
//           </Link>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Transaction Summary Card */}
//         <Card className="p-6 col-span-1 md:col-span-2">
//           <h2 className="text-xl font-bold mb-4">Transaction Summary</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm font-medium text-gray-500">Status</p>
//               <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(transaction.status)}`}>
//                 {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
//               </span>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500">Type</p>
//               <span className={`px-2 py-1 rounded text-xs ${getTypeBadgeClass(transaction.type)}`}>
//                 {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
//               </span>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500">Amount</p>
//               <p className="font-bold">${transaction.amount.toFixed(2)}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500">Reference</p>
//               <p>{transaction.reference}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500">Payment Method</p>
//               <p>{transaction.paymentMethod.type}</p>
//               {transaction.paymentMethod.details && (
//                 <p className="text-sm text-gray-500">
//                   {transaction.paymentMethod.details.cardType} ending in {transaction.paymentMethod.details.last4}
//                 </p>
//               )}
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500">Date & Time</p>
//               <p>{transaction.date} at {transaction.time}</p>
//             </div>
//           </div>
//         </Card>

//         {/* Customer Information Card */}
//         <Card className="p-6">
//           <h2 className="text-xl font-bold mb-4">Customer Information</h2>
//           <div className="space-y-3">
//             <div>
//               <p className="text-sm font-medium text-gray-500">Name</p>
//               <p>{transaction.customer.name}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500">Email</p>
//               <p>{transaction.customer.email}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500">Phone</p>
//               <p>{transaction.customer.phone}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500">Customer ID</p>
//               <p>{transaction.customer.id}</p>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Transaction Items */}
//       <Card className="p-6">
//         <h2 className="text-xl font-bold mb-4">Transaction Items</h2>
//         <Table>
//           <Table.Header>
//             <Table.Row>
//               <Table.Head>Item ID</Table.Head>
//               <Table.Head>Name</Table.Head>
//               <Table.Head>Quantity</Table.Head>
//               <Table.Head>Price</Table.Head>
//               <Table.Head>Total</Table.Head>
//             </Table.Row>
//           </Table.Header>
//           <Table.Body>
//             {transaction.items.map((item) => (
//               <Table.Row key={item.id}>
//                 <Table.Cell>{item.id}</Table.Cell>
//                 <Table.Cell>{item.name}</Table.Cell>
//                 <Table.Cell>{item.quantity}</Table.Cell>
//                 <Table.Cell>${item.price.toFixed(2)}</Table.Cell>
//                 <Table.Cell>${item.total.toFixed(2)}</Table.Cell>
//               </Table.Row>
//             ))}
//           </Table.Body>
//           <Table.Footer>
//             <Table.Row>
//               <Table.Cell colSpan={4} className="text-right font-medium">Subtotal</Table.Cell>
//               <Table.Cell className="font-medium">${transaction.billing.subtotal.toFixed(2)}</Table.Cell>
//             </Table.Row>
//             <Table.Row>
//               <Table.Cell colSpan={4} className="text-right font-medium">Tax</Table.Cell>
//               <Table.Cell className="font-medium">${transaction.billing.tax.toFixed(2)}</Table.Cell>
//             </Table.Row>
//             <Table.Row>
//               <Table.Cell colSpan={4} className="text-right font-medium">Shipping</Table.Cell>
//               <Table.Cell className="font-medium">${transaction.billing.shipping.toFixed(2)}</Table.Cell>
//             </Table.Row>
//             {transaction.billing.discount > 0 && (
//               <Table.Row>
//                 <Table.Cell colSpan={4} className="text-right font-medium">Discount</Table.Cell>
//                 <Table.Cell className="font-medium">-${transaction.billing.discount.toFixed(2)}</Table.Cell>
//               </Table.Row>
//             )}
//             <Table.Row>
//               <Table.Cell colSpan={4} className="text-right font-bold">Total</Table.Cell>
//               <Table.Cell className="font-bold">${transaction.billing.total.toFixed(2)}</Table.Cell>
//             </Table.Row>
//           </Table.Footer>
//         </Table>
//       </Card>

//       {/* Shipping Information */}
//       <Card className="p-6">
//         <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
//             <p>{transaction.shipping.address.line1}</p>
//             {transaction.shipping.address.line2 && <p>{transaction.shipping.address.line2}</p>}
//             <p>
//               {transaction.shipping.address.city}, {transaction.shipping.address.state} {transaction.shipping.address.postalCode}
//             </p>
//             <p>{transaction.shipping.address.country}</p>
//           </div>
//           <div>
//             <h3 className="text-lg font-medium mb-2">Shipping Details</h3>
//             <div className="space-y-2">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Method</p>
//                 <p>{transaction.shipping.method}</p>
//               </div>
//               {transaction.shipping.trackingNumber && (
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Tracking Number</p>
//                   <p>{transaction.shipping.trackingNumber}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* Transaction History */}
//       <Card className="p-6">
//         <h2 className="text-xl font-bold mb-4">Transaction History</h2>
//         <div className="space-y-4">
//           {transaction.history.map((event, index) => {
//             const eventDate = new Date(event.date);
//             return (
//               <div key={index} className="flex">
//                 <div className="mr-4 flex flex-col items-center">
//                   <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                   {index < transaction.history.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1"></div>}
//                 </div>
//                 <div>
//                   <p className="font-medium">{event.action}</p>
//                   <p className="text-sm text-gray-500">
//                     {eventDate.toLocaleString()} by {event.user}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </Card>

//       {/* Notes */}
//       {transaction.notes && (
//         <Card className="p-6">
//           <h2 className="text-xl font-bold mb-4">Notes</h2>
//           <p>{transaction.notes}</p>
//         </Card>
//       )}

//       {/* Actions */}
//       <div className="flex justify-end space-x-4">
//         <Button variant="outline">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//             <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//           </svg>
//           Add Note
//         </Button>
//         <Button variant="outline">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//           </svg>
//           Contact Customer
//         </Button>
//         {transaction.type === 'sale' && transaction.status === 'completed' && (
//           <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
//             </svg>
//             Process Refund
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import Table from '@/components/ui/Table';
import Link from 'next/link';

export default function TransactionDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true);
      try {
        const data = await new Promise<any>((resolve, reject) => {
          setTimeout(() => {
            if (id) {
              resolve({
                id,
                date: '2023-06-01',
                time: '14:30:25',
                amount: 1250.0,
                type: 'sale',
                status: 'completed',
                customer: {
                  id: 'CUST-001',
                  name: 'John Doe',
                  email: 'john.doe@example.com',
                  phone: '+1 (555) 123-4567',
                },
                paymentMethod: {
                  type: 'Credit Card',
                  details: { cardType: 'Visa', last4: '4242', expiryDate: '05/25' },
                },
                reference: 'ORD-2023-001',
                items: [
                  { id: 'ITEM-001', name: 'Product A', quantity: 2, price: 500.0, total: 1000.0 },
                  { id: 'ITEM-002', name: 'Product B', quantity: 1, price: 250.0, total: 250.0 },
                ],
                billing: { subtotal: 1250.0, tax: 100.0, shipping: 15.0, discount: 0.0, total: 1365.0 },
                shipping: {
                  address: {
                    line1: '123 Main St',
                    line2: 'Apt 4B',
                    city: 'New York',
                    state: 'NY',
                    postalCode: '10001',
                    country: 'USA',
                  },
                  method: 'Standard Shipping',
                  trackingNumber: 'TRK12345678',
                },
                notes: 'Customer requested gift wrapping',
                history: [
                  { date: '2023-06-01T14:30:25', action: 'Transaction created', user: 'System' },
                  { date: '2023-06-01T14:30:30', action: 'Payment authorized', user: 'Payment Gateway' },
                  { date: '2023-06-01T14:31:00', action: 'Transaction completed', user: 'System' },
                ],
              });
            } else {
              reject(new Error('Transaction not found'));
            }
          }, 1000);
        });
        setTransaction(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending':   return 'bg-yellow-100 text-yellow-800';
      case 'failed':    return 'bg-red-100 text-red-800';
      default:          return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'sale':   return 'bg-blue-100 text-blue-800';
      case 'refund': return 'bg-orange-100 text-orange-800';
      case 'payout': return 'bg-purple-100 text-purple-800';
      default:       return 'bg-gray-100 text-gray-800';
    }
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
        <Card className="bg-red-50 border-red-200">
          <h2 className="text-xl font-bold text-red-700">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push('/financial/transactions')}>
            Back to Transactions
          </Button>
        </Card>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-6">
        <Card className="bg-yellow-50 border-yellow-200">
          <h2 className="text-xl font-bold text-yellow-700">Transaction Not Found</h2>
          <p className="text-yellow-600">The requested transaction could not be found.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push('/financial/transactions')}>
            Back to Transactions
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header & Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Transaction {transaction.id}</h1>
          <p className="text-gray-500">{transaction.date} at {transaction.time}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.print()}>Print</Button>
          <Link href="/financial/transactions">
            <Button variant="outline">Back to Transactions</Button>
          </Link>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Transaction Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(transaction.status)}`}> 
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Type</p>
            <span className={`px-2 py-1 rounded text-xs ${getTypeBadgeClass(transaction.type)}`}> 
              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Amount</p>
            <p className="font-bold">${transaction.amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Reference</p>
            <p>{transaction.reference}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Payment Method</p>
            <p>{transaction.paymentMethod.type}</p>
            <p className="text-sm text-gray-500">{transaction.paymentMethod.details.cardType} ending in {transaction.paymentMethod.details.last4}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date & Time</p>
            <p>{transaction.date} at {transaction.time}</p>
          </div>
        </div>
      </Card>

      {/* Customer Info */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Customer Information</h2>
        <div className="space-y-3">
          <p><span className="font-medium">Name: </span>{transaction.customer.name}</p>
          <p><span className="font-medium">Email: </span>{transaction.customer.email}</p>
          <p><span className="font-medium">Phone: </span>{transaction.customer.phone}</p>
          <p><span className="font-medium">Customer ID: </span>{transaction.customer.id}</p>
        </div>
      </Card>

      {/* Items Table */}
      <Card className="p-6">
  <h2 className="text-xl font-bold mb-4">Transaction Items</h2>
  <Table
    keyField="id"
    data={transaction.items}
    columns={[
      { accessor: 'id', label: 'Item ID' },
      { accessor: 'name', label: 'Name' },
      { accessor: 'quantity', label: 'Quantity' },
      {
        accessor: 'price',
        label: 'Price',
        render: (item) => `$${item.price.toFixed(2)}`
      },
      {
        accessor: 'total',
        label: 'Total',
        render: (item) => `$${item.total.toFixed(2)}`
      }
    ]}
  />

  {/* Billing Summary */}
  <div className="mt-6 space-y-2 text-sm text-right">
    <div>
      <span className="font-medium">Subtotal: </span>
      ${transaction.billing.subtotal.toFixed(2)}
    </div>
    <div>
      <span className="font-medium">Tax: </span>
      ${transaction.billing.tax.toFixed(2)}
    </div>
    <div>
      <span className="font-medium">Shipping: </span>
      ${transaction.billing.shipping.toFixed(2)}
    </div>
    {transaction.billing.discount > 0 && (
      <div>
        <span className="font-medium">Discount: </span>
        -${transaction.billing.discount.toFixed(2)}
      </div>
    )}
    <div className="font-bold text-lg">
      Total: ${transaction.billing.total.toFixed(2)}
    </div>
  </div>
</Card>


      {/* Shipping Info */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium">Address</h3>
            <p>{transaction.shipping.address.line1}</p>
            {transaction.shipping.address.line2 && <p>{transaction.shipping.address.line2}</p>}
            <p>{transaction.shipping.address.city}, {transaction.shipping.address.state} {transaction.shipping.address.postalCode}</p>
            <p>{transaction.shipping.address.country}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Details</h3>
            <p><span className="font-medium">Method: </span>{transaction.shipping.method}</p>
            {transaction.shipping.trackingNumber && <p><span className="font-medium">Tracking #: </span>{transaction.shipping.trackingNumber}</p>}
          </div>
        </div>
      </Card>

      {/* History */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <div className="space-y-4">
          {transaction.history.map((event: any, idx: number) => {
            const date = new Date(event.date).toLocaleString();
            return (
              <div key={idx} className="flex items-start">
                <div className="mr-4 flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  {idx < transaction.history.length - 1 && <div className="h-full w-0.5 bg-gray-200 mt-1"></div>}
                </div>
                <div>
                  <p className="font-medium">{event.action}</p>
                  <p className="text-sm text-gray-500">{date} by {event.user}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Notes */}
      {transaction.notes && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Notes</h2>
          <p>{transaction.notes}</p>
        </Card>
      )}

      {/* Footer Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Add Note
        </Button>
        <Button variant="outline">
          Contact Customer
        </Button>
        {transaction.type === 'sale' && transaction.status === 'completed' && (
          <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
            Process Refund
          </Button>
        )}
      </div>
    </div>
  );
}
