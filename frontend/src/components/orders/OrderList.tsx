'use client';

import React, { useState } from 'react';
import { FiEdit, FiEye, FiFilter, FiSearch } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import Link from 'next/link';

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} orderNumber
 * @property {string} customerId
 * @property {string} customerName
 * @property {string} customerEmail
 * @property {number} total
 * @property {string} status
 * @property {string} paymentStatus
 * @property {string} paymentMethod
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} company
 */

/**
 * @param {Object} props
 * @param {Order[]} props.orders
 * @param {boolean} props.isLoading
 * @param {function(Order): void} props.onViewOrder
 * @param {function(Order): void} props.onEditOrder
 * @param {number} props.currentPage
 * @param {number} props.totalPages
 * @param {function(number): void} props.onPageChange
 * @param {function(string): void} props.onSearch
 * @param {function({status?: string, company?: string}): void} props.onFilterChange
 */

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

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  onViewOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  onFilterChange: (filter: { status?: string; company?: string }) => void;
}


export function OrderList({
  orders,
  isLoading,
  onViewOrder,
  onEditOrder,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onFilterChange,
}: OrderListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  
  // Order statuses
  const orderStatuses = [
    'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'
  ];

  // Companies (should be passed as prop in real implementation)
  const companies = [
    'Company A', 'Company B', 'Company C'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setSelectedStatus(status);
    onFilterChange({ status, company: selectedCompany });
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const company = e.target.value;
    setSelectedCompany(company);
    onFilterChange({ status: selectedStatus, company });
  };

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

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search orders by order number or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="flex space-x-4">
          <div className="w-40">
            <select
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="">All Statuses</option>
              {orderStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="w-40">
            <select
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={selectedCompany}
              onChange={handleCompanyChange}
            >
              <option value="">All Companies</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-indigo-600">#{order.orderNumber}</div>
                    <div className="text-xs text-gray-500">{order.company}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.paymentStatus)}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => onViewOrder(order)}
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      <button 
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => onEditOrder(order)}
                      >
                        <FiEdit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page {currentPage} of {totalPages}
                </p>
              </div>
              <div>
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={onPageChange} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}