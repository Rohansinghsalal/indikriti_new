'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function POSOfflineSyncPage() {
  // State for offline transactions
  const [offlineTransactions, setOfflineTransactions] = useState([
    {
      id: 'OFF-1001',
      date: '2023-06-18T09:30:00',
      total: 78.50,
      items: 3,
      status: 'pending',
      syncAttempts: 0,
      lastSyncAttempt: null,
      cashier: 'David Wilson',
      register: 'POS-02'
    },
    {
      id: 'OFF-1002',
      date: '2023-06-18T10:15:00',
      total: 45.99,
      items: 2,
      status: 'pending',
      syncAttempts: 0,
      lastSyncAttempt: null,
      cashier: 'David Wilson',
      register: 'POS-02'
    },
    {
      id: 'OFF-1003',
      date: '2023-06-18T11:20:00',
      total: 129.99,
      items: 4,
      status: 'error',
      syncAttempts: 2,
      lastSyncAttempt: '2023-06-18T12:05:00',
      error: 'Payment validation failed',
      cashier: 'Sarah Johnson',
      register: 'POS-01'
    },
    {
      id: 'OFF-1004',
      date: '2023-06-18T14:45:00',
      total: 67.25,
      items: 3,
      status: 'synced',
      syncAttempts: 1,
      lastSyncAttempt: '2023-06-18T15:00:00',
      syncedTransactionId: 'TRX-1025',
      cashier: 'Sarah Johnson',
      register: 'POS-01'
    },
  ]);
  
  // State for sync status
  const [syncStatus, setSyncStatus] = useState({
    isSyncing: false,
    lastSyncTime: '2023-06-18T15:00:00',
    connectionStatus: 'online', // 'online', 'offline', 'unstable'
  });
  
  // State for filter
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Apply filters
  const filteredTransactions = offlineTransactions.filter(transaction => {
    if (statusFilter === 'all') return true;
    return transaction.status === statusFilter;
  });
  
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
  
  // Handle sync all transactions
  const handleSyncAll = () => {
    setSyncStatus({ ...syncStatus, isSyncing: true });
    
    // Simulate sync process
    setTimeout(() => {
      // Update transactions that are pending to synced
      const updatedTransactions = offlineTransactions.map(transaction => {
        if (transaction.status === 'pending') {
          return {
            ...transaction,
            status: 'synced',
            syncAttempts: transaction.syncAttempts + 1,
            lastSyncAttempt: new Date().toISOString(),
            syncedTransactionId: `TRX-${1000 + Math.floor(Math.random() * 1000)}`
          };
        }
        return transaction;
      });
      
      setOfflineTransactions(updatedTransactions);
      setSyncStatus({
        ...syncStatus,
        isSyncing: false,
        lastSyncTime: new Date().toISOString()
      });
    }, 2000);
  };
  
  // Handle sync single transaction
  const handleSyncTransaction = (id) => {
    // Find the transaction
    const transactionIndex = offlineTransactions.findIndex(t => t.id === id);
    if (transactionIndex === -1) return;
    
    // Create a copy of the transactions array
    const updatedTransactions = [...offlineTransactions];
    
    // Update the transaction status to 'syncing'
    updatedTransactions[transactionIndex] = {
      ...updatedTransactions[transactionIndex],
      status: 'syncing'
    };
    
    setOfflineTransactions(updatedTransactions);
    
    // Simulate sync process
    setTimeout(() => {
      // Update the transaction after sync
      updatedTransactions[transactionIndex] = {
        ...updatedTransactions[transactionIndex],
        status: 'synced',
        syncAttempts: updatedTransactions[transactionIndex].syncAttempts + 1,
        lastSyncAttempt: new Date().toISOString(),
        syncedTransactionId: `TRX-${1000 + Math.floor(Math.random() * 1000)}`
      };
      
      setOfflineTransactions(updatedTransactions);
      setSyncStatus({
        ...syncStatus,
        lastSyncTime: new Date().toISOString()
      });
    }, 1500);
  };
  
  // Handle retry sync for failed transactions
  const handleRetrySync = (id) => {
    // Find the transaction
    const transactionIndex = offlineTransactions.findIndex(t => t.id === id);
    if (transactionIndex === -1) return;
    
    // Create a copy of the transactions array
    const updatedTransactions = [...offlineTransactions];
    
    // Update the transaction status to 'syncing'
    updatedTransactions[transactionIndex] = {
      ...updatedTransactions[transactionIndex],
      status: 'syncing'
    };
    
    setOfflineTransactions(updatedTransactions);
    
    // Simulate sync process with 50% chance of success
    setTimeout(() => {
      // Update the transaction after sync attempt
      const success = Math.random() > 0.5;
      
      updatedTransactions[transactionIndex] = {
        ...updatedTransactions[transactionIndex],
        status: success ? 'synced' : 'error',
        syncAttempts: updatedTransactions[transactionIndex].syncAttempts + 1,
        lastSyncAttempt: new Date().toISOString(),
        error: success ? null : 'Payment validation failed',
        syncedTransactionId: success ? `TRX-${1000 + Math.floor(Math.random() * 1000)}` : null
      };
      
      setOfflineTransactions(updatedTransactions);
      setSyncStatus({
        ...syncStatus,
        lastSyncTime: new Date().toISOString()
      });
    }, 1500);
  };
  
  // Handle delete transaction
  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this offline transaction? This action cannot be undone.')) {
      const updatedTransactions = offlineTransactions.filter(t => t.id !== id);
      setOfflineTransactions(updatedTransactions);
    }
  };
  
  // Count transactions by status
  const pendingCount = offlineTransactions.filter(t => t.status === 'pending').length;
  const errorCount = offlineTransactions.filter(t => t.status === 'error').length;
  const syncedCount = offlineTransactions.filter(t => t.status === 'synced').length;
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">POS Offline Synchronization</h1>
        
        <div className="flex space-x-2">
          <Link href="/dashboard/pos" passHref>
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
              </svg>
              Back to POS
            </Button>
          </Link>
          
          <Button 
            onClick={handleSyncAll} 
            disabled={syncStatus.isSyncing || pendingCount === 0}
            className={syncStatus.isSyncing ? 'opacity-70 cursor-not-allowed' : ''}
          >
            {syncStatus.isSyncing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Sync All Pending
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Sync Status Card */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${syncStatus.connectionStatus === 'online' ? 'bg-green-500' : syncStatus.connectionStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
            <span className="font-medium">
              Status: <span className="capitalize">{syncStatus.connectionStatus}</span>
            </span>
          </div>
          
          <div>
            <span className="text-gray-500">Last Sync:</span>{' '}
            <span className="font-medium">{formatDate(syncStatus.lastSyncTime)}</span>
          </div>
          
          <div>
            <span className="text-gray-500">Pending Transactions:</span>{' '}
            <span className="font-medium">{pendingCount}</span>
          </div>
          
          <div>
            <span className="text-gray-500">Failed Transactions:</span>{' '}
            <span className="font-medium text-red-600">{errorCount}</span>
          </div>
        </div>
      </Card>
      
      {/* Filters */}
      <div className="flex space-x-4">
        <Button 
          variant={statusFilter === 'all' ? 'default' : 'outline'} 
          onClick={() => setStatusFilter('all')}
        >
          All ({offlineTransactions.length})
        </Button>
        <Button 
          variant={statusFilter === 'pending' ? 'default' : 'outline'} 
          onClick={() => setStatusFilter('pending')}
        >
          Pending ({pendingCount})
        </Button>
        <Button 
          variant={statusFilter === 'error' ? 'default' : 'outline'} 
          onClick={() => setStatusFilter('error')}
          className={statusFilter === 'error' ? '' : 'text-red-600'}
        >
          Failed ({errorCount})
        </Button>
        <Button 
          variant={statusFilter === 'synced' ? 'default' : 'outline'} 
          onClick={() => setStatusFilter('synced')}
        >
          Synced ({syncedCount})
        </Button>
      </div>
      
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
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cashier
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sync Details
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${transaction.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.cashier}
                      <div className="text-xs text-gray-400">{transaction.register}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.status === 'syncing' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Syncing
                        </span>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'synced' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status === 'synced' ? 'Synced' :
                           transaction.status === 'error' ? 'Failed' :
                           'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.status === 'synced' ? (
                        <div>
                          <div>Synced ID: <span className="font-medium">{transaction.syncedTransactionId}</span></div>
                          <div className="text-xs text-gray-400">Attempts: {transaction.syncAttempts}</div>
                        </div>
                      ) : transaction.status === 'error' ? (
                        <div>
                          <div className="text-red-600">{transaction.error}</div>
                          <div className="text-xs text-gray-400">Attempts: {transaction.syncAttempts}</div>
                          <div className="text-xs text-gray-400">Last attempt: {formatDate(transaction.lastSyncAttempt)}</div>
                        </div>
                      ) : (
                        <div>
                          {transaction.syncAttempts > 0 ? (
                            <div className="text-xs text-gray-400">Attempts: {transaction.syncAttempts}</div>
                          ) : (
                            <div className="text-xs text-gray-400">Not yet attempted</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {transaction.status === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleSyncTransaction(transaction.id)}
                            disabled={syncStatus.isSyncing}
                          >
                            Sync
                          </Button>
                        )}
                        
                        {transaction.status === 'error' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRetrySync(transaction.id)}
                            disabled={syncStatus.isSyncing}
                          >
                            Retry
                          </Button>
                        )}
                        
                        {transaction.status === 'synced' && (
                          <Link href={`/dashboard/pos/transactions/${transaction.syncedTransactionId}`} passHref>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          disabled={syncStatus.isSyncing}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No offline transactions found matching the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Offline Mode Information */}
      <Card className="p-6 bg-blue-50 border border-blue-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">About Offline Mode</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                When internet connectivity is unavailable, the POS system automatically operates in offline mode, storing transactions locally. Once connectivity is restored, you can synchronize these transactions with the server.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Transactions processed offline are stored securely on this device</li>
                <li>Sync regularly to ensure all transactions are properly recorded in the main system</li>
                <li>Failed syncs may require manual review and correction</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}