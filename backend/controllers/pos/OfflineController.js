/**
 * Offline POS Controller - Handles offline POS functionality
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

/**
 * Get offline sync data
 */
exports.getOfflineSyncData = async (req, res) => {
  try {
    // Mock data for offline sync
    const syncData = {
      products: [
        { id: 1, name: 'Product 1', sku: 'SKU001', price: 19.99, stock: 100, category: 'Electronics' },
        { id: 2, name: 'Product 2', sku: 'SKU002', price: 29.99, stock: 75, category: 'Clothing' },
        { id: 3, name: 'Product 3', sku: 'SKU003', price: 9.99, stock: 50, category: 'Books' }
      ],
      customers: [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' }
      ],
      discounts: [
        { id: 1, code: 'SUMMER2023', type: 'percentage', value: 20 },
        { id: 2, code: 'WELCOME10', type: 'fixed', value: 10 }
      ],
      taxes: [
        { id: 1, name: 'Standard Rate', rate: 20 },
        { id: 2, name: 'Reduced Rate', rate: 5 }
      ],
      last_sync: new Date()
    };
    
    return res.json({
      success: true,
      data: syncData
    });
  } catch (error) {
    logger.error('Error fetching offline sync data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch offline sync data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Upload offline transactions
 */
exports.uploadOfflineTransactions = async (req, res) => {
  try {
    const { transactions } = req.body;
    
    // In a real app, we would process and save these transactions
    
    return res.json({
      success: true,
      message: 'Offline transactions uploaded successfully',
      data: {
        processed: transactions?.length || 0,
        sync_date: new Date()
      }
    });
  } catch (error) {
    logger.error('Error uploading offline transactions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload offline transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update offline config
 */
exports.updateOfflineConfig = async (req, res) => {
  try {
    const { 
      enabled, 
      sync_interval,
      max_offline_time,
      sync_products,
      sync_customers 
    } = req.body;
    
    // In a real app, we would update the configuration
    
    return res.json({
      success: true,
      message: 'Offline configuration updated successfully',
      data: {
        enabled: enabled ?? true,
        sync_interval: sync_interval ?? 60, // minutes
        max_offline_time: max_offline_time ?? 24, // hours
        sync_products: sync_products ?? true,
        sync_customers: sync_customers ?? true,
        updated_at: new Date()
      }
    });
  } catch (error) {
    logger.error('Error updating offline config:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update offline config',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
