'use client';

import React from 'react';

interface ShippingInfoProps {
  address: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  recipient?: {
    name: string;
    phone?: string;
    email?: string;
  };
  className?: string;
}

export default function ShippingInfo({ 
  address, 
  recipient,
  className = ''
}: ShippingInfoProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {recipient && (
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-900">{recipient.name}</p>
          {recipient.phone && <p className="text-sm text-gray-600">{recipient.phone}</p>}
          {recipient.email && <p className="text-sm text-gray-600">{recipient.email}</p>}
        </div>
      )}
      
      <div>
        <p className="text-sm text-gray-600">{address.address}</p>
        <p className="text-sm text-gray-600">
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p className="text-sm text-gray-600">{address.country}</p>
      </div>
    </div>
  );
}