/**
 * Products API Routes
 */
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateRequest } = require('../../../middleware/validation');
const permissionCheck = require('../../../middleware/permissionCheck');
const ProductController = require('../../../controllers/product/ProductController');
const CategoryController = require('../../../controllers/product/CategoryController');
const BrandCategoryController = require('../../../controllers/product/BrandCategoryController');
const Enhanced4LevelHierarchyController = require('../../../controllers/product/Enhanced4LevelHierarchyController');
const AttributeController = require('../../../controllers/product/AttributeController');
const InventoryController = require('../../../controllers/product/InventoryController');
const { authenticateToken } = require('../../../middleware/auth');

// =============== BRAND ROUTES (NO AUTH FOR TESTING) ===============
/**
 * @route GET /api/v1/products/brands
 * @desc Get all available brands
 * @access Public (for testing)
 */
router.get('/brands', BrandCategoryController.getAllBrands);

/**
 * @route GET /api/v1/products/brands/:brand/categories
 * @desc Get categories by brand (public access for testing)
 * @access Public (for testing)
 */
router.get('/brands/:brand/categories', BrandCategoryController.getCategoriesByBrand);

// Apply authentication middleware to all other routes
router.use(authenticateToken);

// =============== PRODUCT TYPE ROUTES ===============
// Note: Old generic product type routes removed - use brand-specific routes instead

// =============== CATEGORY ROUTES ===============
// Note: Old generic category routes removed - use brand-specific routes instead
// Categories now require brand parameter
router.get('/categories', CategoryController.getAllCategories);

// =============== SUBCATEGORY ROUTES ===============
// Note: Old generic subcategory routes removed - use brand-specific routes instead

// =============== BRAND-SPECIFIC CATEGORY ROUTES ===============

// Note: Public categories route defined above before authentication middleware

/**
 * @route POST /api/v1/products/brands/:brand/categories
 * @desc Create a new category for a specific brand
 * @access Private
 */
router.post('/brands/:brand/categories', BrandCategoryController.createBrandCategory);

/**
 * @route GET /api/v1/products/brands/:brand/categories/:id
 * @desc Get category by brand and ID
 * @access Private
 */
router.get('/brands/:brand/categories/:id', BrandCategoryController.getBrandCategoryById);

/**
 * @route PUT /api/v1/products/brands/:brand/categories/:id
 * @desc Update a brand category
 * @access Private
 */
router.put('/brands/:brand/categories/:id', BrandCategoryController.updateBrandCategory);

/**
 * @route DELETE /api/v1/products/brands/:brand/categories/:id
 * @desc Delete a brand category
 * @access Private
 */
router.delete('/brands/:brand/categories/:id', BrandCategoryController.deleteBrandCategory);

// =============== ENHANCED 4-LEVEL HIERARCHY ROUTES ===============
/**
 * @route GET /api/v1/products/brands/:brand/hierarchy
 * @desc Get complete 4-level hierarchy for a brand
 * @access Private
 */
router.get('/brands/:brand/hierarchy', Enhanced4LevelHierarchyController.getCompleteHierarchyByBrand);

/**
 * @route GET /api/v1/products/brands/:brand/categories/:categoryId/subcategories
 * @desc Get subcategories by brand and category
 * @access Private
 */
router.get('/brands/:brand/categories/:categoryId/subcategories', Enhanced4LevelHierarchyController.getSubcategoriesByBrandAndCategory);

/**
 * @route POST /api/v1/products/brands/:brand/categories/:categoryId/subcategories
 * @desc Create a new subcategory for a brand category
 * @access Private
 */
router.post('/brands/:brand/categories/:categoryId/subcategories', Enhanced4LevelHierarchyController.createBrandSubcategory);

/**
 * @route PUT /api/v1/products/brands/:brand/subcategories/:subcategoryId
 * @desc Update a subcategory for a brand
 * @access Private
 */
router.put('/brands/:brand/subcategories/:subcategoryId', Enhanced4LevelHierarchyController.updateBrandSubcategory);

