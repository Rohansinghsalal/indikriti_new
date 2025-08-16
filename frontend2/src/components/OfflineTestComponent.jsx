import React, { useState, useEffect } from 'react';
import { Button, Card } from './ui';
import { FiWifi, FiWifiOff, FiRefreshCw, FiDatabase } from 'react-icons/fi';
import toast from 'react-hot-toast';
import OfflineStorageService from '../services/offlineStorage';
import SyncService from '../services/syncService';

export default function OfflineTestComponent() {
  const [isOffline, setIsOffline] = useState(OfflineStorageService.isOfflineMode());
  const [syncStatus, setSyncStatus] = useState(SyncService.getSyncStatus());
  const [offlineData, setOfflineData] = useState(OfflineStorageService.exportOfflineData());

  useEffect(() => {
    // Listen for offline mode changes
    const handleOfflineModeChange = (event) => {
      setIsOffline(event.detail.isOffline);
      updateData();
    };

    // Listen for sync status changes
    const handleSyncStatusChange = (status) => {
      setSyncStatus(prev => ({ ...prev, ...status }));
      updateData();
      
      if (status.completed) {
        toast.success('Test sync completed!');
      } else if (status.error) {
        toast.error(`Test sync failed: ${status.error}`);
      }
    };

    window.addEventListener('offlineModeChanged', handleOfflineModeChange);
    SyncService.onSyncStatusChange(handleSyncStatusChange);

    return () => {
      window.removeEventListener('offlineModeChanged', handleOfflineModeChange);
      SyncService.removeSyncStatusCallback(handleSyncStatusChange);
    };
  }, []);

  const updateData = () => {
    setSyncStatus(SyncService.getSyncStatus());
    setOfflineData(OfflineStorageService.exportOfflineData());
  };

  const simulateOfflineTransaction = () => {
    const testTransaction = {
      items: [
        {
          product_id: 1,
          quantity: 1,
          unit_price: 15.99,
          discount_amount: 0
        }
      ],
      customer: {
        name: 'Test Customer',
        phone: '1234567890',
        email: 'test@example.com'
      },
      subtotal: 15.99,
      discount_amount: 0,
      tax_rate: 18,
      tax_amount: 2.88,
      total_amount: 18.87,
      payment_method: 'cash',
      notes: 'Test offline transaction'
    };

    try {
      const offlineTransaction = OfflineStorageService.storeOfflineTransaction(testTransaction);
      toast.success(`Test transaction stored offline: ${offlineTransaction.offline_id.slice(-8)}`);
      updateData();
    } catch (error) {
      toast.error('Failed to store test transaction');
    }
  };

  const toggleOfflineMode = () => {
    const newOfflineMode = !isOffline;
    OfflineStorageService.setOfflineMode(newOfflineMode);
    toast.info(`Switched to ${newOfflineMode ? 'offline' : 'online'} mode`);
  };

  const clearOfflineData = () => {
    if (window.confirm('Are you sure you want to clear all offline data?')) {
      OfflineStorageService.clearAllOfflineData();
      toast.success('Offline data cleared');
      updateData();
    }
  };

  const forceSync = async () => {
    if (!navigator.onLine) {
      toast.error('Cannot sync while offline');
      return;
    }

    try {
      const result = await SyncService.forceSync();
      if (result.success) {
        toast.success('Force sync completed');
      } else {
        toast.error(result.message || 'Force sync failed');
      }
    } catch (error) {
      toast.error('Force sync failed: ' + error.message);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Offline Functionality Test</h3>
          <div className="flex items-center space-x-2">
            {isOffline ? (
              <FiWifiOff className="w-5 h-5 text-red-500" />
            ) : (
              <FiWifi className="w-5 h-5 text-green-500" />
            )}
            <span className={`text-sm font-medium ${isOffline ? 'text-red-600' : 'text-green-600'}`}>
              {isOffline ? 'Offline Mode' : 'Online Mode'}
            </span>
          </div>
        </div>

        {/* Status Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Connection Status</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Browser Online:</span>
                <span className={navigator.onLine ? 'text-green-600' : 'text-red-600'}>
                  {navigator.onLine ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">App Offline Mode:</span>
                <span className={isOffline ? 'text-red-600' : 'text-green-600'}>
                  {isOffline ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Sync Status</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Items:</span>
                <span className="text-gray-900">{syncStatus.pendingCount.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Is Syncing:</span>
                <span className={syncStatus.isSyncing ? 'text-blue-600' : 'text-gray-900'}>
                  {syncStatus.isSyncing ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Sync:</span>
                <span className="text-gray-900">
                  {syncStatus.lastSyncTime 
                    ? new Date(syncStatus.lastSyncTime).toLocaleTimeString()
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Offline Data Summary */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Offline Data</h4>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Transactions:</span>
                <span className="ml-2 font-medium">{offlineData.transactions.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Inventory Updates:</span>
                <span className="ml-2 font-medium">{offlineData.inventoryUpdates.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Progress */}
        {syncStatus.isSyncing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sync Progress:</span>
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

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            onClick={simulateOfflineTransaction}
            size="sm"
            className="text-xs"
          >
            <FiDatabase className="w-3 h-3 mr-1" />
            Add Test Transaction
          </Button>

          <Button
            onClick={toggleOfflineMode}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {isOffline ? <FiWifi className="w-3 h-3 mr-1" /> : <FiWifiOff className="w-3 h-3 mr-1" />}
            Toggle Mode
          </Button>

          <Button
            onClick={forceSync}
            disabled={syncStatus.isSyncing || isOffline}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <FiRefreshCw className={`w-3 h-3 mr-1 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
            Force Sync
          </Button>

          <Button
            onClick={clearOfflineData}
            variant="outline"
            size="sm"
            className="text-xs text-red-600 hover:text-red-700"
          >
            Clear Data
          </Button>
        </div>

        {/* Offline Transactions List */}
        {offlineData.transactions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Pending Offline Transactions</h4>
            <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
              {offlineData.transactions.map((transaction, index) => (
                <div key={transaction.offline_id} className="text-xs text-gray-600 mb-1">
                  {index + 1}. {transaction.offline_id.slice(-8)} - ₹{transaction.total_amount} 
                  ({new Date(transaction.offline_timestamp).toLocaleTimeString()})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
