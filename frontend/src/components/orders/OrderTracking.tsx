'use client';

import React from 'react';

interface OrderTrackingProps {
  trackingEvents: TrackingEvent[];
  trackingNumber?: string;
  carrier?: string;
}

interface TrackingEvent {
  id: string;
  status: string;
  location?: string;
  timestamp: string;
  description?: string;
}

export default function OrderTracking({ 
  trackingEvents, 
  trackingNumber, 
  carrier 
}: OrderTrackingProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500';
      case 'in transit':
      case 'shipped':
        return 'bg-blue-500';
      case 'out for delivery':
        return 'bg-indigo-500';
      case 'pending':
      case 'processing':
        return 'bg-yellow-500';
      case 'failed':
      case 'cancelled':
      case 'returned':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tracking Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-medium text-gray-900">Shipment Tracking</h2>
        {trackingNumber ? (
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium text-gray-500">Tracking Number:</span>
              <span className="text-sm text-gray-900">{trackingNumber}</span>
            </div>
            {carrier && (
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium text-gray-500">Carrier:</span>
                <span className="text-sm text-gray-900">{carrier}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No tracking information available</p>
        )}
      </div>

      {/* Tracking Timeline */}
      {trackingEvents && trackingEvents.length > 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-md font-medium text-gray-900">Tracking History</h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>

            {/* Timeline Events */}
            <div className="space-y-6">
              {trackingEvents.map((event, index) => (
                <div key={event.id} className="relative pl-10">
                  {/* Status Dot */}
                  <div className={`absolute left-2.5 top-1.5 h-3 w-3 rounded-full ${getStatusColor(event.status)}`}></div>
                  
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{event.status}</h4>
                      <span className="text-xs text-gray-500">{formatDate(event.timestamp)}</span>
                    </div>
                    {event.location && (
                      <p className="text-xs text-gray-600">{event.location}</p>
                    )}
                    {event.description && (
                      <p className="mt-1 text-sm text-gray-700">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : trackingNumber ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">No tracking events available yet</p>
        </div>
      ) : null}
    </div>
  );
}