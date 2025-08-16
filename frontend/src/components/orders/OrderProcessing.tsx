// 'use client';

// import React, { useState } from 'react';
// import { Button, Alert } from '@/components/ui';

// interface OrderProcessingProps {
//   order: Order;
//   onStatusUpdate: (orderId: string, status: string, paymentStatus: string) => Promise<boolean>;
//   onShipOrder?: (orderId: string, trackingInfo: TrackingInfo) => Promise<boolean>;
// }

// interface Order {
//   id: string;
//   orderNumber: string;
//   status: string;
//   paymentStatus: string;
// }

// interface TrackingInfo {
//   trackingNumber: string;
//   carrier: string;
//   notes?: string;
// }

// export default function OrderProcessing({ 
//   order, 
//   onStatusUpdate,
//   onShipOrder 
// }: OrderProcessingProps) {
//   // Order status options
//   const orderStatuses = [
//     'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'
//   ];

//   // Payment statuses
//   const paymentStatuses = [
//     'Pending', 'Paid', 'Failed', 'Refunded'
//   ];

//   // Form state
//   const [status, setStatus] = useState(order.status);
//   const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
//   const [trackingNumber, setTrackingNumber] = useState('');
//   const [carrier, setCarrier] = useState('');
//   const [notes, setNotes] = useState('');
  
//   // UI state
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [showShippingForm, setShowShippingForm] = useState(false);

//   const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setStatus(e.target.value);
//     // If status is changed to Shipped, show shipping form
//     if (e.target.value === 'Shipped') {
//       setShowShippingForm(true);
//     } else {
//       setShowShippingForm(false);
//     }
//   };

//   const handlePaymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setPaymentStatus(e.target.value);
//   };

//   const handleUpdateStatus = async () => {
//     setIsSubmitting(true);
//     setError(null);
//     setSuccess(null);
    
//     try {
//       const result = await onStatusUpdate(order.id, status, paymentStatus);
//       if (result) {
//         setSuccess('Order status updated successfully');
//       } else {
//         setError('Failed to update order status');
//       }
//     } catch (err) {
//       setError('An error occurred while updating the order');
//       console.error(err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleShipOrder = async () => {
//     if (!onShipOrder) return;
    
//     // Validate tracking info
//     if (!trackingNumber || !carrier) {
//       setError('Tracking number and carrier are required');
//       return;
//     }
    
//     setIsSubmitting(true);
//     setError(null);
//     setSuccess(null);
    
//     try {
//       const result = await onShipOrder(order.id, {
//         trackingNumber,
//         carrier,
//         notes
//       });
      
//       if (result) {
//         setSuccess('Order shipped successfully');
//         setStatus('Shipped');
//         // Reset form
//         setTrackingNumber('');
//         setCarrier('');
//         setNotes('');
//         setShowShippingForm(false);
//       } else {
//         setError('Failed to ship order');
//       }
//     } catch (err) {
//       setError('An error occurred while shipping the order');
//       console.error(err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
//       <h2 className="text-xl font-medium text-gray-900">Process Order #{order.orderNumber}</h2>
      
//       {error && (
//         <Alert type="error" message={error} onClose={() => setError(null)} />
//       )}
      
//       {success && (
//         <Alert type="success" message={success} onClose={() => setSuccess(null)} />
//       )}
      
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         {/* Order Status */}
//         <div>
//           <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700">
//             Order Status
//           </label>
//           <select
//             id="orderStatus"
//             value={status}
//             onChange={handleStatusChange}
//             className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
//           >
//             {orderStatuses.map(statusOption => (
//               <option key={statusOption} value={statusOption}>{statusOption}</option>
//             ))}
//           </select>
//         </div>
        
//         {/* Payment Status */}
//         <div>
//           <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
//             Payment Status
//           </label>
//           <select
//             id="paymentStatus"
//             value={paymentStatus}
//             onChange={handlePaymentStatusChange}
//             className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
//           >
//             {paymentStatuses.map(statusOption => (
//               <option key={statusOption} value={statusOption}>{statusOption}</option>
//             ))}
//           </select>
//         </div>
//       </div>
      
//       {/* Shipping Form */}
//       {showShippingForm && (
//         <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
//           <h3 className="mb-4 text-lg font-medium text-gray-900">Shipping Information</h3>
          
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <div>
//               <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700">
//                 Tracking Number
//               </label>
//               <input
//                 type="text"
//                 id="trackingNumber"
//                 value={trackingNumber}
//                 onChange={(e) => setTrackingNumber(e.target.value)}
//                 className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
//                 placeholder="Enter tracking number"
//               />
//             </div>
            
