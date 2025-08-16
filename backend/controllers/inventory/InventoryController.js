const ProductService = require('../../services/ProductService');
const { authenticateToken, requireRole } = require('../../middleware/auth');

class InventoryController {
  // Get all products for inventory management
  static async getAllInventory(req, res) {
    try {
      const {
        page = 1,
        limit = 50,
        brand,
        status,
        search,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        lowStock = false,
        outOfStock = false
      } = req.query;

      // Build filter options
      const filterOptions = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder: sortOrder.toUpperCase()
      };

      // Add filters
      if (brand) filterOptions.brand = brand;
      if (status) filterOptions.status = status;
      if (search) filterOptions.search = search;

      // Get products from ProductService
      const result = await ProductService.getAllProducts(filterOptions);
      
      // Process products to add inventory-specific information
      const inventoryData = result.products.map(product => {
        const inventoryProduct = {
          ...product,
          // Add inventory status indicators
          isLowStock: product.stock_quantity <= 10 && product.stock_quantity > 0,
          isOutOfStock: product.stock_quantity === 0,
          // Calculate inventory value
          inventoryValue: (product.stock_quantity * (product.selling_price || product.mrp || 0)).toFixed(2),
          // Brand-specific category display
          categoryDisplay: this.getBrandSpecificCategoryDisplay(product),
          // Format dates
          createdAtFormatted: new Date(product.created_at).toLocaleDateString(),
          updatedAtFormatted: new Date(product.updated_at).toLocaleDateString()
        };

        return inventoryProduct;
      });

      // Apply additional filters
      let filteredData = inventoryData;
      
      if (lowStock === 'true') {
        filteredData = filteredData.filter(product => product.isLowStock);
      }
      
      if (outOfStock === 'true') {
        filteredData = filteredData.filter(product => product.isOutOfStock);
      }

      // Calculate inventory statistics
      const stats = this.calculateInventoryStats(inventoryData);

      res.json({
        success: true,
        data: {
          products: filteredData,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(result.total / parseInt(limit)),
            totalProducts: result.total,
            limit: parseInt(limit)
          },
          stats
        }
      });

    } catch (error) {
      console.error('Error fetching inventory:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch inventory data',
        error: error.message
      });
    }
  }

  // Get inventory statistics
  static async getInventoryStats(req, res) {
    try {
      const { brand } = req.query;
      
      const filterOptions = {};
      if (brand) filterOptions.brand = brand;

      const result = await ProductService.getAllProducts(filterOptions);
      const stats = this.calculateInventoryStats(result.products);

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch inventory statistics',
        error: error.message
      });
    }
  }

  // Get low stock products
  static async getLowStockProducts(req, res) {
    try {
      const { threshold = 10, brand } = req.query;
      
      const filterOptions = {
        limit: 1000 // Get all products to filter by stock
      };
      if (brand) filterOptions.brand = brand;

      const result = await ProductService.getAllProducts(filterOptions);
      
      const lowStockProducts = result.products.filter(product => 
        product.stock_quantity <= parseInt(threshold) && product.stock_quantity > 0
      );

      res.json({
        success: true,
        data: {
          products: lowStockProducts,
          count: lowStockProducts.length,
          threshold: parseInt(threshold)
        }
      });

    } catch (error) {
      console.error('Error fetching low stock products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch low stock products',
        error: error.message
      });
    }
  }

  // Get out of stock products
  static async getOutOfStockProducts(req, res) {
    try {
      const { brand } = req.query;
      
      const filterOptions = {
        limit: 1000 // Get all products to filter by stock
      };
      if (brand) filterOptions.brand = brand;

      const result = await ProductService.getAllProducts(filterOptions);
      
      const outOfStockProducts = result.products.filter(product => 
        product.stock_quantity === 0
      );

      res.json({
        success: true,
        data: {
          products: outOfStockProducts,
          count: outOfStockProducts.length
        }
      });

    } catch (error) {
      console.error('Error fetching out of stock products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch out of stock products',
        error: error.message
      });
    }
  }

  // Helper method to get brand-specific category display
  static getBrandSpecificCategoryDisplay(product) {
    if (product.brand === 'indikriti') {
      return {
        category: product.indikriti_category_name || 'N/A',
        subcategory: product.indikriti_subcategory_name || 'N/A',
        productType: product.indikriti_product_type_name || 'N/A'
      };
    } else if (product.brand === 'winsomeLane') {
      return {
        category: product.winsomelane_category_name || 'N/A',
        subcategory: product.winsomelane_subcategory_name || 'N/A',
        productType: product.winsomelane_product_type_name || 'N/A'
      };
    }
    return {
      category: 'N/A',
      subcategory: 'N/A',
      productType: 'N/A'
    };
  }

  // Helper method to calculate inventory statistics
  static calculateInventoryStats(products) {
    const stats = {
      totalProducts: products.length,
      totalValue: 0,
      byBrand: {
        indikriti: { count: 0, value: 0 },
        winsomeLane: { count: 0, value: 0 }
      },
      byStatus: {
        active: 0,
        inactive: 0,
        draft: 0
      },
      stockStatus: {
        inStock: 0,
        lowStock: 0,
        outOfStock: 0
      }
    };

    products.forEach(product => {
      const value = product.stock_quantity * (product.selling_price || product.mrp || 0);
      stats.totalValue += value;

      // Brand statistics
      if (product.brand === 'indikriti') {
        stats.byBrand.indikriti.count++;
        stats.byBrand.indikriti.value += value;
      } else if (product.brand === 'winsomeLane') {
        stats.byBrand.winsomeLane.count++;
        stats.byBrand.winsomeLane.value += value;
      }

      // Status statistics
      stats.byStatus[product.status] = (stats.byStatus[product.status] || 0) + 1;

      // Stock status
      if (product.stock_quantity === 0) {
        stats.stockStatus.outOfStock++;
      } else if (product.stock_quantity <= 10) {
        stats.stockStatus.lowStock++;
      } else {
        stats.stockStatus.inStock++;
      }
    });

    // Format values
    stats.totalValue = stats.totalValue.toFixed(2);
    stats.byBrand.indikriti.value = stats.byBrand.indikriti.value.toFixed(2);
    stats.byBrand.winsomeLane.value = stats.byBrand.winsomeLane.value.toFixed(2);

    return stats;
  }
}

module.exports = InventoryController;
