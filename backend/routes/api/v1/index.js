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