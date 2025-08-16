'use client';

import React from 'react';
import { CreditCard, DollarSign, Smartphone } from 'lucide-react';

const PaymentMethods = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700">Accepted Payment Methods</h4>
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-700">Credit Card</span>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-700">Debit Card</span>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2">
          <DollarSign className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-700">Cash</span>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2">
          <Smartphone className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-700">Mobile Payment</span>
        </div>
      </div>
      
      <div className="rounded-md bg-gray-50 p-3">
        <p className="text-xs text-gray-500">
          All transactions are secure and encrypted. For any payment issues, please contact support.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethods;