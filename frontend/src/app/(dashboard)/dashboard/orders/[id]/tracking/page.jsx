'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiEdit, FiRefreshCw } from 'react-icons/fi';
import  OrderTracking  from '@/components/orders/OrderTracking';
import OrderStatus from '@/components/orders/OrderStatus';
import { Button, Alert, Spinner } from '@/components/ui';
import { api } from '@/lib/api';

export default function OrderTrackingPage({ params }) {
  const router = useRouter();
  const { id } = use(params); 

  const [order, setOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderAndTracking = async () => {
      setLoading(true);
      try {
        const orderResponse = await api.get(`/orders/${id}`);
        setOrder(orderResponse.data);

        if (orderResponse.data.shipping?.trackingNumber) {
          const trackingResponse = await api.get(
            `/tracking?carrier=${orderResponse.data.shipping.carrier}&number=${orderResponse.data.shipping.trackingNumber}`
          );
          setTrackingInfo(trackingResponse.data);
        }
      } catch (err) {
        console.error('Error fetching order tracking:', err);
        setError('Failed to load tracking information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderAndTracking();
    }
  }, [id]);

  const handleRefreshTracking = async () => {
    if (!order?.shipping?.trackingNumber) {
      setError('No tracking number available for this order');
      return;
    }

    setRefreshing(true);
    setError(null);

    try {
      const trackingResponse = await api.get(
        `/tracking?carrier=${order.shipping.carrier}&number=${order.shipping.trackingNumber}`
      );
      setTrackingInfo(trackingResponse.data);
    } catch (err) {
      console.error('Error refreshing tracking info:', err);
      setError('Failed to refresh tracking information. Please try again later.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleEditOrder = () => router.push(`/orders/${id}/edit`);
  const handleBackToOrder = () => router.push(`/dashboard/orders/${id}`);
  const handleBackToOrders = () => router.push('/dashboard/orders');

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <Alert variant="warning">Order not found</Alert>
        <div className="mt-4">
          <Button onClick={handleBackToOrders} variant="outline">
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button onClick={handleBackToOrder} variant="ghost" size="sm">
            <FiArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Tracking for Order #{order.orderNumber}</h1>
          <OrderStatus status={order.status} size="lg" />
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleRefreshTracking}
            variant="outline"
            disabled={refreshing || !order.shipping?.trackingNumber}
          >
            {refreshing ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <FiRefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh Tracking
          </Button>
          <Button onClick={handleEditOrder}>
            <FiEdit className="mr-2 h-4 w-4" />
            Edit Order
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {!order.shipping?.trackingNumber ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <FiRefreshCw className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No Tracking Information Available</h3>
            <p className="mb-6 text-gray-500">
              This order doesn't have a tracking number assigned yet.
            </p>
            <Button onClick={handleEditOrder} variant="outline">
              Add Tracking Information
            </Button>
          </div>
        ) : (
          <OrderTracking
            trackingNumber={order.shipping.trackingNumber}
            carrier={order.shipping.carrier}
            trackingEvents={trackingInfo?.events || []}
            estimatedDelivery={trackingInfo?.estimatedDelivery}
            currentStatus={trackingInfo?.status || order.status}
          />
        )}
      </div>
    </div>
  );
}