/**
 * @route DELETE /api/v1/products/brands/:brand/subcategories/:subcategoryId
 * @desc Delete a subcategory for a brand
 * @access Private
 */
router.delete('/brands/:brand/subcategories/:subcategoryId', Enhanced4LevelHierarchyController.deleteBrandSubcategory);

/**
 * @route GET /api/v1/products/brands/:brand/subcategories/:subcategoryId/product-types
 * @desc Get product types by brand and subcategory
 * @access Private
 */
router.get('/brands/:brand/subcategories/:subcategoryId/product-types', Enhanced4LevelHierarchyController.getProductTypesByBrandAndSubcategory);

/**
 * @route POST /api/v1/products/brands/:brand/subcategories/:subcategoryId/product-types
 * @desc Create a new product type for a brand subcategory
 * @access Private
 */
router.post('/brands/:brand/subcategories/:subcategoryId/product-types', Enhanced4LevelHierarchyController.createBrandProductType);

/**
 * @route PUT /api/v1/products/brands/:brand/product-types/:productTypeId
 * @desc Update a product type for a brand
 * @access Private
 */
router.put('/brands/:brand/product-types/:productTypeId', Enhanced4LevelHierarchyController.updateBrandProductType);

/**
 * @route DELETE /api/v1/products/brands/:brand/product-types/:productTypeId
 * @desc Delete a product type for a brand
 * @access Private
 */
router.delete('/brands/:brand/product-types/:productTypeId', Enhanced4LevelHierarchyController.deleteBrandProductType);

// =============== PRODUCT ROUTES ===============
/**
 * @route GET /api/v1/products
 * @desc Get all products with filters and pagination
 * @access Private
 */
router.get('/', ProductController.getAllProducts);

/**
 * @route GET /api/v1/products/:id
 * @desc Get product by ID
 * @access Private
 */
router.get('/:id', ProductController.getProductById);

/**
 * @route POST /api/v1/products
 * @desc Create a new product
 * @access Private
 */
router.post('/', 
  ProductController.uploadProductImages,
  ProductController.createProduct
);

/**
 * @route PUT /api/v1/products/:id
 * @desc Update a product
 * @access Private
 */
router.put('/:id', 
  ProductController.uploadProductImages,
  ProductController.updateProduct
);

/**
 * @route DELETE /api/v1/products/:id
 * @desc Delete a product
 * @access Private
 */
router.delete('/:id', ProductController.deleteProduct);

router.get('/search/:term', permissionCheck('View Products'), ProductController.searchProducts);
router.post('/bulk/import', permissionCheck('Create Products'), ProductController.bulkImport);
router.get('/bulk/export', permissionCheck('View Products'), ProductController.bulkExport);

// Note: Old category routes removed - use brand-specific routes instead

// Attribute routes
router.get('/attributes', permissionCheck('View Products'), AttributeController.getAllAttributes);
router.post('/attributes', permissionCheck('Create Products'), validateRequest(), AttributeController.createAttribute);
router.get('/attributes/:id', permissionCheck('View Products'), AttributeController.getAttributeById);
router.put('/attributes/:id', permissionCheck('Update Products'), validateRequest(), AttributeController.updateAttribute);
router.delete('/attributes/:id', permissionCheck('Delete Products'), AttributeController.deleteAttribute);

// Inventory routes
router.get('/inventory', permissionCheck('View Inventory'), InventoryController.getAllInventory);
router.put('/inventory/:productId', permissionCheck('Update Inventory'), validateRequest(), InventoryController.updateInventory);
router.get('/inventory/low-stock', permissionCheck('View Inventory'), InventoryController.getLowStockProducts);
router.post('/inventory/adjustment', permissionCheck('Update Inventory'), validateRequest(), InventoryController.createInventoryAdjustment);
router.get('/inventory/history/:productId', permissionCheck('View Inventory'), InventoryController.getInventoryHistory);

module.exports = router; 