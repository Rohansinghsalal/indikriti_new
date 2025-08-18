/**
 * API Routes Aggregator
 * Consolidates all API routes and applies common middleware
 */
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../../middleware/auth');
const companyFilterMiddleware = require('../../../middleware/companyFilter');

// Import route modules
const authRoutes = require('./auth');
const usersRoutes = require('./users');
const productsRoutes = require('./products');
const ordersRoutes = require('./orders');
const financialRoutes = require('./financial');
const posRoutes = require('./pos');
const invoiceRoutes = require('./invoices');
const supportRoutes = require('./support');
const cmsRoutes = require('./cms');
const analyticsRoutes = require('./analytics');
const inventoryRoutes = require('./inventory');
const adminUserRoutes = require('./admin/users');
// const systemRoutes = require('./system');

// Import models for test routes
const { sequelize } = require('../../../database/connection');
const User = require('../../../models/User')(sequelize, require('sequelize').DataTypes);
const Role = require('../../../models/Role')(sequelize, require('sequelize').DataTypes);
const Company = require('../../../models/Company')(sequelize, require('sequelize').DataTypes);

// Public routes
router.use('/auth', authRoutes);

// Public test endpoint
router.get('/test-connection', (req, res) => {
  res.json({
    success: true,
    message: 'Backend connection successful',
    timestamp: new Date().toISOString()
  });
});

// Public brands endpoint for testing
const BrandCategoryController = require('../../../controllers/product/BrandCategoryController');
router.get('/products/brands', BrandCategoryController.getAllBrands);

// Public categories endpoint for testing
router.get('/products/brands/:brand/categories', BrandCategoryController.getCategoriesByBrand);

// Public hierarchy endpoint for testing
const Enhanced4LevelHierarchyController = require('../../../controllers/product/Enhanced4LevelHierarchyController');
router.get('/products/brands/:brand/hierarchy', Enhanced4LevelHierarchyController.getCompleteHierarchyByBrand);

// Public subcategory endpoints for testing
router.post('/products/brands/:brand/categories/:categoryId/subcategories', Enhanced4LevelHierarchyController.createBrandSubcategory);

// Public product type endpoints for testing
router.post('/products/brands/:brand/subcategories/:subcategoryId/product-types', Enhanced4LevelHierarchyController.createBrandProductType);

// Public POS and Inventory endpoints for testing
router.use('/pos', posRoutes);
router.use('/inventory', inventoryRoutes);