//             <div>
//               <label htmlFor="carrier" className="block text-sm font-medium text-gray-700">
//                 Carrier
//               </label>
//               <input
//                 type="text"
//                 id="carrier"
//                 value={carrier}
//                 onChange={(e) => setCarrier(e.target.value)}
//                 className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
//                 placeholder="Enter carrier name"
//               />
//             </div>
//           </div>
          
//           <div className="mt-4">
//             <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
//               Shipping Notes (Optional)
//             </label>
//             <textarea
//               id="notes"
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               rows={3}
//               className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
//               placeholder="Add any additional notes about the shipment"
//             />
//           </div>
          
//           <div className="mt-4">
//             <Button 
//               onClick={handleShipOrder} 
//               isLoading={isSubmitting}
//               disabled={!trackingNumber || !carrier}
//             >
//               Ship Order
//             </Button>
//           </div>
//         </div>
//       )}
      
//       {/* Update Button */}
//       <div className="flex justify-end pt-4">
//         <Button 
//           onClick={handleUpdateStatus} 
//           isLoading={isSubmitting}
//           disabled={status === order.status && paymentStatus === order.paymentStatus}
//         >
//           Update Order Status
//         </Button>
//       </div>
//     </div>
//   );
// }



'use client';

import React, { useState } from 'react';
import { Button, Alert } from '@/components/ui';

interface OrderProcessingProps {
  order: Order | null; // Allow null to prevent runtime crash
  onStatusUpdate: (orderId: string, status: string, paymentStatus: string) => Promise<boolean>;
  onShipOrder?: (orderId: string, trackingInfo: TrackingInfo) => Promise<boolean>;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
}

interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  notes?: string;
}

export default function OrderProcessing({ 
  order, 
  onStatusUpdate,
  onShipOrder 
}: OrderProcessingProps) {
  if (!order) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading order details...
      </div>
    );
  }

  // Order status options
  const orderStatuses = [
    'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'
  ];

  // Payment statuses
  const paymentStatuses = [
    'Pending', 'Paid', 'Failed', 'Refunded'
  ];

  // Form state
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [notes, setNotes] = useState('');
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showShippingForm, setShowShippingForm] = useState(status === 'Shipped');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setShowShippingForm(newStatus === 'Shipped');
  };

  const handlePaymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await onStatusUpdate(order.id, status, paymentStatus);
      if (result) {
        setSuccess('Order status updated successfully');
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      setError('An error occurred while updating the order');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShipOrder = async () => {
    if (!onShipOrder) return;
    
    if (!trackingNumber || !carrier) {
      setError('Tracking number and carrier are required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await onShipOrder(order.id, {
        trackingNumber,
        carrier,
        notes
      });
      
      if (result) {
        setSuccess('Order shipped successfully');
        setStatus('Shipped');
        setTrackingNumber('');
        setCarrier('');
        setNotes('');
        setShowShippingForm(false);
      } else {
        setError('Failed to ship order');
      }
    } catch (err) {
      setError('An error occurred while shipping the order');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-medium text-gray-900">Process Order #{order.orderNumber}</h2>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
      
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} />
      )}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Order Status */}
        <div>
          <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700">
            Order Status
          </label>
          <select
            id="orderStatus"
            value={status}
            onChange={handleStatusChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {orderStatuses.map(statusOption => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
            Payment Status
          </label>
          <select
            id="paymentStatus"
            value={paymentStatus}
            onChange={handlePaymentStatusChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {paymentStatuses.map(statusOption => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shipping Info */}
      {showShippingForm && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Shipping Information</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700">
                Tracking Number
              </label>
              <input
                type="text"
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter tracking number"
              />
            </div>

            <div>
              <label htmlFor="carrier" className="block text-sm font-medium text-gray-700">
                Carrier
              </label>
              <input
                type="text"
                id="carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter carrier name"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Shipping Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Add any additional notes about the shipment"
            />
          </div>

          <div className="mt-4">
            <Button 
              onClick={handleShipOrder} 
              isLoading={isSubmitting}
              disabled={!trackingNumber || !carrier}
            >
              Ship Order
            </Button>
          </div>
        </div>
      )}

      {/* Update Status */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleUpdateStatus} 
          isLoading={isSubmitting}
          disabled={status === order.status && paymentStatus === order.paymentStatus}
        >
          Update Order Status
        </Button>
      </div>
    </div>
  );
}
