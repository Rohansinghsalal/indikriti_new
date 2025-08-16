import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FiFileText, 
  FiEye, 
  FiDownload, 
  FiFilter, 
  FiSearch, 
  FiPlus,
  FiRefreshCw,
  FiWifi,
  FiWifiOff,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle
} from 'react-icons/fi';
import { Card, Button, Input } from '../components/ui';
import toast from 'react-hot-toast';
import api from '../utils/api';
import OfflineStorageService from '../services/offlineStorage';
import SyncService from '../services/syncService';
import OfflineTestComponent from '../components/OfflineTestComponent';

export default function Invoices() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [stats, setStats] = useState({
    total_invoices: 0,
    paid_invoices: 0,
    pending_invoices: 0,
    overdue_invoices: 0,
    total_revenue: 0,
    pending_amount: 0
  });
  
  // Offline sync states
  const [isOffline, setIsOffline] = useState(OfflineStorageService.isOfflineMode());
  const [syncStatus, setSyncStatus] = useState(SyncService.getSyncStatus());
  const [showSyncModal, setShowSyncModal] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchInvoiceStats();
  }, [statusFilter, pagination.page]);

  useEffect(() => {
    // Listen for offline mode changes
    const handleOfflineModeChange = (event) => {
      setIsOffline(event.detail.isOffline);
      setSyncStatus(SyncService.getSyncStatus());
    };

    // Listen for sync status changes
    const handleSyncStatusChange = (status) => {
      setSyncStatus(prev => ({ ...prev, ...status }));
      
      if (status.completed) {
        toast.success('Invoices synced successfully!');
        fetchInvoices(); // Refresh invoices after sync
        fetchInvoiceStats();
      } else if (status.error) {
        toast.error(`Sync failed: ${status.error}`);
      }
    };

    window.addEventListener('offlineModeChanged', handleOfflineModeChange);
    SyncService.onSyncStatusChange(handleSyncStatusChange);

    return () => {
      window.removeEventListener('offlineModeChanged', handleOfflineModeChange);
      SyncService.removeSyncStatusCallback(handleSyncStatusChange);
    };
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await api.get(`/invoices?${params}`);

      if (response.data.success) {
        setInvoices(response.data.data);
        setPagination(response.data.pagination);
      } else {
        toast.error('Failed to fetch invoices');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);

      // Determine error type and show appropriate message
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        // Redirect to login after a delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to view invoices');
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (isOffline || !navigator.onLine) {
        toast.error('Cannot fetch invoices while offline');
      } else if (error.name === 'TypeError' || error.message.includes('fetch')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Error loading invoices. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceStats = async () => {
    try {
      const response = await api.get('/invoices/stats');

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching invoice stats:', error);
      // Don't show error toast for stats as it's not critical
      // Just log the error and continue
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchInvoices();
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Update URL params
    if (status === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
  };

  const handleManualSync = async () => {
    if (!navigator.onLine) {
      toast.error('Cannot sync while offline');
      return;
    }

    try {
      const result = await SyncService.forceSync();
      if (result.success) {
        toast.success('Sync completed successfully');
      } else {
        toast.error(result.message || 'Sync failed');
      }
    } catch (error) {
      toast.error('Sync failed: ' + error.message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'sent':
        return <FiClock className="w-4 h-4 text-yellow-500" />;
      case 'overdue':
        return <FiAlertCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <FiXCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <FiFileText className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600">Manage and track all your invoices</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Sync Status */}
          <div className="flex items-center space-x-2">
            {isOffline ? (
              <FiWifiOff className="w-4 h-4 text-red-500" />
            ) : (
              <FiWifi className="w-4 h-4 text-green-500" />
            )}
            <span className="text-sm text-gray-600">
              {isOffline ? 'Offline' : 'Online'}
            </span>
            
            {syncStatus.hasPendingItems && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-yellow-600">
                  {syncStatus.pendingCount.total} pending
                </span>
              </div>
            )}
          </div>

          {/* Sync Button */}
          {syncStatus.hasPendingItems && !isOffline && (
            <Button
              onClick={handleManualSync}
              disabled={syncStatus.isSyncing}
              size="sm"
              variant="outline"
            >
              <FiRefreshCw className={`w-4 h-4 mr-2 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
              {syncStatus.isSyncing ? 'Syncing...' : 'Sync'}
            </Button>
          )}

          <Button onClick={() => setShowSyncModal(true)} variant="outline" size="sm">
            Sync Status
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiFileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_invoices}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.paid_invoices}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending_invoices}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiFileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_revenue)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>

          {/* Status Filters */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex space-x-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'paid', label: 'Paid' },
                { key: 'sent', label: 'Pending' },
                { key: 'overdue', label: 'Overdue' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map((filter) => (
                <Button
                  key={filter.key}
                  onClick={() => handleStatusFilter(filter.key)}
                  variant={statusFilter === filter.key ? 'primary' : 'outline'}
                  size="sm"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Invoice List */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Invoices</h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <FiRefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading invoices...</span>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Invoices will appear here when you process POS transactions'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiFileText className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {invoice.invoice_number}
                            </div>
                            {invoice.transaction_id && (
                              <div className="text-sm text-gray-500">
                                Transaction #{invoice.transaction_id}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {invoice.customer_name || 'Walk-in Customer'}
                        </div>
                        {invoice.customer_email && (
                          <div className="text-sm text-gray-500">
                            {invoice.customer_email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(invoice.total_amount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Subtotal: {formatCurrency(invoice.subtotal)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1 capitalize">{invoice.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500">
                          {new Date(invoice.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/invoices/${invoice.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => {/* TODO: Download PDF */}}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <FiDownload className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FiFileText className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">
                        {invoice.invoice_number}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1 capitalize">{invoice.status}</span>
                    </span>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="text-gray-900">{invoice.customer_name || 'Walk-in Customer'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(invoice.total_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">{new Date(invoice.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 mt-3">
                    <Link
                      to={`/invoices/${invoice.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FiEye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {/* TODO: Download PDF */}}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} results
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>

                    <span className="text-sm text-gray-700">
                      Page {pagination.page} of {pagination.pages}
                    </span>

                    <Button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.pages}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Sync Status Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sync Status</h3>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Connection Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connection:</span>
                <div className="flex items-center space-x-2">
                  {isOffline ? (
                    <FiWifiOff className="w-4 h-4 text-red-500" />
                  ) : (
                    <FiWifi className="w-4 h-4 text-green-500" />
                  )}
                  <span className={`text-sm ${isOffline ? 'text-red-600' : 'text-green-600'}`}>
                    {isOffline ? 'Offline' : 'Online'}
                  </span>
                </div>
              </div>

              {/* Pending Items */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending Items:</span>
                <span className="text-sm text-gray-600">
                  {syncStatus.pendingCount.total} total
                  ({syncStatus.pendingCount.transactions} transactions)
                </span>
              </div>

              {/* Last Sync */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Sync:</span>
                <span className="text-sm text-gray-600">
                  {syncStatus.lastSyncTime
                    ? new Date(syncStatus.lastSyncTime).toLocaleString()
                    : 'Never'
                  }
                </span>
              </div>

              {/* Sync Progress */}
              {syncStatus.isSyncing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress:</span>
                    <span className="text-sm text-blue-600">{syncStatus.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${syncStatus.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-4">
                {syncStatus.hasPendingItems && !isOffline && (
                  <Button
                    onClick={handleManualSync}
                    disabled={syncStatus.isSyncing}
                    size="sm"
                    className="flex-1"
                  >
                    <FiRefreshCw className={`w-4 h-4 mr-2 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                    {syncStatus.isSyncing ? 'Syncing...' : 'Sync Now'}
                  </Button>
                )}

                <Button
                  onClick={() => setShowSyncModal(false)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Testing Component (for development/testing) */}
      <div className="mt-8">
        <OfflineTestComponent />
      </div>
    </div>
  );
}
