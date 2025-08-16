'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';
import  Table  from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import Link from 'next/link';

export default function RefundsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [refunds, setRefunds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    // Simulate API call to fetch refunds
    const fetchRefunds = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        const response = await new Promise(resolve => {
          setTimeout(() => {
            const mockRefunds = [
              {
                id: 'REF-001',
                date: '2023-06-01',
                amount: 125.00,
                status: 'completed',
                customer: 'Alice Johnson',
                reason: 'Item damaged during shipping',
                originalTransaction: 'TRX-003',
                orderNumber: 'ORD-2023-003'
              },
              {
                id: 'REF-002',
                date: '2023-06-02',
                amount: 75.00,
                status: 'pending',
                customer: 'Diana Evans',
                reason: 'Wrong item received',
                originalTransaction: 'TRX-006',
                orderNumber: 'ORD-2023-006'
              },
              {
                id: 'REF-003',
                date: '2023-06-03',
                amount: 250.00,
                status: 'completed',
                customer: 'Bob Brown',
                reason: 'Customer changed mind',
                originalTransaction: 'TRX-008',
                orderNumber: 'ORD-2023-008'
              },
              {
                id: 'REF-004',
                date: '2023-06-04',
                amount: 180.50,
                status: 'pending',
                customer: 'Charlie Davis',
                reason: 'Item not as described',
                originalTransaction: 'TRX-010',
                orderNumber: 'ORD-2023-010'
              },
              {
                id: 'REF-005',
                date: '2023-06-05',
                amount: 95.25,
                status: 'rejected',
                customer: 'Edward Foster',
                reason: 'Outside return window',
                originalTransaction: 'TRX-012',
                orderNumber: 'ORD-2023-012'
              },
              {
                id: 'REF-006',
                date: '2023-06-06',
                amount: 320.00,
                status: 'completed',
                customer: 'Fiona Grant',
                reason: 'Duplicate order',
                originalTransaction: 'TRX-015',
                orderNumber: 'ORD-2023-015'
              },
              {
                id: 'REF-007',
                date: '2023-06-07',
                amount: 150.75,
                status: 'pending',
                customer: 'George Harris',
                reason: 'Item no longer needed',
                originalTransaction: 'TRX-018',
                orderNumber: 'ORD-2023-018'
              },
              {
                id: 'REF-008',
                date: '2023-06-08',
                amount: 210.50,
                status: 'processing',
                customer: 'Hannah Irving',
                reason: 'Better price found elsewhere',
                originalTransaction: 'TRX-020',
                orderNumber: 'ORD-2023-020'
              },
              {
                id: 'REF-009',
                date: '2023-06-09',
                amount: 85.00,
                status: 'completed',
                customer: 'Ian Johnson',
                reason: 'Defective product',
                originalTransaction: 'TRX-022',
                orderNumber: 'ORD-2023-022'
              },
              {
                id: 'REF-010',
                date: '2023-06-10',
                amount: 450.25,
                status: 'pending',
                customer: 'Julia King',
                reason: 'Shipping took too long',
                originalTransaction: 'TRX-025',
                orderNumber: 'ORD-2023-025'
              },
            ];

            // Filter by search query
            let filtered = mockRefunds;
            if (searchQuery) {
              const query = searchQuery.toLowerCase();
              filtered = filtered.filter(refund =>
                refund.id.toLowerCase().includes(query) ||
                refund.customer.toLowerCase().includes(query) ||
                refund.orderNumber.toLowerCase().includes(query) ||
                refund.originalTransaction.toLowerCase().includes(query)
              );
            }

            // Filter by status
            if (statusFilter !== 'all') {
              filtered = filtered.filter(refund => refund.status === statusFilter);
            }

            // Filter by date range
            if (dateRange.from) {
              filtered = filtered.filter(refund => new Date(refund.date) >= new Date(dateRange.from));
            }
            if (dateRange.to) {
              filtered = filtered.filter(refund => new Date(refund.date) <= new Date(dateRange.to));
            }

            // Pagination
            const totalItems = filtered.length;
            const itemsPerPage = 5;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

            resolve({
              refunds: paginatedItems,
              totalPages: totalPages
            });
          }, 1000);
        });

        setRefunds(response.refunds);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching refunds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRefunds();
  }, [searchQuery, currentPage, statusFilter, dateRange]);

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
    setDateRange({ from: '', to: '' });
    setCurrentPage(1);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
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
        <h1 className="text-2xl font-bold">Refund Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-blue-50 border border-blue-200">
          <h3 className="text-lg font-medium text-blue-700 mb-2">Total Refunds</h3>
          <p className="text-3xl font-bold text-blue-800">10</p>
          <p className="text-sm text-blue-600 mt-2">Last 30 days</p>
        </Card>
        <Card className="p-6 bg-green-50 border border-green-200">
          <h3 className="text-lg font-medium text-green-700 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-800">4</p>
          <p className="text-sm text-green-600 mt-2">$780.25 refunded</p>
        </Card>
        <Card className="p-6 bg-yellow-50 border border-yellow-200">
          <h3 className="text-lg font-medium text-yellow-700 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-800">4</p>
          <p className="text-sm text-yellow-600 mt-2">$456.25 on hold</p>
        </Card>
        <Card className="p-6 bg-red-50 border border-red-200">
          <h3 className="text-lg font-medium text-red-700 mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-800">1</p>
          <p className="text-sm text-red-600 mt-2">$95.25 retained</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by ID, customer, order number..."
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
              <option value="processing">Processing</option>
              <option value="rejected">Rejected</option>
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
          data={refunds}
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Date', accessor: 'date' },
            {
              header: 'Amount',
              accessor: (item) => `$${item.amount.toFixed(2)}`,
            },
            {
              header: 'Status',
              accessor: (item) => (
                <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(item.status)}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              ),
            },
            { header: 'Customer', accessor: 'customer' },
            {
              header: 'Reason',
              accessor: (item) => (
                <span className="truncate block max-w-[150px]" title={item.reason}>
                  {item.reason}
                </span>
              ),
            },
            { header: 'Order', accessor: 'orderNumber' },
            {
              header: 'Actions',
              accessor: (item) => (
                <div className="flex space-x-2">
                  <Link href={`/financial/refunds/${item.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                  {item.status === 'pending' && (
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                      Approve
                    </Button>
                  )}
                </div>
              ),
            },
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

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Refund Policy</h2>
        <Card className="p-6">
          <div className="prose max-w-none">
            <p>Current refund policy allows for:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Full refunds within 30 days of purchase for unused items</li>
              <li>Partial refunds (up to 70%) for used or damaged items</li>
              <li>No refunds for digital products after download</li>
              <li>Shipping costs are non-refundable unless the return is due to our error</li>
            </ul>
            <p className="mt-4">All refund requests must be reviewed by a manager before processing.</p>
            <div className="mt-4">
              <Button variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Policy
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}