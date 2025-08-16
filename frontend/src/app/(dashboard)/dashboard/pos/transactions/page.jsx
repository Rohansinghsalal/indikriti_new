'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function POSTransactionsPage() {
  // State for transactions, filters, and pagination
  const [transactions, setTransactions] = useState([
    {
      id: 'TRX-1001',
      date: '2023-06-15T14:30:00',
      customer: { name: 'John Doe', id: 'CUST-101' },
      total: 129.99,
      items: 3,
      paymentMethod: 'Credit Card',
      status: 'completed',
      cashier: 'Sarah Johnson'
    },
    {
      id: 'TRX-1002',
      date: '2023-06-15T15:45:00',
      customer: { name: 'Jane Smith', id: 'CUST-102' },
      total: 79.50,
      items: 2,
      paymentMethod: 'Cash',
      status: 'completed',
      cashier: 'Sarah Johnson'
    },
    {
      id: 'TRX-1003',
      date: '2023-06-15T16:20:00',
      customer: { name: 'Michael Brown', id: 'CUST-103' },
      total: 45.75,
      items: 1,
      paymentMethod: 'Mobile Payment',
      status: 'completed',
      cashier: 'David Wilson'
    },
    {
      id: 'TRX-1004',
      date: '2023-06-15T17:10:00',
      customer: null, // Walk-in customer
      total: 199.99,
      items: 4,
      paymentMethod: 'Credit Card',
      status: 'completed',
      cashier: 'David Wilson'
    },
    {
      id: 'TRX-1005',
      date: '2023-06-15T18:05:00',
      customer: { name: 'Emily Davis', id: 'CUST-104' },
      total: 67.25,
      items: 3,
      paymentMethod: 'Cash',
      status: 'completed',
      cashier: 'Sarah Johnson'
    },
    {
      id: 'TRX-1006',
      date: '2023-06-16T10:15:00',
      customer: { name: 'Robert Miller', id: 'CUST-105' },
      total: 149.99,
      items: 2,
      paymentMethod: 'Credit Card',
      status: 'completed',
      cashier: 'Sarah Johnson'
    },
    {
      id: 'TRX-1007',
      date: '2023-06-16T11:30:00',
      customer: null, // Walk-in customer
      total: 35.50,
      items: 1,
      paymentMethod: 'Cash',
      status: 'completed',
      cashier: 'David Wilson'
    },
    {
      id: 'TRX-1008',
      date: '2023-06-16T12:45:00',
      customer: { name: 'Jennifer Wilson', id: 'CUST-106' },
      total: 89.99,
      items: 3,
      paymentMethod: 'Mobile Payment',
      status: 'completed',
      cashier: 'David Wilson'
    },
    {
      id: 'TRX-1009',
      date: '2023-06-16T14:20:00',
      customer: { name: 'William Taylor', id: 'CUST-107' },
      total: 120.75,
      items: 4,
      paymentMethod: 'Credit Card',
      status: 'voided',
      cashier: 'Sarah Johnson'
    },
    {
      id: 'TRX-1010',
      date: '2023-06-16T15:40:00',
      customer: { name: 'Elizabeth Anderson', id: 'CUST-108' },
      total: 55.25,
      items: 2,
      paymentMethod: 'Cash',
      status: 'completed',
      cashier: 'Sarah Johnson'
    },
  ]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [cashierFilter, setCashierFilter] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Apply filters to transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search query filter (transaction ID or customer name)
    const searchMatch = searchQuery === '' || 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.customer && transaction.customer.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const statusMatch = statusFilter === 'all' || transaction.status === statusFilter;
    
    // Payment method filter
    const paymentMatch = paymentMethodFilter === 'all' || 
      transaction.paymentMethod.toLowerCase().replace(' ', '_') === paymentMethodFilter;
    
    // Cashier filter
    const cashierMatch = cashierFilter === 'all' || transaction.cashier === cashierFilter;
    
    // Date range filter
    let dateMatch = true;
    if (dateRangeFilter.startDate) {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateRangeFilter.startDate);
      dateMatch = transactionDate >= startDate;
    }
    if (dateRangeFilter.endDate && dateMatch) {
      const transactionDate = new Date(transaction.date);
      const endDate = new Date(dateRangeFilter.endDate);
      // Set end date to end of day
      endDate.setHours(23, 59, 59, 999);
      dateMatch = transactionDate <= endDate;
    }
    
    return searchMatch && statusMatch && paymentMatch && cashierMatch && dateMatch;
  });
  
  // Get unique cashiers for filter
  const uniqueCashiers = [...new Set(transactions.map(t => t.cashier))];
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPaymentMethodFilter('all');
    setCashierFilter('all');
    setDateRangeFilter({
      startDate: '',
      endDate: ''
    });
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">POS Transactions</h1>
        
        <div className="flex space-x-2">
          <Link href="/dashboard/pos" passHref>
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
              </svg>
              Back to POS
            </Button>
          </Link>
          
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Transaction ID or customer"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="voided">Voided</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <option value="all">All Payment Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="cash">Cash</option>
              <option value="mobile_payment">Mobile Payment</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="cashier" className="block text-sm font-medium text-gray-700 mb-1">
              Cashier
            </label>
            <select
              id="cashier"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={cashierFilter}
              onChange={(e) => setCashierFilter(e.target.value)}
            >
              <option value="all">All Cashiers</option>
              {uniqueCashiers.map(cashier => (
                <option key={cashier} value={cashier}>{cashier}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={dateRangeFilter.startDate}
              onChange={(e) => setDateRangeFilter({...dateRangeFilter, startDate: e.target.value})}
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={dateRangeFilter.endDate}
              onChange={(e) => setDateRangeFilter({...dateRangeFilter, endDate: e.target.value})}
            />
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Transactions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cashier
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTransactions.length > 0 ? (
                currentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/dashboard/pos/transactions/${transaction.id}`}>
                        {transaction.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.customer ? transaction.customer.name : 'Walk-in Customer'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${transaction.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.cashier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'voided' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/dashboard/pos/transactions/${transaction.id}`} passHref>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          Print
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {indexOfLastItem > filteredTransactions.length ? filteredTransactions.length : indexOfLastItem}
                  </span>{' '}
                  of <span className="font-medium">{filteredTransactions.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(totalPages).keys()].map(number => (
                    <button
                      key={number + 1}
                      onClick={() => handlePageChange(number + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {number + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}