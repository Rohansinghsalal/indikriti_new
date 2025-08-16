/**
 * Real-Time Inventory Service - Handles inventory management with Socket.io updates
 */

const { Product, POSTransaction, POSTransactionItem } = require('../models');
const { sequelize } = require('../database/connection');
const logger = require('../utils/logger');

class RealTimeInventoryService {
  /**
   * Get all products with stock information
   */
  static async getAllProductsWithStock() {
    try {
      const products = await Product.findAll({
        attributes: [
          'id', 'product_id', 'sku', 'name', 'description', 
          'mrp', 'selling_price', 'stock_quantity', 'brand', 'status',
          'created_at', 'updated_at'
        ],
        order: [['name', 'ASC']]
      });

      return {
        success: true,
        data: products
      };
    } catch (error) {
      logger.error('Error fetching products with stock:', error);
      return {
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      };
    }
  }

  /**
   * Get low stock products (below minimum threshold)
   */
  static async getLowStockProducts(threshold = 10) {
    try {
      const { Op } = require('sequelize');
      
      const products = await Product.findAll({
        where: {
          stock_quantity: {
            [Op.lte]: threshold
          },
          status: 'active'
        },
        attributes: [
          'id', 'product_id', 'sku', 'name', 'stock_quantity', 'brand'
        ],
        order: [['stock_quantity', 'ASC']]
      });

      return {
        success: true,
        data: products
      };
    } catch (error) {
      logger.error('Error fetching low stock products:', error);
      return {
        success: false,
        message: 'Failed to fetch low stock products',
        error: error.message
      };
    }
  }

  /**
   * Add stock to a product
   */
  static async addStock(productId, quantity, reason = 'Manual addition', userId) {
    const transaction = await sequelize.transaction();
    
    try {
      const product = await Product.findByPk(productId, { transaction });
      
      if (!product) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Product not found'
        };
      }

      const oldQuantity = product.stock_quantity;
      const newQuantity = oldQuantity + parseInt(quantity);

      await product.update({
        stock_quantity: newQuantity
      }, { transaction });

      await transaction.commit();

      // Emit real-time update
      if (global.io) {
        global.io.to('inventory').emit('inventory-updated', {
          type: 'stock-addition',
          product_id: product.id,
          product_name: product.name,
          sku: product.sku,
          old_quantity: oldQuantity,
          new_quantity: newQuantity,
          quantity_added: parseInt(quantity),
          reason,
          updated_by: userId
        });
      }

      return {
        success: true,
        message: 'Stock added successfully',
        data: {
          product_id: product.id,
          product_name: product.name,
          old_quantity: oldQuantity,
          new_quantity: newQuantity,
          quantity_added: parseInt(quantity)
        }
      };

    } catch (error) {
      await transaction.rollback();
      logger.error('Error adding stock:', error);
      return {
        success: false,
        message: 'Failed to add stock',
        error: error.message
      };
    }
  }

  /**
   * Remove stock from a product
   */
  static async removeStock(productId, quantity, reason = 'Manual removal', userId) {
    const transaction = await sequelize.transaction();
    
    try {
      const product = await Product.findByPk(productId, { transaction });
      
      if (!product) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Product not found'
        };
      }

      const oldQuantity = product.stock_quantity;
      const quantityToRemove = parseInt(quantity);

      if (oldQuantity < quantityToRemove) {
        await transaction.rollback();
        return {
          success: false,
          message: `Insufficient stock. Available: ${oldQuantity}, Requested: ${quantityToRemove}`
        };
      }

      const newQuantity = oldQuantity - quantityToRemove;

      await product.update({
        stock_quantity: newQuantity
      }, { transaction });

      await transaction.commit();

      // Emit real-time update
      if (global.io) {
        global.io.to('inventory').emit('inventory-updated', {
          type: 'stock-removal',
          product_id: product.id,
          product_name: product.name,
          sku: product.sku,
          old_quantity: oldQuantity,
          new_quantity: newQuantity,
          quantity_removed: quantityToRemove,
          reason,
          updated_by: userId
        });
      }

      return {
        success: true,
        message: 'Stock removed successfully',
        data: {
          product_id: product.id,
          product_name: product.name,
          old_quantity: oldQuantity,
          new_quantity: newQuantity,
          quantity_removed: quantityToRemove
        }
      };

    } catch (error) {
      await transaction.rollback();
      logger.error('Error removing stock:', error);
      return {
        success: false,
        message: 'Failed to remove stock',
        error: error.message
      };
    }
  }

  /**
   * Update stock quantity directly
   */
  static async updateStock(productId, newQuantity, reason = 'Manual update', userId) {
    const transaction = await sequelize.transaction();
    
    try {
      const product = await Product.findByPk(productId, { transaction });
      
      if (!product) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Product not found'
        };
      }

      const oldQuantity = product.stock_quantity;
      const quantity = parseInt(newQuantity);

      if (quantity < 0) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Stock quantity cannot be negative'
        };
      }

      await product.update({
        stock_quantity: quantity
      }, { transaction });

      await transaction.commit();

      // Emit real-time update
      if (global.io) {
        global.io.to('inventory').emit('inventory-updated', {
          type: 'stock-update',
          product_id: product.id,
          product_name: product.name,
          sku: product.sku,
          old_quantity: oldQuantity,
          new_quantity: quantity,
          quantity_changed: quantity - oldQuantity,
          reason,
          updated_by: userId
        });
      }

      return {
        success: true,
        message: 'Stock updated successfully',
        data: {
          product_id: product.id,
          product_name: product.name,
          old_quantity: oldQuantity,
          new_quantity: quantity,
          quantity_changed: quantity - oldQuantity
        }
      };

    } catch (error) {
      await transaction.rollback();
      logger.error('Error updating stock:', error);
      return {
        success: false,
        message: 'Failed to update stock',
        error: error.message
      };
    }
  }

  /**
   * Get inventory summary statistics
   */
  static async getInventorySummary() {
    try {
      const { Op } = require('sequelize');
      
      const [
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        lowStockProducts,
        totalStockValue
      ] = await Promise.all([
        Product.count({ where: { status: 'active' } }),
        Product.count({ 
          where: { 
            status: 'active',
            stock_quantity: { [Op.gt]: 0 }
          }
        }),
        Product.count({ 
          where: { 
            status: 'active',
            stock_quantity: 0
          }
        }),
        Product.count({ 
          where: { 
            status: 'active',
            stock_quantity: { [Op.between]: [1, 10] }
          }
        }),
        Product.sum('stock_quantity', { where: { status: 'active' } })
      ]);

      return {
        success: true,
        data: {
          total_products: totalProducts || 0,
          in_stock_products: inStockProducts || 0,
          out_of_stock_products: outOfStockProducts || 0,
          low_stock_products: lowStockProducts || 0,
          total_stock_quantity: totalStockValue || 0
        }
      };

    } catch (error) {
      logger.error('Error fetching inventory summary:', error);
      return {
        success: false,
        message: 'Failed to fetch inventory summary',
        error: error.message
      };
    }
  }
}

module.exports = RealTimeInventoryService;
