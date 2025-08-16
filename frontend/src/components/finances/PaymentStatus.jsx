'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';

const PaymentStatus = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'succeeded':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-amber-100 text-amber-800';
      case 'canceled':
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'partially_refunded':
        return 'bg-purple-100 text-purple-800';
      case 'authorized':
        return 'bg-teal-100 text-teal-800';
      case 'disputed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    // Convert snake_case or kebab-case to Title Case
    return status
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Badge className={getStatusColor(status)}>
      {formatStatus(status)}
    </Badge>
  );
};

export default PaymentStatus;