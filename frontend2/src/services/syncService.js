import OfflineStorageService from './offlineStorage';
import api from '../utils/api';

/**
 * Sync Service
 * Handles syncing offline data when connection is restored
 */

class SyncService {
  static isSyncing = false;
  static syncCallbacks = [];

  /**
   * Add callback to be called when sync status changes
   */
  static onSyncStatusChange(callback) {
    this.syncCallbacks.push(callback);
  }

  /**
   * Remove sync status callback
   */
  static removeSyncStatusCallback(callback) {
    this.syncCallbacks = this.syncCallbacks.filter(cb => cb !== callback);
  }

  /**
   * Notify all callbacks about sync status change
   */
  static notifySyncStatusChange(status) {
    this.syncCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in sync status callback:', error);
      }
    });
  }

  /**
   * Check if we're currently syncing
   */
  static getIsSyncing() {
    return this.isSyncing;
  }

  /**
   * Sync all offline data
   */
  static async syncOfflineData() {
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return { success: false, message: 'Sync already in progress' };
    }

    this.isSyncing = true;
    this.notifySyncStatusChange({ syncing: true, progress: 0 });

    try {
      console.log('Starting offline data sync...');
      
      const offlineTransactions = OfflineStorageService.getOfflineTransactions();
      const offlineInventoryUpdates = OfflineStorageService.getOfflineInventoryUpdates();
      
      const totalItems = offlineTransactions.length + offlineInventoryUpdates.length;
      let processedItems = 0;

      if (totalItems === 0) {
        console.log('No offline data to sync');
        this.isSyncing = false;
        this.notifySyncStatusChange({ syncing: false, progress: 100 });
        return { success: true, message: 'No data to sync' };
      }

      const results = {
        transactions: { success: 0, failed: 0, errors: [] },
        inventoryUpdates: { success: 0, failed: 0, errors: [] }
      };

      // Sync transactions
      for (const transaction of offlineTransactions) {
        try {
          console.log(`Syncing transaction: ${transaction.offline_id}`);
          
          // Remove offline-specific fields before sending to server
          const { offline_id, created_offline, offline_timestamp, ...transactionData } = transaction;
          
          const response = await api.post('/pos/process-transaction', transactionData);
          
          if (response.data.success) {
            // Remove from offline storage
            OfflineStorageService.removeOfflineTransaction(offline_id);
            results.transactions.success++;
            console.log(`Transaction synced successfully: ${offline_id}`);
          } else {
            results.transactions.failed++;
            results.transactions.errors.push({
              offline_id,
              error: response.data.message || 'Unknown error'
            });
          }
        } catch (error) {
          console.error(`Error syncing transaction ${transaction.offline_id}:`, error);
          results.transactions.failed++;
          results.transactions.errors.push({
            offline_id: transaction.offline_id,
            error: error.message || 'Network error'
          });
        }

        processedItems++;
        const progress = Math.round((processedItems / totalItems) * 100);
        this.notifySyncStatusChange({ syncing: true, progress });
      }

      // Sync inventory updates (if needed separately)
      for (const inventoryUpdate of offlineInventoryUpdates) {
        try {
          console.log(`Syncing inventory update: ${inventoryUpdate.offline_id}`);
          
          // For now, we'll just remove them since inventory is updated with transactions
          // In a more complex system, you might have separate inventory adjustment endpoints
          OfflineStorageService.removeOfflineInventoryUpdate(inventoryUpdate.offline_id);
          results.inventoryUpdates.success++;
          
        } catch (error) {
          console.error(`Error syncing inventory update ${inventoryUpdate.offline_id}:`, error);
          results.inventoryUpdates.failed++;
          results.inventoryUpdates.errors.push({
            offline_id: inventoryUpdate.offline_id,
            error: error.message || 'Unknown error'
          });
        }

        processedItems++;
        const progress = Math.round((processedItems / totalItems) * 100);
        this.notifySyncStatusChange({ syncing: true, progress });
      }

      // Update last sync time
      OfflineStorageService.setLastSyncTime();

      // Clear local inventory cache to force refresh
      OfflineStorageService.clearLocalInventory();

      console.log('Sync completed:', results);
      
      this.isSyncing = false;
      this.notifySyncStatusChange({ 
        syncing: false, 
        progress: 100, 
        completed: true,
        results 
      });

      return {
        success: true,
        message: 'Sync completed',
        results
      };

    } catch (error) {
      console.error('Error during sync:', error);
      this.isSyncing = false;
      this.notifySyncStatusChange({ 
        syncing: false, 
        progress: 0, 
        error: error.message 
      });

      return {
        success: false,
        message: 'Sync failed',
        error: error.message
      };
    }
  }

  /**
   * Auto-sync when connection is restored
   */
  static async autoSync() {
    // Check if we have pending offline data
    if (!OfflineStorageService.hasPendingItems()) {
      return;
    }

    // Check if we're online
    if (!navigator.onLine) {
      return;
    }

    // Try to sync
    try {
      await this.syncOfflineData();
    } catch (error) {
      console.error('Auto-sync failed:', error);
    }
  }

  /**
   * Initialize sync service
   */
  static init() {
    // More robust online/offline detection
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      console.log('Network status changed:', isOnline ? 'online' : 'offline');

      if (isOnline) {
        // Double-check with a quick API call before setting online
        this.verifyConnection().then((isActuallyOnline) => {
          if (isActuallyOnline) {
            console.log('Connection verified, switching to online mode');
            OfflineStorageService.setOfflineMode(false);
            this.autoSync();
          } else {
            console.log('Connection verification failed, staying offline');
            OfflineStorageService.setOfflineMode(true);
          }
        });
      } else {
        console.log('Browser reports offline, switching to offline mode');
        OfflineStorageService.setOfflineMode(true);
      }
    };

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial status check - be conservative, start online unless explicitly offline
    const initialOfflineMode = !navigator.onLine;
    OfflineStorageService.setOfflineMode(initialOfflineMode);

    // If browser says we're online, verify with server
    if (navigator.onLine) {
      this.verifyConnection().then((isOnline) => {
        OfflineStorageService.setOfflineMode(!isOnline);
        if (isOnline && OfflineStorageService.hasPendingItems()) {
          console.log('Found pending offline data, attempting sync...');
          setTimeout(() => this.autoSync(), 2000); // Delay to allow app to initialize
        }
      });
    }
  }

  /**
   * Verify actual connection to server
   */
  static async verifyConnection() {
    try {
      // Try a lightweight API call to verify connection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch('/api/v1/auth/me', {
        method: 'HEAD', // Lightweight request
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      clearTimeout(timeoutId);
      return response.ok || response.status === 401; // 401 means server is reachable
    } catch (error) {
      console.log('Connection verification failed:', error.message);
      return false;
    }
  }

  /**
   * Force sync (manual trigger)
   */
  static async forceSync() {
    if (!navigator.onLine) {
      throw new Error('Cannot sync while offline');
    }

    return await this.syncOfflineData();
  }

  /**
   * Get sync status
   */
  static getSyncStatus() {
    const pendingCount = OfflineStorageService.getPendingCount();
    const lastSyncTime = OfflineStorageService.getLastSyncTime();
    const isOffline = OfflineStorageService.isOfflineMode();

    return {
      isSyncing: this.isSyncing,
      isOffline,
      pendingCount,
      lastSyncTime,
      hasPendingItems: OfflineStorageService.hasPendingItems()
    };
  }
}

export default SyncService;
