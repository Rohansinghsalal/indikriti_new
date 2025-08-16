'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';
import Table from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import Link from 'next/link';

export default function TransactionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    // Simulate API call to fetch transactions
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        const response = await new Promise(resolve => {
          setTimeout(() => {
            const mockTransactions = [
              {
                id: 'TRX-001',
                date: '2023-06-01',
                amount: 1250.00,
                type: 'sale',
                status: 'completed',
                customer: 'John Doe',
                paymentMethod: 'Credit Card',
                reference: 'ORD-2023-001'
              },
              {
                id: 'TRX-002',
                date: '2023-06-02',
                amount: 750.50,
                type: 'sale',
                status: 'completed',
                customer: 'Jane Smith',
                paymentMethod: 'PayPal',
                reference: 'ORD-2023-002'
              },
              {
                id: 'TRX-003',
                date: '2023-06-03',
                amount: 125.00,
                type: 'refund',
                status: 'completed',
                customer: 'Alice Johnson',
                paymentMethod: 'Credit Card',
                reference: 'REF-2023-001'
              },
              {
                id: 'TRX-004',
                date: '2023-06-04',
                amount: 2100.75,
                type: 'sale',
                status: 'pending',
                customer: 'Bob Brown',
                paymentMethod: 'Bank Transfer',
                reference: 'ORD-2023-003'
              },
              {
                id: 'TRX-005',
                date: '2023-06-05',
                amount: 450.25,
                type: 'sale',
                status: 'completed',
                customer: 'Charlie Davis',
                paymentMethod: 'Credit Card',
                reference: 'ORD-2023-004'
              },
              {
                id: 'TRX-006',
                date: '2023-06-06',
                amount: 75.00,
                type: 'refund',
                status: 'pending',
                customer: 'Diana Evans',
                paymentMethod: 'PayPal',
                reference: 'REF-2023-002'
              },
              {
                id: 'TRX-007',
                date: '2023-06-07',
                amount: 1800.00,
                type: 'sale',
                status: 'failed',
                customer: 'Edward Foster',
                paymentMethod: 'Credit Card',
                reference: 'ORD-2023-005'
              },
              {
                id: 'TRX-008',
                date: '2023-06-08',
                amount: 950.50,
                type: 'sale',
                status: 'completed',
                customer: 'Fiona Grant',
                paymentMethod: 'Bank Transfer',
                reference: 'ORD-2023-006'
              },
              {
                id: 'TRX-009',
                date: '2023-06-09',
                amount: 200.00,
                type: 'payout',
                status: 'completed',
                customer: 'George Harris',
                paymentMethod: 'Bank Transfer',
                reference: 'PAY-2023-001'
              },
              {
                id: 'TRX-010',
                date: '2023-06-10',
                amount: 1500.25,
                type: 'sale',
                status: 'completed',
                customer: 'Hannah Irving',
                paymentMethod: 'Credit Card',
                reference: 'ORD-2023-007'
              },
            ];

            // Filter by search query
            let filtered = mockTransactions;
            if (searchQuery) {
              const query = searchQuery.toLowerCase();
              filtered = filtered.filter(trx =>
                trx.id.toLowerCase().includes(query) ||
                trx.customer.toLowerCase().includes(query) ||
                trx.reference.toLowerCase().includes(query)
              );
            }

            // Filter by status
            if (statusFilter !== 'all') {
              filtered = filtered.filter(trx => trx.status === statusFilter);
            }

            // Filter by type
            if (typeFilter !== 'all') {
              filtered = filtered.filter(trx => trx.type === typeFilter);
            }

            // Filter by date range
            if (dateRange.from) {
              filtered = filtered.filter(trx => new Date(trx.date) >= new Date(dateRange.from));
            }
            if (dateRange.to) {
              filtered = filtered.filter(trx => new Date(trx.date) <= new Date(dateRange.to));
            }

            // Pagination
            const totalItems = filtered.length;
            const itemsPerPage = 5;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

            resolve({
              transactions: paginatedItems,
              totalPages: totalPages
            });
          }, 1000);
        });

        setTransactions(response.transactions);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [searchQuery, currentPage, statusFilter, typeFilter, dateRange]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleTypeFilterChange = (type) => {
    setTypeFilter(type);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDateRange({ from: '', to: '' });
    setCurrentPage(1);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'sale':
        return 'bg-blue-100 text-blue-800';
      case 'refund':
        return 'bg-orange-100 text-orange-800';
      case 'payout':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by ID, customer, or reference..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={typeFilter}
              onChange={(e) => handleTypeFilterChange(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="sale">Sale</option>
              <option value="refund">Refund</option>
              <option value="payout">Payout</option>
            </select>
            <Input
              type="date"
              placeholder="From"
              value={dateRange.from}
              onChange={(e) => handleDateRangeChange('from', e.target.value)}
              className="w-32"
            />
            <Input
              type="date"
              placeholder="To"
              value={dateRange.to}
              onChange={(e) => handleDateRangeChange('to', e.target.value)}
              className="w-32"
            />
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>

        <Table
          keyField="id"
          data={transactions}
          columns={[
            { accessor: 'id', label: 'ID' },
            { accessor: 'date', label: 'Date' },
            {
              accessor: 'amount',
              label: 'Amount',
              render: (item) => `$${item.amount.toFixed(2)}`
            },
            {
              accessor: 'type',
              label: 'Type',
              render: (item) => (
                <span className={`px-2 py-1 rounded text-xs ${getTypeBadgeClass(item.type)}`}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
              )
            },
            {
              accessor: 'status',
              label: 'Status',
              render: (item) => (
                <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(item.status)}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              )
            },
            { accessor: 'customer', label: 'Customer' },
            { accessor: 'paymentMethod', label: 'Payment Method' },
            { accessor: 'reference', label: 'Reference' },
            {
              accessor: (item) => (
                <div className="flex space-x-2">
                  <Link href={`/financial/transactions/${item.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ),
              label: 'Actions'
            }
          ]}
        />


        <div className="mt-4 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </div>
  );
}