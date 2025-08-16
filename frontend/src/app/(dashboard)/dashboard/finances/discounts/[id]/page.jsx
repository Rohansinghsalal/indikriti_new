'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import  Loader  from '@/components/ui/Loader';
import  Table  from '@/components/ui/Table';
import Link from 'next/link';

export default function DiscountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [discount, setDiscount] = useState(null);
  const [error, setError] = useState(null);
  const [usageStats, setUsageStats] = useState({
    totalUsed: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    recentUsage: []
  });

  useEffect(() => {
    // Simulate API call to fetch discount details
    const fetchDiscountDetails = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        const response = await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Mock discount data based on ID
            if (id) {
              const mockDiscount = {
                id: id,
                code: 'SUMMER2023',
                type: 'percentage',
                value: 15,
                status: 'active',
                startDate: '2023-06-01',
                endDate: '2023-08-31',
                usageLimit: 1000,
                usageCount: 342,
                minimumOrderAmount: 50.00,
                description: 'Summer sale discount for all products. Valid from June to August 2023.',
                createdBy: 'Admin User',
                createdAt: '2023-05-15',
                lastModifiedBy: 'Marketing Manager',
                lastModifiedAt: '2023-05-20',
                applyToProducts: 'all',
                applyToCustomers: 'all',
                excludeSaleItems: true,
                allowCombination: false
              };
              resolve(mockDiscount);
            } else {
              reject(new Error('Discount not found'));
            }
          }, 1000);
        });

        setDiscount(response);

        // Fetch usage statistics
        const usageResponse = await new Promise((resolve) => {
          setTimeout(() => {
            const mockUsageStats = {
              totalUsed: 342,
              totalRevenue: 15780.45,
              averageOrderValue: 46.14,
              recentUsage: [
                {
                  id: 'ORD-1001',
                  date: '2023-06-15',
                  customer: 'John Doe',
                  orderTotal: 78.50,
                  discountAmount: 11.78
                },
                {
                  id: 'ORD-1002',
                  date: '2023-06-14',
                  customer: 'Jane Smith',
                  orderTotal: 125.00,
                  discountAmount: 18.75
                },
                {
                  id: 'ORD-1003',
                  date: '2023-06-14',
                  customer: 'Robert Johnson',
                  orderTotal: 65.99,
                  discountAmount: 9.90
                },
                {
                  id: 'ORD-1004',
                  date: '2023-06-13',
                  customer: 'Emily Davis',
                  orderTotal: 210.45,
                  discountAmount: 31.57
                },
                {
                  id: 'ORD-1005',
                  date: '2023-06-12',
                  customer: 'Michael Wilson',
                  orderTotal: 45.00,
                  discountAmount: 6.75
                }
              ]
            };
            resolve(mockUsageStats);
          }, 1200);
        });

        setUsageStats(usageResponse);
      } catch (error) {
        console.error('Error fetching discount details:', error);
        setError(error.message || 'Failed to load discount details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDiscountDetails();
    }
  }, [id]);

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

  const handleDeactivate = () => {
    // Implement deactivation logic
    console.log('Deactivating discount:', id);
  };

  const handleDelete = () => {
    // Implement deletion logic
    console.log('Deleting discount:', id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border border-red-200">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/dashboard/finances/discounts')}
          >
            Back to Discounts
          </Button>
        </Card>
      </div>
    );
  }

  if (!discount) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-yellow-50 border border-yellow-200">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">Discount Not Found</h2>
          <p className="text-yellow-600">The requested discount could not be found.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/dashboard/finances/discounts')}
          >
            Back to Discounts
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Discount: {discount.code}</h1>
          <p className="text-gray-500">Created on {discount.createdAt}</p>
        </div>
        <div className="flex space-x-2">
          <Link href={`/dashboard/finances/discounts/${id}/edit`}>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </Button>
          </Link>
          <Button variant="outline" onClick={handleDeactivate}>
            {discount.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Link href="/dashboard/finances/discounts">
            <Button variant="outline">
              Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Discount Summary Card */}
        <Card className="p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Discount Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(discount.status)}`}>
                {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Discount Value</p>
              <p className="font-bold">{formatDiscountValue(discount)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Discount Type</p>
              <p>{discount.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Minimum Order Amount</p>
              <p>{discount.minimumOrderAmount > 0 ? `$${discount.minimumOrderAmount.toFixed(2)}` : 'None'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Valid From</p>
              <p>{discount.startDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Valid Until</p>
              <p>{discount.endDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Usage</p>
              <p>{discount.usageCount} / {discount.usageLimit === 0 ? '∞' : discount.usageLimit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created By</p>
              <p>{discount.createdBy}</p>
            </div>
          </div>

          {discount.description && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
              <p>{discount.description}</p>
            </div>
          )}
        </Card>

        {/* Usage Statistics Card */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Usage Statistics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Uses</p>
              <p className="text-2xl font-bold">{usageStats.totalUsed}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue Generated</p>
              <p className="text-2xl font-bold">${usageStats.totalRevenue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Average Order Value</p>
              <p className="text-2xl font-bold">${usageStats.averageOrderValue.toFixed(2)}</p>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export Report
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Advanced Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Advanced Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Apply To Products</p>
            <p>{discount.applyToProducts === 'all' ? 'All products' : 'Specific products'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Apply To Customers</p>
            <p>{discount.applyToCustomers === 'all' ? 'All customers' : 'Specific customer groups'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Exclude Sale Items</p>
            <p>{discount.excludeSaleItems ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Allow Combination with Other Discounts</p>
            <p>{discount.allowCombination ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </Card>

      {/* Recent Usage */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Usage</h2>
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Order ID</Table.Head>
                <Table.Head>Date</Table.Head>
                <Table.Head>Customer</Table.Head>
                <Table.Head>Order Total</Table.Head>
                <Table.Head>Discount Amount</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {usageStats.recentUsage.length > 0 ? (
                usageStats.recentUsage.map((usage) => (
                  <Table.Row key={usage.id}>
                    <Table.Cell className="font-medium">{usage.id}</Table.Cell>
                    <Table.Cell>{usage.date}</Table.Cell>
                    <Table.Cell>{usage.customer}</Table.Cell>
                    <Table.Cell>${usage.orderTotal.toFixed(2)}</Table.Cell>
                    <Table.Cell>${usage.discountAmount.toFixed(2)}</Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-4">No usage data available</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            View All Usage
          </Button>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={handleDelete}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Delete Discount
        </Button>
        <Link href={`/dashboard/finances/discounts/${id}/edit`}>
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Discount
          </Button>
        </Link>
      </div>
    </div>
  );
}