const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const { query, sequelize } = require('../database/connection');
const path = require('path');
const fs = require('fs').promises;

class ProductService {
  // Note: Old product type, category, and subcategory methods removed
  // Use brand-specific controllers for hierarchy management

  // ========== PRODUCT METHODS ==========
  
  // Get all products with pagination and filters
  async getAllProducts(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        brand,
        status,
        search
      } = options;
      
      const offset = (page - 1) * limit;
      const whereConditions = [];
      const params = [];
      
      if (brand) {
        whereConditions.push('p.brand = ?');
        params.push(brand);
      }
      
      if (status) {
        whereConditions.push('p.status = ?');
        params.push(status);
      }
      
      if (search) {
        whereConditions.push('(p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)');
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      
      const whereClause = whereConditions.length > 0 
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM products p
        ${whereClause}
      `;
      
      const countResult = await query(countQuery, params);
      const total = countResult[0].total;
      
      // Get products with brand-specific category information
      const productsQuery = `
        SELECT
          p.*,
          -- Indikriti brand-specific names
          ic.name as indikriti_category_name,
          isc.name as indikriti_subcategory_name,
          ipt.name as indikriti_product_type_name,
          -- Winsome Lane brand-specific names
          wc.name as winsomelane_category_name,
          wsc.name as winsomelane_subcategory_name,
          wpt.name as winsomelane_product_type_name,
          (SELECT image_path FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) as main_image
        FROM
          products p
          -- Indikriti brand-specific joins
          LEFT JOIN indikriti_categories ic ON p.indikriti_category_id = ic.id
          LEFT JOIN indikriti_subcategories isc ON p.indikriti_subcategory_id = isc.id
          LEFT JOIN indikriti_product_types ipt ON p.indikriti_product_type_id = ipt.id
          -- Winsome Lane brand-specific joins
          LEFT JOIN winsomelane_categories wc ON p.winsomelane_category_id = wc.id
          LEFT JOIN winsomelane_subcategories wsc ON p.winsomelane_subcategory_id = wsc.id
          LEFT JOIN winsomelane_product_types wpt ON p.winsomelane_product_type_id = wpt.id
        ${whereClause}
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      params.push(limit, offset);
      const products = await query(productsQuery, params);
      
      return {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get product by ID
  async getProductById(id) {
    try {
      // Get product details with brand-specific category information
      const productResults = await query(`
        SELECT
          p.*,
          -- Indikriti brand-specific names
          ic.name as indikriti_category_name,
          isc.name as indikriti_subcategory_name,
          ipt.name as indikriti_product_type_name,
          -- Winsome Lane brand-specific names
          wc.name as winsomelane_category_name,
          wsc.name as winsomelane_subcategory_name,
          wpt.name as winsomelane_product_type_name
        FROM
          products p
          -- Indikriti brand-specific joins
          LEFT JOIN indikriti_categories ic ON p.indikriti_category_id = ic.id
          LEFT JOIN indikriti_subcategories isc ON p.indikriti_subcategory_id = isc.id
          LEFT JOIN indikriti_product_types ipt ON p.indikriti_product_type_id = ipt.id
          -- Winsome Lane brand-specific joins
          LEFT JOIN winsomelane_categories wc ON p.winsomelane_category_id = wc.id
          LEFT JOIN winsomelane_subcategories wsc ON p.winsomelane_subcategory_id = wsc.id
          LEFT JOIN winsomelane_product_types wpt ON p.winsomelane_product_type_id = wpt.id
        WHERE p.id = ?
      `, [id]);
      
      if (productResults.length === 0) {
        return null;
      }
      
      const product = productResults[0];
      
      // Get product images
      const images = await query(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, id ASC',
        [id]
      );
      
      product.images = images;
      
      return product;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  // Create product with image handling
  async createProduct(data, files = null) {
    try {
      const {
        product_id,
        sku,
        name,
        description,
        mrp,
        selling_price,
        stock_quantity,
        batch_no,
        brand,
        status,
        // Brand-specific hierarchy fields
        indikriti_category_id,
        winsomelane_category_id,
        indikriti_subcategory_id,
        winsomelane_subcategory_id,
        indikriti_product_type_id,
        winsomelane_product_type_id,
        // Advanced fields
        product_style,
        discount,
        sale_price,
        special_discount,
        final_price,
        referral_bonus,
        loyalty_bonus,
        hsn,
        gst,
        long_description,
        usp1,
        usp2,
        usp3
      } = data;
      
      // Validate brand-specific hierarchy data
      if (brand === 'indikriti' && !indikriti_category_id) {
        throw new Error('Indikriti category ID is required for Indikriti products');
      }
      if (brand === 'winsomeLane' && !winsomelane_category_id) {
        throw new Error('Winsome Lane category ID is required for Winsome Lane products');
      }

      // Insert product
      const result = await query(
        `INSERT INTO products (
          product_id, sku, name, description, mrp, selling_price, stock_quantity,
          batch_no, brand, status,
          indikriti_category_id, winsomelane_category_id, indikriti_subcategory_id,
          winsomelane_subcategory_id, indikriti_product_type_id, winsomelane_product_type_id,
          product_style, discount, sale_price, special_discount, final_price,
          referral_bonus, loyalty_bonus, hsn, gst, long_description, usp1, usp2, usp3
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product_id, sku, name, description, mrp, selling_price, stock_quantity,
          batch_no, brand, status || 'draft',
          indikriti_category_id || null, winsomelane_category_id || null,
          indikriti_subcategory_id || null, winsomelane_subcategory_id || null,
          indikriti_product_type_id || null, winsomelane_product_type_id || null,
          product_style || null, discount || 0, sale_price || null, special_discount || 0, final_price || null,
          referral_bonus || 0, loyalty_bonus || 0, hsn || null, gst || 0, long_description || null,
          usp1 || null, usp2 || null, usp3 || null
        ]
      );

      const productId = result.insertId;

      // Handle image uploads if files are provided
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const isPrimary = i === 0; // First image is primary by default

          await query(
            'INSERT INTO product_images (product_id, image_path, is_primary) VALUES (?, ?, ?)',
            [productId, file.path, isPrimary]
          );
        }
      }

      // Return product with images
      const createdProduct = await this.getProductById(productId);
      return createdProduct || {
        id: productId,
        ...data
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(id, data) {
    try {
      const {
        sku,
        name,
        description,
        mrp,
        selling_price,
        stock_quantity,
        batch_no,
        brand,
        status,
        // Brand-specific hierarchy fields
        indikriti_category_id,
        winsomelane_category_id,
        indikriti_subcategory_id,
        winsomelane_subcategory_id,
        indikriti_product_type_id,
        winsomelane_product_type_id
      } = data;

      await query(
        `UPDATE products SET 
          sku = ?, name = ?, description = ?, mrp = ?, selling_price = ?, 
          stock_quantity = ?, batch_no = ?, brand = ?, status = ?,
          indikriti_category_id = ?, winsomelane_category_id = ?, 
          indikriti_subcategory_id = ?, winsomelane_subcategory_id = ?, 
          indikriti_product_type_id = ?, winsomelane_product_type_id = ?
        WHERE id = ?`,
        [
          sku, name, description, mrp, selling_price, 
          stock_quantity, batch_no, brand, status,
          indikriti_category_id || null, winsomelane_category_id || null, 
          indikriti_subcategory_id || null, winsomelane_subcategory_id || null, 
          indikriti_product_type_id || null, winsomelane_product_type_id || null,
          id
        ]
      );

      return { id, ...data };
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(id) {
    try {
      // Delete product images first
      await query('DELETE FROM product_images WHERE product_id = ?', [id]);
      
      // Delete product
      await query('DELETE FROM products WHERE id = ?', [id]);
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new ProductService();
