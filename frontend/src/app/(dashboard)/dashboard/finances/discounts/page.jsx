'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import Table from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import Link from 'next/link';

export default function DiscountsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [discounts, setDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDiscounts, setTotalDiscounts] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    // Simulate API call to fetch discounts
    const fetchDiscounts = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock discount data
        const mockDiscounts = [
          {
            id: 'DISC-001',
            code: 'SUMMER2023',
            type: 'percentage',
            value: 15,
            status: 'active',
            startDate: '2023-06-01',
            endDate: '2023-08-31',
            usageLimit: 1000,
            usageCount: 342,
            minimumOrderAmount: 50.00,
            createdBy: 'Admin User',
            createdAt: '2023-05-15'
          },
          {
            id: 'DISC-002',
            code: 'WELCOME10',
            type: 'percentage',
            value: 10,
            status: 'active',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            usageLimit: 0, // Unlimited
            usageCount: 1256,
            minimumOrderAmount: 0,
            createdBy: 'Admin User',
            createdAt: '2023-01-01'
          },
          {
            id: 'DISC-003',
            code: 'FREESHIP',
            type: 'fixed',
            value: 10.00,
            status: 'active',
            startDate: '2023-05-01',
            endDate: '2023-07-31',
            usageLimit: 500,
            usageCount: 203,
            minimumOrderAmount: 75.00,
            createdBy: 'Marketing Manager',
            createdAt: '2023-04-25'
          },
          {
            id: 'DISC-004',
            code: 'FLASH25',
            type: 'percentage',
            value: 25,
            status: 'expired',
            startDate: '2023-04-15',
            endDate: '2023-04-17',
            usageLimit: 200,
            usageCount: 187,
            minimumOrderAmount: 100.00,
            createdBy: 'Marketing Manager',
            createdAt: '2023-04-10'
          },
          {
            id: 'DISC-005',
            code: 'VIP20',
            type: 'percentage',
            value: 20,
            status: 'active',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            usageLimit: 0, // Unlimited
            usageCount: 89,
            minimumOrderAmount: 150.00,
            createdBy: 'Admin User',
            createdAt: '2023-01-01'
          },
          {
            id: 'DISC-006',
            code: 'HOLIDAY50',
            type: 'percentage',
            value: 50,
            status: 'scheduled',
            startDate: '2023-12-20',
            endDate: '2023-12-26',
            usageLimit: 300,
            usageCount: 0,
            minimumOrderAmount: 200.00,
            createdBy: 'Marketing Manager',
            createdAt: '2023-06-01'
          },
          {
            id: 'DISC-007',
            code: 'GIFT25',
            type: 'fixed',
            value: 25.00,
            status: 'active',
            startDate: '2023-06-01',
            endDate: '2023-09-30',
            usageLimit: 500,
            usageCount: 112,
            minimumOrderAmount: 100.00,
            createdBy: 'Admin User',
            createdAt: '2023-05-20'
          },
          {
            id: 'DISC-008',
            code: 'CLEARANCE30',
            type: 'percentage',
            value: 30,
            status: 'inactive',
            startDate: '2023-07-01',
            endDate: '2023-07-15',
            usageLimit: 0, // Unlimited
            usageCount: 0,
            minimumOrderAmount: 0,
            createdBy: 'Marketing Manager',
            createdAt: '2023-06-15'
          }
        ];

        // Filter based on search term and filters
        let filteredDiscounts = mockDiscounts;

        if (searchTerm) {
          filteredDiscounts = filteredDiscounts.filter(discount =>
            discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            discount.id.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (statusFilter !== 'all') {
          filteredDiscounts = filteredDiscounts.filter(discount =>
            discount.status === statusFilter
          );
        }

        if (typeFilter !== 'all') {
          filteredDiscounts = filteredDiscounts.filter(discount =>
            discount.type === typeFilter
          );
        }

        // Calculate pagination
        const totalItems = filteredDiscounts.length;
        const totalPagesCount = Math.ceil(totalItems / itemsPerPage);

        // Get current page items
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedDiscounts = filteredDiscounts.slice(startIndex, endIndex);

        setDiscounts(paginatedDiscounts);
        setTotalPages(totalPagesCount);
        setTotalDiscounts(totalItems);
      } catch (error) {
        console.error('Error fetching discounts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscounts();
  }, [searchTerm, statusFilter, typeFilter, currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDiscountValue = (discount) => {
    if (discount.type === 'percentage') {
      return `${discount.value}%`;
    } else if (discount.type === 'fixed') {
      return `$${discount.value.toFixed(2)}`;
    }
    return discount.value;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Discount Management</h1>
        <Link href="/dashboard/finances/discounts/create">
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Discount
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by discount code or ID"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                id="type-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={typeFilter}
                onChange={handleTypeFilterChange}
              >
                <option value="all">All Types</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <Table
              data={discounts}
              keyField="id"
              className="min-w-full"
              emptyMessage="No discounts found"
              columns={[
                {
                  header: 'Code',
                  accessor: 'code',
                  className: 'font-medium',
                },
                {
                  header: 'Value',
                  accessor: (discount) => formatDiscountValue(discount),
                },
                {
                  header: 'Status',
                  accessor: (discount) => (
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(discount.status)}`}>
                      {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                    </span>
                  ),
                },
                {
                  header: 'Type',
                  accessor: (discount) =>
                    discount.type === 'percentage' ? 'Percentage' : 'Fixed Amount',
                },
                {
                  header: 'Validity Period',
                  accessor: (discount) => `${discount.startDate} to ${discount.endDate}`,
                },
                {
                  header: 'Usage',
                  accessor: (discount) =>
                    `${discount.usageCount} / ${discount.usageLimit === 0 ? '∞' : discount.usageLimit
                    }`,
                },
                {
                  header: 'Min. Order',
                  accessor: (discount) =>
                    discount.minimumOrderAmount > 0
                      ? `$${discount.minimumOrderAmount.toFixed(2)}`
                      : 'None',
                },
                {
                  header: 'Actions',
                  accessor: (discount) => (
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/finances/discounts/${discount.id}`}>
                        <Button variant="ghost" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Button>
                    </div>
                  ),
                },
              ]}
            />

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{discounts.length}</span> of{' '}
                <span className="font-medium">{totalDiscounts}</span> discounts
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </Card>

      <Card className="p-6 bg-blue-50 border border-blue-100">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Discount Management Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-blue-700">
          <li>Create time-limited discounts to create urgency</li>
          <li>Use percentage discounts for higher-priced items and fixed amounts for lower-priced items</li>
          <li>Set minimum order amounts to increase average order value</li>
          <li>Regularly review discount performance and adjust strategies accordingly</li>
          <li>Consider using unique, memorable discount codes for better customer recall</li>
        </ul>
      </Card>
    </div>
  );
}