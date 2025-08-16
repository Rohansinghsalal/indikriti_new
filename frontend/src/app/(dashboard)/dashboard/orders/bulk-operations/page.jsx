'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiArrowLeft, FiCheck, FiFilter, FiSearch } from 'react-icons/fi';
import { BulkOrderOps } from '@/components/orders/BulkOrderOps';
import { OrderList } from '@/components/orders/OrderList';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { Button, Alert, Spinner } from '@/components/ui';
import { api } from '@/lib/api';

export default function BulkOperationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIds = searchParams.get('ids')?.split(',') || [];
  
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState(orderIds);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20 // Show more items per page for bulk operations
  });
  
  // List of companies for filter dropdown
  const [companies, setCompanies] = useState([]);

  // Fetch orders with pagination and filters
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Construct query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('page', pagination.currentPage);
        queryParams.append('limit', pagination.itemsPerPage);
        
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }
        
        // Add filters to query params
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
        
        const response = await api.get(`/orders?${queryParams.toString()}`);
        
        setOrders(response.data.orders);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItems,
          itemsPerPage: response.data.itemsPerPage
        });
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm, filters]);

  // Fetch companies for filter dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies');
        setCompanies(response.data.map(company => company.name));
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    };

    fetchCompanies();
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination(prev => ({
      ...prev,
      currentPage: 1 // Reset to first page on new search
    }));
  };

  // Handle filter changes
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({
      ...prev,
      currentPage: 1 // Reset to first page on filter change
    }));
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setFilters({});
    setPagination(prev => ({
      ...prev,
      currentPage: 1 // Reset to first page on filter reset
    }));
  };

  // Handle order selection for bulk operations
  const handleOrderSelection = (orderIds) => {
    setSelectedOrders(orderIds);
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (status) => {
    if (selectedOrders.length === 0) {
      setError('Please select at least one order to update');
      return;
    }
    
    setProcessing(true);
    setError(null);
    setSuccess(null);
    
    try {
      await api.post('/orders/bulk-update', {
        orderIds: selectedOrders,
        updates: { status }
      });
      
      setSuccess(`Successfully updated ${selectedOrders.length} orders to ${status}`);
      
      // Refresh the orders list
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.currentPage);
      queryParams.append('limit', pagination.itemsPerPage);
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await api.get(`/orders?${queryParams.toString()}`);
      setOrders(response.data.orders);
    } catch (err) {
      console.error('Error updating orders:', err);
      setError('Failed to update orders. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle bulk payment status update
  const handleBulkPaymentStatusUpdate = async (paymentStatus) => {
    if (selectedOrders.length === 0) {
      setError('Please select at least one order to update');
      return;
    }
    
    setProcessing(true);
    setError(null);
    setSuccess(null);
    
    try {
      await api.post('/orders/bulk-update', {
        orderIds: selectedOrders,
        updates: { paymentStatus }
      });
      
      setSuccess(`Successfully updated ${selectedOrders.length} orders to payment status: ${paymentStatus}`);
      
      // Refresh the orders list
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.currentPage);
      queryParams.append('limit', pagination.itemsPerPage);
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await api.get(`/orders?${queryParams.toString()}`);
      setOrders(response.data.orders);
    } catch (err) {
      console.error('Error updating orders:', err);
      setError('Failed to update payment status. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle bulk export
  const handleBulkExport = async (format) => {
    if (selectedOrders.length === 0) {
      setError('Please select at least one order to export');
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      const response = await api.post('/orders/export', {
        orderIds: selectedOrders,
        format
      }, { responseType: 'blob' });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSuccess(`Successfully exported ${selectedOrders.length} orders`);
    } catch (err) {
      console.error('Error exporting orders:', err);
      setError('Failed to export orders. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle bulk print
  const handleBulkPrint = async () => {
    if (selectedOrders.length === 0) {
      setError('Please select at least one order to print');
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      const response = await api.post('/orders/print', {
        orderIds: selectedOrders
      }, { responseType: 'blob' });
      
      // Create a print document
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const printWindow = window.open(url, '_blank');
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
      
      setSuccess(`Print document prepared for ${selectedOrders.length} orders`);
    } catch (err) {
      console.error('Error printing orders:', err);
      setError('Failed to prepare print document. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToOrders = () => {
    router.push('/orders');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button onClick={handleBackToOrders} variant="ghost" size="sm">
            <FiArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Order Operations</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative w-full max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => setShowFilters(!showFilters)} 
            variant="outline"
            size="icon"
          >
            <FiFilter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {showFilters && (
        <div className="mb-6">
          <OrderFilters
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            initialFilters={filters}
            companies={companies}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <OrderList
              orders={orders}
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onSearch={handleSearch}
              searchTerm={searchTerm}
              onOrderSelection={handleOrderSelection}
              selectedOrders={selectedOrders}
              showCheckboxes={true}
              hideActions={true}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Bulk Actions</h2>
            
            <div className="space-y-6">
              <BulkOrderOps
                selectedCount={selectedOrders.length}
                onUpdateStatus={handleBulkStatusUpdate}
                onUpdatePaymentStatus={handleBulkPaymentStatusUpdate}
                onExport={handleBulkExport}
                onPrint={handleBulkPrint}
                onClearSelection={() => setSelectedOrders([])}
                processing={processing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}