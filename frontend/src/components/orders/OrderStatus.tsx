'use client';

import React from 'react';

interface OrderStatusProps {
  status: string;
  paymentStatus?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getStatusColor = (status?: string | null) => {
  const key = (status ?? '').toLowerCase();

  switch (key) {
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

const getSizeClasses = (size: string) => {
  switch (size) {
    case 'sm':
      return 'px-2 py-0.5 text-xs';
    case 'lg':
      return 'px-3 py-1.5 text-sm';
    case 'md':
    default:
      return 'px-2.5 py-1 text-xs';
  }
};

export default function OrderStatus({
  status,
  paymentStatus,
  size = 'md',
  className = '',
}: OrderStatusProps) {
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center">
        <span className="mr-2 text-sm text-gray-500">Status:</span>
        <span
          className={`inline-flex rounded-full ${sizeClasses} font-semibold ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
      </div>

      {paymentStatus && (
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-500">Payment:</span>
          <span
            className={`inline-flex rounded-full ${sizeClasses} font-semibold ${getStatusColor(
              paymentStatus
            )}`}
          >
            {paymentStatus}
          </span>
        </div>
      )}
    </div>
  );
}
