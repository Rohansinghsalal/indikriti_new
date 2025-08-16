'use client';

import React from 'react';
import { FiEye, FiEdit } from 'react-icons/fi';
import { Card } from '@/components/ui';
import Link from 'next/link';

interface OrderCardProps {
  order: Order;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
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
  company: string;
}

export default function OrderCard({ order, onView, onEdit }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-medium text-indigo-600">#{order.orderNumber}</h3>
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}
            >
              {order.status}
            </span>
          </div>
          
          <div className="mb-4 text-sm text-gray-500">
            <p>{formatDate(order.createdAt)}</p>
            <p className="mt-1">{order.company}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Customer</p>
            <p className="text-sm text-gray-900">{order.customerName}</p>
            <p className="text-xs text-gray-500">{order.customerEmail}</p>
          </div>
          
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Payment</p>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(order.paymentStatus)}`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <p className="text-sm text-gray-500">{order.paymentMethod}</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(order.total)}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onView(order)}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
              aria-label="View order"
            >
              <FiEye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(order)}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
              aria-label="Edit order"
            >
              <FiEdit className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}