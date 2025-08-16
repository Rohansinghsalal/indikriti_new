'use client';

import React from 'react';
import { Button } from '@/components/ui';
import OrderItems from './OrderItems';
import OrderStatus from './OrderStatus';
import ShippingInfo from './ShippingInfo';

interface OrderDetailsProps {
  order: Order;
  onEdit?: () => void;
  onBack?: () => void;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  company: string;
}

export default function OrderDetails({ order, onEdit, onBack }: OrderDetailsProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between space-y-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        
        <div className="flex space-x-3">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back to Orders
            </Button>
          )}
          
          {onEdit && (
            <Button onClick={onEdit}>
              Edit Order
            </Button>
          )}
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Customer Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-medium text-gray-900">Customer</h2>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
            <p className="text-sm text-gray-600">{order.customerEmail}</p>
            <p className="text-sm text-gray-600">Customer ID: {order.customerId}</p>
            <p className="text-sm text-gray-600">Company: {order.company}</p>
          </div>
        </div>
        
        {/* Order Status */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-medium text-gray-900">Order Status</h2>
          <OrderStatus status={order.status} paymentStatus={order.paymentStatus} />
          <div className="mt-3">
            <p className="text-sm text-gray-600">Payment Method: {order.paymentMethod}</p>
            <p className="mt-2 text-lg font-bold text-gray-900">{formatCurrency(order.total)}</p>
          </div>
        </div>
        
        {/* Shipping Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-medium text-gray-900">Shipping Information</h2>
          {order.shippingAddress ? (
            <ShippingInfo address={order.shippingAddress} />
          ) : (
            <p className="text-sm text-gray-500">No shipping information available</p>
          )}
        </div>
      </div>
      
      {/* Order Items */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Order Items</h2>
        <OrderItems items={order.items} formatCurrency={formatCurrency} />
      </div>
    </div>
  );
}