// Public products by product type endpoint for frontend
router.get('/products/by-product-type/:productTypeId', async (req, res) => {
  try {
    const { productTypeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Set cache control headers to prevent 304 responses
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    // Query products from database
    const { sequelize } = require('../../../database/connection');

    const query = `
      SELECT
        p.*,
        c.name as category_name,
        s.name as subcategory_name,
        pt.name as product_type_name
      FROM products p
      LEFT JOIN indikriti_categories c ON p.indikriti_category_id = c.id
      LEFT JOIN indikriti_subcategories s ON p.indikriti_subcategory_id = s.id
      LEFT JOIN indikriti_product_types pt ON p.indikriti_product_type_id = pt.id
      WHERE p.indikriti_product_type_id = :productTypeId
        AND p.status = 'active'
        AND p.brand = 'indikriti'
      ORDER BY p.created_at DESC
      LIMIT :limit OFFSET :offset
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      WHERE p.indikriti_product_type_id = :productTypeId
        AND p.status = 'active'
        AND p.brand = 'indikriti'
    `;

    const [products] = await sequelize.query(query, {
      replacements: { productTypeId: parseInt(productTypeId), limit, offset }
    });

    const [countResult] = await sequelize.query(countQuery, {
      replacements: { productTypeId: parseInt(productTypeId) }
    });

    const total = countResult[0]?.total || 0;

    // Transform database products to match frontend expectations
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.mrp),
      discounted_price: parseFloat(product.selling_price),
      discount_percentage: parseFloat(product.discount),
      image_url: product.image_url || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      brand: product.brand,
      category: product.category_name,
      subcategory: product.subcategory_name,
      product_type: product.product_type_name,
      indikriti_category_id: product.indikriti_category_id,
      indikriti_subcategory_id: product.indikriti_subcategory_id,
      indikriti_product_type_id: product.indikriti_product_type_id,
      stock_quantity: product.stock_quantity,
      status: product.status,
      description: product.description,
      long_description: product.long_description,
      usp1: product.usp1,
      usp2: product.usp2,
      usp3: product.usp3,
      product_style: product.product_style,
      hsn: product.hsn,
      gst: parseFloat(product.gst)
    }));

    res.json({
      success: true,
      data: transformedProducts,
      meta: {
        total: parseInt(total),
        page,
        limit,
        pages: Math.ceil(total / limit),
        productTypeId: parseInt(productTypeId)
      }
    });
  } catch (error) {
    console.error('Error fetching products by product type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by product type',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Public products endpoint for frontend
router.get('/products', async (req, res) => {
  try {
    // Mock products data for frontend
    const products = [
      {
        id: 1,
        name: "Handwoven Cotton Bedsheet",
        price: 2500,
        discounted_price: 1875,
        discount_percentage: 25,
        image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        brand: "indikriti",
        category: "Handloom",
        indikriti_category_id: 1,
        stock_quantity: 50,
        status: "active"
      },
      {
        id: 2,
        name: "Silk Saree with Gold Border",
        price: 8500,
        discounted_price: 6800,
        discount_percentage: 20,
        image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
        brand: "indikriti",
        category: "Handloom",
        indikriti_category_id: 1,
        stock_quantity: 25,
        status: "active"
      },
      {
        id: 3,
        name: "Brass Decorative Bowl",
        price: 1800,
        discounted_price: 1260,
        discount_percentage: 30,
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        brand: "indikriti",
        category: "Handicraft",
        indikriti_category_id: 2,
        stock_quantity: 30,
        status: "active"
      },
      {
        id: 4,
        name: "Wooden Carved Elephant",
        price: 3200,
        discounted_price: 2560,
        discount_percentage: 20,
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        brand: "indikriti",
        category: "Handicraft",
        indikriti_category_id: 2,
        stock_quantity: 15,
        status: "active"
      },
      {
        id: 5,
        name: "Corporate Gift Set",
        price: 5000,
        discounted_price: 4500,
        discount_percentage: 10,
        image_url: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400",
        brand: "indikriti",
        category: "Corporate Gifts",
        indikriti_category_id: 3,
        stock_quantity: 20,
        status: "active"
      }
    ];

    // Apply filters
    let filteredProducts = [...products];

    if (req.query.brand) {
      filteredProducts = filteredProducts.filter(p => p.brand === req.query.brand);
    }

    if (req.query.category_id) {
      filteredProducts = filteredProducts.filter(p => p.indikriti_category_id === parseInt(req.query.category_id));
    }

    // Apply pagination
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    res.json({
      success: true,
      data: paginatedProducts,
      meta: {
        total: filteredProducts.length,
        page,
        limit,
        pages: Math.ceil(filteredProducts.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Public sales-discounts endpoint for frontend
router.get('/sales-discounts', async (req, res) => {
  try {
    // Mock sales and discounts data for frontend
    const salesData = {
      flashSales: [
        {
          id: 1,
          name: "Handwoven Cotton Bedsheet",
          price: 2500,
          discounted_price: 1875,
          discount_percentage: 25,
          image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
          brand: "indikriti",
          category: "Handloom",
          flash_sale_ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          name: "Brass Decorative Bowl",
          price: 1800,
          discounted_price: 1260,
          discount_percentage: 30,
          image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          brand: "indikriti",
          category: "Handicraft",
          flash_sale_ends_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
        }
      ],
      discountedProducts: [
        {
          id: 3,
          name: "Silk Saree with Gold Border",
          price: 8500,
          discounted_price: 6800,
          discount_percentage: 20,
          image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
          brand: "indikriti",
          category: "Handloom"
        },
        {
          id: 4,
          name: "Wooden Carved Elephant",
          price: 3200,
          discounted_price: 2560,
          discount_percentage: 20,
          image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          brand: "indikriti",
          category: "Handicraft"
        }
      ],
      deals: [
        {
          id: 1,
          title: "Flash Sale",
          description: "Up to 50% off on selected items",
          discount: 50,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          banner_image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800",
          products: []
        }
      ]
    };

    res.json({
      success: true,
      data: salesData
    });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Protected routes - require authentication
router.use(authenticateToken);
router.use(companyFilterMiddleware);

// Apply routes
router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/financial', financialRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/support', supportRoutes);
router.use('/cms', cmsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin/users', adminUserRoutes);
// router.use('/system', systemRoutes);

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly'
  });
});

// Simple system route for testing
router.get('/system/test', (req, res) => {
  res.json({
    success: true,
    message: 'System API route is working'
  });
});

// Test database route
router.get('/test/db', async (req, res) => {
  try {
    await sequelize.authenticate();
    
    const users = await User.findAll({
      attributes: ['id', 'first_name', 'last_name', 'email', 'status'],
      limit: 5
    });
    
    const roles = await Role.findAll({
      attributes: ['id', 'name', 'description'],
      limit: 5
    });
    
    const companies = await Company.findAll({
      attributes: ['id', 'name', 'email', 'status'],
      limit: 5
    });
    
    res.json({
      success: true,
      message: 'Database connection successful',
      data: {
        users,
        roles,
        companies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    version: '1.0.0',
    timestamp: new Date()
  });
});

module.exports = router; 