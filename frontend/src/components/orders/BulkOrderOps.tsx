'use client';

import React, { useState } from 'react';
import { Button, Alert } from '@/components/ui';

interface BulkOrderOpsProps {
  selectedOrders: string[];
  onUpdateStatus: (orderIds: string[], status: string) => Promise<boolean>;
  onUpdatePaymentStatus: (orderIds: string[], status: string) => Promise<boolean>;
  onExportOrders: (orderIds: string[]) => Promise<boolean>;
  onPrintOrders: (orderIds: string[]) => Promise<boolean>;
  onClearSelection: () => void;
}

export function BulkOrderOps({
  selectedOrders,
  onUpdateStatus,
  onUpdatePaymentStatus,
  onExportOrders,
  onPrintOrders,
  onClearSelection
}: BulkOrderOpsProps) {
  // Order status options
  const orderStatuses = [
    'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'
  ];

  // Payment statuses
  const paymentStatuses = [
    'Pending', 'Paid', 'Failed', 'Refunded'
  ];

  // Form state
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleUpdateStatus = async () => {
    if (!selectedStatus || selectedOrders.length === 0) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setActiveAction('status');
    
    try {
      const result = await onUpdateStatus(selectedOrders, selectedStatus);
      if (result) {
        setSuccess(`Successfully updated ${selectedOrders.length} orders to ${selectedStatus}`);
        setSelectedStatus('');
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      setError('An error occurred while updating orders');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedPaymentStatus || selectedOrders.length === 0) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setActiveAction('payment');
    
    try {
      const result = await onUpdatePaymentStatus(selectedOrders, selectedPaymentStatus);
      if (result) {
        setSuccess(`Successfully updated payment status for ${selectedOrders.length} orders to ${selectedPaymentStatus}`);
        setSelectedPaymentStatus('');
      } else {
        setError('Failed to update payment status');
      }
    } catch (err) {
      setError('An error occurred while updating payment status');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportOrders = async () => {
    if (selectedOrders.length === 0) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setActiveAction('export');
    
    try {
      const result = await onExportOrders(selectedOrders);
      if (result) {
        setSuccess(`Successfully exported ${selectedOrders.length} orders`);
      } else {
        setError('Failed to export orders');
      }
    } catch (err) {
      setError('An error occurred while exporting orders');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintOrders = async () => {
    if (selectedOrders.length === 0) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setActiveAction('print');
    
    try {
      const result = await onPrintOrders(selectedOrders);
      if (result) {
        setSuccess(`Successfully prepared ${selectedOrders.length} orders for printing`);
      } else {
        setError('Failed to print orders');
      }
    } catch (err) {
      setError('An error occurred while printing orders');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedOrders.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          Bulk Operations <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">{selectedOrders.length} selected</span>
        </h2>
        <Button variant="outline" size="sm" onClick={onClearSelection}>
          Clear Selection
        </Button>
      </div>
      
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />
      )}
      
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} className="mb-4" />
      )}
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Update Order Status */}
        <div className="space-y-2">
          <label htmlFor="bulkOrderStatus" className="block text-sm font-medium text-gray-700">
            Update Order Status
          </label>
          <div className="flex space-x-2">
            <select
              id="bulkOrderStatus"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Status</option>
              {orderStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <Button 
              onClick={handleUpdateStatus} 
              isLoading={isSubmitting && activeAction === 'status'}
              disabled={!selectedStatus || isSubmitting}
              size="sm"
            >
              Update
            </Button>
          </div>
        </div>
        
        {/* Update Payment Status */}
        <div className="space-y-2">
          <label htmlFor="bulkPaymentStatus" className="block text-sm font-medium text-gray-700">
            Update Payment Status
          </label>
          <div className="flex space-x-2">
            <select
              id="bulkPaymentStatus"
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Status</option>
              {paymentStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <Button 
              onClick={handleUpdatePaymentStatus} 
              isLoading={isSubmitting && activeAction === 'payment'}
              disabled={!selectedPaymentStatus || isSubmitting}
              size="sm"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
      
      {/* Export and Print */}
      <div className="mt-4 flex space-x-4">
        <Button 
          variant="outline" 
          onClick={handleExportOrders} 
          isLoading={isSubmitting && activeAction === 'export'}
          disabled={isSubmitting}
        >
          Export Orders
        </Button>
        <Button 
          variant="outline" 
          onClick={handlePrintOrders} 
          isLoading={isSubmitting && activeAction === 'print'}
          disabled={isSubmitting}
        >
          Print Orders
        </Button>
      </div>
    </div>
  );
}