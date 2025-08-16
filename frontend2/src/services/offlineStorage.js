/**
 * Offline Storage Service
 * Handles storing and syncing POS transactions when offline
 */

const STORAGE_KEYS = {
  OFFLINE_TRANSACTIONS: 'pos_offline_transactions',
  OFFLINE_INVENTORY_UPDATES: 'pos_offline_inventory_updates',
  LAST_SYNC_TIME: 'pos_last_sync_time',
  OFFLINE_MODE: 'pos_offline_mode'
};

class OfflineStorageService {
  /**
   * Check if we're currently in offline mode
   */
  static isOfflineMode() {
    return localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE) === 'true';
  }

  /**
   * Set offline mode status
   */
  static setOfflineMode(isOffline) {
    const currentMode = this.isOfflineMode();

    // Only change mode if it's actually different
    if (currentMode !== isOffline) {
      localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, isOffline.toString());

      console.log(`Offline mode changed: ${currentMode} -> ${isOffline}`);

      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent('offlineModeChanged', {
        detail: {
          isOffline,
          previousMode: currentMode,
          timestamp: new Date().toISOString()
        }
      }));
    }
  }

  /**
   * Store a transaction offline
   */
  static storeOfflineTransaction(transactionData) {
    try {
      const offlineTransactions = this.getOfflineTransactions();
      
      // Add timestamp and unique ID for offline transaction
      const offlineTransaction = {
        ...transactionData,
        offline_id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_offline: true,
        offline_timestamp: new Date().toISOString()
      };

      offlineTransactions.push(offlineTransaction);
      localStorage.setItem(STORAGE_KEYS.OFFLINE_TRANSACTIONS, JSON.stringify(offlineTransactions));

      console.log('Transaction stored offline:', offlineTransaction.offline_id);
      return offlineTransaction;
    } catch (error) {
      console.error('Error storing offline transaction:', error);
      throw error;
    }
  }

  /**
   * Get all offline transactions
   */
  static getOfflineTransactions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_TRANSACTIONS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting offline transactions:', error);
      return [];
    }
  }

  /**
   * Store inventory update offline
   */
  static storeOfflineInventoryUpdate(inventoryUpdate) {
    try {
      const offlineUpdates = this.getOfflineInventoryUpdates();
      
      const offlineUpdate = {
        ...inventoryUpdate,
        offline_id: `inv_offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        offline_timestamp: new Date().toISOString()
      };

      offlineUpdates.push(offlineUpdate);
      localStorage.setItem(STORAGE_KEYS.OFFLINE_INVENTORY_UPDATES, JSON.stringify(offlineUpdates));

      return offlineUpdate;
    } catch (error) {
      console.error('Error storing offline inventory update:', error);
      throw error;
    }
  }

  /**
   * Get all offline inventory updates
   */
  static getOfflineInventoryUpdates() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_INVENTORY_UPDATES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting offline inventory updates:', error);
      return [];
    }
  }

  /**
   * Clear offline transactions after successful sync
   */
  static clearOfflineTransactions() {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_TRANSACTIONS);
  }

  /**
   * Clear offline inventory updates after successful sync
   */
  static clearOfflineInventoryUpdates() {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_INVENTORY_UPDATES);
  }

  /**
   * Get last sync time
   */
  static getLastSyncTime() {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
  }

  /**
   * Set last sync time
   */
  static setLastSyncTime(timestamp = new Date().toISOString()) {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, timestamp);
  }

  /**
   * Get count of pending offline items
   */
  static getPendingCount() {
    const transactions = this.getOfflineTransactions();
    const inventoryUpdates = this.getOfflineInventoryUpdates();
    
    return {
      transactions: transactions.length,
      inventoryUpdates: inventoryUpdates.length,
      total: transactions.length + inventoryUpdates.length
    };
  }

  /**
   * Check if there are pending offline items
   */
  static hasPendingItems() {
    const count = this.getPendingCount();
    return count.total > 0;
  }

  /**
   * Clear all offline data
   */
  static clearAllOfflineData() {
    this.clearOfflineTransactions();
    this.clearOfflineInventoryUpdates();
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC_TIME);
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_MODE);
  }

  /**
   * Export offline data for debugging
   */
  static exportOfflineData() {
    return {
      transactions: this.getOfflineTransactions(),
      inventoryUpdates: this.getOfflineInventoryUpdates(),
      lastSyncTime: this.getLastSyncTime(),
      isOfflineMode: this.isOfflineMode(),
      pendingCount: this.getPendingCount()
    };
  }

  /**
   * Remove a specific offline transaction by offline_id
   */
  static removeOfflineTransaction(offlineId) {
    try {
      const transactions = this.getOfflineTransactions();
      const filtered = transactions.filter(t => t.offline_id !== offlineId);
      localStorage.setItem(STORAGE_KEYS.OFFLINE_TRANSACTIONS, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing offline transaction:', error);
      return false;
    }
  }

  /**
   * Remove a specific offline inventory update by offline_id
   */
  static removeOfflineInventoryUpdate(offlineId) {
    try {
      const updates = this.getOfflineInventoryUpdates();
      const filtered = updates.filter(u => u.offline_id !== offlineId);
      localStorage.setItem(STORAGE_KEYS.OFFLINE_INVENTORY_UPDATES, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing offline inventory update:', error);
      return false;
    }
  }

  /**
   * Update local inventory quantities for offline mode
   */
  static updateLocalInventory(productId, newQuantity) {
    try {
      const localInventory = JSON.parse(localStorage.getItem('local_inventory') || '{}');
      localInventory[productId] = newQuantity;
      localStorage.setItem('local_inventory', JSON.stringify(localInventory));
    } catch (error) {
      console.error('Error updating local inventory:', error);
    }
  }

  /**
   * Get local inventory quantity for a product
   */
  static getLocalInventoryQuantity(productId) {
    try {
      const localInventory = JSON.parse(localStorage.getItem('local_inventory') || '{}');
      return localInventory[productId] || null;
    } catch (error) {
      console.error('Error getting local inventory quantity:', error);
      return null;
    }
  }

  /**
   * Clear local inventory cache
   */
  static clearLocalInventory() {
    localStorage.removeItem('local_inventory');
  }
}

export default OfflineStorageService;
