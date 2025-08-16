'use client';

import React, { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { Button } from '@/components/ui';

interface OrderFiltersProps {
  onApplyFilters: (filters: OrderFilters) => void;
  onResetFilters: () => void;
  initialFilters?: OrderFilters;
  companies?: string[];
}

interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  company?: string;
  minAmount?: number;
  maxAmount?: number;
}

export function OrderFilters({
  onApplyFilters,
  onResetFilters,
  initialFilters = {},
  companies = []
}: OrderFiltersProps) {
  // Order status options
  const orderStatuses = [
    'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'
  ];

  // Payment statuses
  const paymentStatuses = [
    'Pending', 'Paid', 'Failed', 'Refunded'
  ];

  // Filter state
  const [filters, setFilters] = useState<OrderFilters>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters({});
    onResetFilters();
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button
          onClick={toggleExpand}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <FiX className="h-5 w-5" />
          ) : (
            <FiFilter className="h-5 w-5" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Order Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Order Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                {orderStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={filters.paymentStatus || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Payment Statuses</option>
                {paymentStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <select
                id="company"
                name="company"
                value={filters.company || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Companies</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                Date From
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Date To */}
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
                Date To
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Min Amount */}
            <div>
              <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700">
                Min Amount
              </label>
              <input
                type="number"
                id="minAmount"
                name="minAmount"
                value={filters.minAmount || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Max Amount */}
            <div>
              <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700">
                Max Amount
              </label>
              <input
                type="number"
                id="maxAmount"
                name="maxAmount"
                value={filters.maxAmount || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}