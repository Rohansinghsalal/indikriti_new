'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import PaymentStatus from './PaymentStatus';

const TransactionCard = ({ transaction }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'payment':
        return 'Payment';
      case 'refund':
        return 'Refund';
      case 'payout':
        return 'Payout';
      case 'transfer':
        return 'Transfer';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'refund':
        return 'bg-amber-100 text-amber-800';
      case 'payout':
        return 'bg-blue-100 text-blue-800';
      case 'transfer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (!transaction) {
    return null;
  }
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-medium">{transaction.id}</h3>
            <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
          </div>
          <Badge className={getTransactionTypeColor(transaction.type)}>
            {getTransactionTypeLabel(transaction.type)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="font-medium">{formatCurrency(transaction.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <PaymentStatus status={transaction.status} />
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">Customer</p>
          <p className="font-medium">
            {transaction.customer ? transaction.customer.name : 'N/A'}
          </p>
        </div>
        
        {transaction.paymentMethod && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Payment Method</p>
            <div className="flex items-center mt-1">
              {transaction.paymentMethod.type === 'card' && (
                <>
                  <span className="text-sm font-medium">
                    {transaction.paymentMethod.brand} •••• {transaction.paymentMethod.last4}
                  </span>
                </>
              )}
              {transaction.paymentMethod.type === 'bank_transfer' && (
                <span className="text-sm font-medium">
                  Bank Transfer
                </span>
              )}
              {transaction.paymentMethod.type === 'wallet' && (
                <span className="text-sm font-medium">
                  {transaction.paymentMethod.wallet} Wallet
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <Link href={`/financial/transactions/${transaction.id}`}>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default TransactionCard;