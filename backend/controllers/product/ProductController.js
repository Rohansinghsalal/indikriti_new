/**
 * Product Controller - Handles product CRUD operations
 */

const { Product, Category, Inventory, Company } = require('../../models');
const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');
const fs = require('fs');
const path = require('path');
const ProductService = require('../../services/ProductService');
const multer = require('multer');

/**
 * Get all products with pagination and filtering
 */
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    
    // Build filters
    const where = {};
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (req.query.category_id) {
      where.category_id = req.query.category_id;
    }
    
    // Add company filter (if applicable)
    if (req.companyId && !req.isSuperAdmin) {
      where.company_id = req.companyId;
    }
    
    // Search by name or SKU
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { sku: { [Op.like]: `%${req.query.search}%` } }
      ];
    }
    
    // Get products with pagination
    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Company, attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
    
    return res.json({
      success: true,
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get product by ID
 */
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Find product by ID
    const product = await Product.findOne({
      where: { id: productId },
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Company, attributes: ['id', 'name'] },
        { model: Inventory, attributes: ['id', 'quantity', 'location'] }
      ]
    });
    
    // Check if product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if product belongs to requester's company (unless super admin)
    if (req.companyId && !req.isSuperAdmin && product.company_id !== req.companyId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this product'
      });
    }
    
    return res.json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new product
 */
exports.createProduct = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const {
      name,
      description,
      price,
      category_id,
      sku,
      barcode,
      weight,
      dimensions,
      status = 'active',
      tax_class,
      company_id
    } = req.body;

    // Determine company_id
    let finalCompanyId = company_id;
    if (!req.isSuperAdmin || !finalCompanyId) {
      finalCompanyId = req.companyId;
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      category_id,
      sku,
      barcode,
      weight,
      dimensions,
      status,
      tax_class,
      company_id: finalCompanyId,
      created_by: req.user.id
    });

    // Handle image upload if provided
    if (req.file) {
      const imagePath = `/uploads/products/${product.id}_${req.file.filename}`;
      product.image = imagePath;
      await product.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    logger.error('Error creating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update product
 */
exports.updateProduct = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const productId = req.params.id;
    
    // Find product by ID
    const product = await Product.findByPk(productId);
    
    // Check if product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if product belongs to requester's company (unless super admin)
    if (req.companyId && !req.isSuperAdmin && product.company_id !== req.companyId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this product'
      });
    }
    
    const {
      name,
      description,
      price,
      category_id,
      sku,
      barcode,
      weight,
      dimensions,
      status,
      tax_class,
      company_id
    } = req.body;
    
    // Update product properties
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price) product.price = price;
    if (category_id) product.category_id = category_id;
    if (sku) product.sku = sku;
    if (barcode) product.barcode = barcode;
    if (weight) product.weight = weight;
    if (dimensions) product.dimensions = dimensions;
    if (status) product.status = status;
    if (tax_class) product.tax_class = tax_class;
    
    // Only super admin can change company_id
    if (req.isSuperAdmin && company_id) {
      product.company_id = company_id;
    }
    
    // Handle image upload if provided
    if (req.file) {
      // Delete old image if it exists
      if (product.image) {
        const oldImagePath = path.join(__dirname, '../../storage', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      const imagePath = `/uploads/products/${product.id}_${req.file.filename}`;
      product.image = imagePath;
    }
    
    // Save updated product
    await product.save();
    
    return res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    logger.error('Error updating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete product
 */
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Find product by ID
    const product = await Product.findByPk(productId);
    
    // Check if product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if product belongs to requester's company (unless super admin)
    if (req.companyId && !req.isSuperAdmin && product.company_id !== req.companyId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this product'
      });
    }
    
    // Delete product image if it exists
    if (product.image) {
      const imagePath = path.join(__dirname, '../../storage', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete product
    await product.destroy();
    
    return res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Search products by term
 */
exports.searchProducts = async (req, res) => {
  try {
    const searchTerm = req.params.term;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    
    // Build search query
    const where = {
      [Op.or]: [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { sku: { [Op.like]: `%${searchTerm}%` } },
        { description: { [Op.like]: `%${searchTerm}%` } }
      ]
    };
    
    // Add company filter (if applicable)
    if (req.companyId && !req.isSuperAdmin) {
      where.company_id = req.companyId;
    }
    
    // Get products with pagination
    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Company, attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
    
    return res.json({
      success: true,
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Error searching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Bulk import products
 */
exports.bulkImport = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Bulk import endpoint',
      data: []
    });
  } catch (error) {
    logger.error('Error importing products:', error);
    return res.status(500).json({ success: false, message: 'Failed to import products' });
  }
};

/**
 * Bulk export products
 */
exports.bulkExport = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Bulk export endpoint',
      data: []
    });
  } catch (error) {
    logger.error('Error exporting products:', error);
    return res.status(500).json({ success: false, message: 'Failed to export products' });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../storage/uploads/temp');
    try {
      await fs.promises.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

exports.uploadProductImages = upload.array('images', 3); // Allow up to 3 images

// =============== PRODUCT TYPE CONTROLLERS ===============

exports.getAllProductTypes = async (req, res) => {
  try {
    const productTypes = await ProductService.getAllProductTypes();
    res.json(productTypes);
  } catch (error) {
    console.error('Error in getAllProductTypes:', error);
    res.status(500).json({ 
      error: 'Failed to fetch product types',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getProductTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const productType = await ProductService.getProductTypeById(id);
    
    if (!productType) {
      return res.status(404).json({ error: 'Product type not found' });
    }
    
    res.json(productType);
  } catch (error) {
    console.error(`Error in getProductTypeById ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch product type',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Note: Old createProductType method removed - use brand-specific controllers instead

// Note: Old updateProductType method removed - use brand-specific controllers instead

// Note: Old deleteProductType method removed - use brand-specific controllers instead

// =============== CATEGORY CONTROLLERS ===============

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await ProductService.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    res.status(500).json({ 
      error: 'Failed to fetch categories',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getCategoriesByProductType = async (req, res) => {
  try {
    const { productTypeId } = req.params;
    const categories = await ProductService.getCategoriesByProductType(productTypeId);
    res.json(categories);
  } catch (error) {
    console.error(`Error in getCategoriesByProductType ${req.params.productTypeId}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch categories by product type',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProductService.getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error(`Error in getCategoryById ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch category',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, product_type_id, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (!product_type_id) {
      return res.status(400).json({ error: 'Product type ID is required' });
    }
    
    // Check if product type exists
    const productType = await ProductService.getProductTypeById(product_type_id);
    if (!productType) {
      return res.status(404).json({ error: 'Product type not found' });
    }
    
    const newCategory = await ProductService.createCategory({
      name,
      product_type_id,
      description: description || ''
    });
    
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error in createCategory:', error);
    res.status(500).json({ 
      error: 'Failed to create category',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, product_type_id, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (!product_type_id) {
      return res.status(400).json({ error: 'Product type ID is required' });
    }
    
    // Check if category exists
    const category = await ProductService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Check if product type exists
    const productType = await ProductService.getProductTypeById(product_type_id);
    if (!productType) {
      return res.status(404).json({ error: 'Product type not found' });
    }
    
    const updatedCategory = await ProductService.updateCategory(id, {
      name,
      product_type_id,
      description: description || ''
    });
    
    res.json(updatedCategory);
  } catch (error) {
    console.error(`Error in updateCategory ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to update category',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { forceCascade } = req.query; // Allow force cascade via query parameter

    const category = await ProductService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    try {
      const result = await ProductService.deleteCategory(id, forceCascade === 'true');

      res.json({
        success: true,
        message: result.message,
        data: {
          id: parseInt(id),
          cascaded: result.cascaded,
          deletedCounts: result.deletedCounts || {}
        }
      });
    } catch (error) {
      if (error.message.includes('has associated') || error.message.includes('Cannot delete')) {
        return res.status(400).json({
          success: false,
          error: error.message,
          suggestion: 'Use ?forceCascade=true to delete all related data'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error(`Error in deleteCategory ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// =============== SUBCATEGORY CONTROLLERS ===============

exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await ProductService.getAllSubcategories();
    res.json(subcategories);
  } catch (error) {
    console.error('Error in getAllSubcategories:', error);
    res.status(500).json({ 
      error: 'Failed to fetch subcategories',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await ProductService.getSubcategoriesByCategory(categoryId);
    res.json(subcategories);
  } catch (error) {
    console.error(`Error in getSubcategoriesByCategory ${req.params.categoryId}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch subcategories by category',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await ProductService.getSubcategoryById(id);
    
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    
    res.json(subcategory);
  } catch (error) {
    console.error(`Error in getSubcategoryById ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch subcategory',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Note: Old createSubcategory method removed - use brand-specific controllers instead

// Note: Old updateSubcategory method removed - use brand-specific controllers instead

// Note: Old deleteSubcategory method removed - use brand-specific controllers instead

// =============== PRODUCT CONTROLLERS ===============

exports.getAllProducts = async (req, res) => {
  try {
    const { 
      page, 
      limit, 
      brand, 
      product_type_id, 
      category_id, 
      subcategory_id,
      status,
      search
    } = req.query;
    
    const products = await ProductService.getAllProducts({
      page,
      limit,
      brand,
      product_type_id,
      category_id,
      subcategory_id,
      status,
      search
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductService.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(`Error in getProductById ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch product',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.createProduct = async (req, res) => {
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
      product_type_id,
      category_id,
      subcategory_id,
      brand,
      status,
      // Brand-specific hierarchy IDs
      categoryId,
      subcategoryId,
      productTypeId,
      // Advanced fields
      productType,
      productStyle,
      discount,
      salePrice,
      specialDiscount,
      finalPrice,
      referralBonus,
      loyaltyBonus,
      hsn,
      gst,
      longDescription,
      usp1,
      usp2,
      usp3,
      usps,
      images
    } = req.body;
    
    // Validate required fields - allow flexible input from frontend
    const requiredFields = [];
    if (!name) requiredFields.push('name');
    if (!brand) requiredFields.push('brand');
    if (!productType && !product_type_id) requiredFields.push('productType or product_type_id');

    // Validate brand-specific hierarchy requirements
    const brandCategoryId = categoryId || category_id;
    const brandSubcategoryId = subcategoryId || subcategory_id;
    const brandProductTypeId = productTypeId;

    if (!brandCategoryId) requiredFields.push('categoryId (brand-specific category)');
    if (!brandSubcategoryId) requiredFields.push('subcategoryId (brand-specific subcategory)');
    if (!brandProductTypeId) requiredFields.push('productTypeId (brand-specific product type)');

    if (requiredFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: requiredFields
      });
    }
    
    // Validate brand-specific hierarchy relationships
    // (brandCategoryId, brandSubcategoryId, brandProductTypeId already declared above)

    // Import brand-specific models for validation
    const IndikritiBrandCategory = require('../../models/IndikritiBrandCategory');
    const WinsomeLaneBrandCategory = require('../../models/WinsomeLaneBrandCategory');
    const IndikritiBrandSubcategory = require('../../models/IndikritiBrandSubcategory');
    const WinsomeLaneBrandSubcategory = require('../../models/WinsomeLaneBrandSubcategory');
    const IndikritiBrandProductType = require('../../models/IndikritiBrandProductType');
    const WinsomeLaneBrandProductType = require('../../models/WinsomeLaneBrandProductType');

    // Validate brand-specific category
    if (brand === 'indikriti') {
      const category = await IndikritiBrandCategory.findByPk(brandCategoryId);
      if (!category) {
        return res.status(404).json({ error: 'Indikriti category not found' });
      }

      const subcategory = await IndikritiBrandSubcategory.findByPk(brandSubcategoryId);
      if (!subcategory) {
        return res.status(404).json({ error: 'Indikriti subcategory not found' });
      }

      const productType = await IndikritiBrandProductType.findByPk(brandProductTypeId);
      if (!productType) {
        return res.status(404).json({ error: 'Indikriti product type not found' });
      }
    } else if (brand === 'winsomeLane') {
      const category = await WinsomeLaneBrandCategory.findByPk(brandCategoryId);
      if (!category) {
        return res.status(404).json({ error: 'Winsome Lane category not found' });
      }

      const subcategory = await WinsomeLaneBrandSubcategory.findByPk(brandSubcategoryId);
      if (!subcategory) {
        return res.status(404).json({ error: 'Winsome Lane subcategory not found' });
      }

      const productType = await WinsomeLaneBrandProductType.findByPk(brandProductTypeId);
      if (!productType) {
        return res.status(404).json({ error: 'Winsome Lane product type not found' });
      }
    }
    
    // Check if at least one image is provided (either files or base64 images)
    const hasFiles = req.files && req.files.length > 0;
    const hasBase64Images = images && Array.isArray(images) && images.length > 0;

    if (!hasFiles && !hasBase64Images) {
      return res.status(400).json({ error: 'At least one image is required' });
    }
    
    // Generate IDs if not provided
    const generatedProductId = product_id || `PROD-${Date.now()}`;
    const generatedSku = sku || `SKU-${Date.now()}`;

    // Handle brand-specific 4-level hierarchy assignment
    let brandHierarchyData = {};

    // Use the brand-specific IDs from the frontend form (already declared above)

    if (brand === 'indikriti') {
      brandHierarchyData.indikriti_category_id = brandCategoryId ? parseInt(brandCategoryId) : null;
      brandHierarchyData.winsomelane_category_id = null;
      brandHierarchyData.indikriti_subcategory_id = brandSubcategoryId ? parseInt(brandSubcategoryId) : null;
      brandHierarchyData.winsomelane_subcategory_id = null;
      brandHierarchyData.indikriti_product_type_id = brandProductTypeId ? parseInt(brandProductTypeId) : null;
      brandHierarchyData.winsomelane_product_type_id = null;
    } else if (brand === 'winsomeLane') {
      brandHierarchyData.winsomelane_category_id = brandCategoryId ? parseInt(brandCategoryId) : null;
      brandHierarchyData.indikriti_category_id = null;
      brandHierarchyData.winsomelane_subcategory_id = brandSubcategoryId ? parseInt(brandSubcategoryId) : null;
      brandHierarchyData.indikriti_subcategory_id = null;
      brandHierarchyData.winsomelane_product_type_id = brandProductTypeId ? parseInt(brandProductTypeId) : null;
      brandHierarchyData.indikriti_product_type_id = null;
    }

    const productData = {
      product_id: generatedProductId,
      sku: generatedSku,
      name,
      description: description || longDescription || '',
      mrp: parseFloat(mrp || finalPrice || salePrice || 0),
      selling_price: parseFloat(selling_price || salePrice || mrp || finalPrice || 0),
      stock_quantity: parseInt(stock_quantity || 0),
      batch_no: batch_no || '',
      // Note: Using brand-specific product type IDs instead of generic product_type_id
      brand: brand || 'indikriti',
      status: status || 'draft',
      ...brandHierarchyData,
      // Advanced fields
      product_style: productStyle || '',
      discount: parseFloat(discount || 0),
      sale_price: parseFloat(salePrice || selling_price || 0),
      special_discount: parseFloat(specialDiscount || 0),
      final_price: parseFloat(finalPrice || mrp || salePrice || 0),
      referral_bonus: parseFloat(referralBonus || 0),
      loyalty_bonus: parseFloat(loyaltyBonus || 0),
      hsn: hsn || '',
      gst: parseFloat(gst || 0),
      long_description: longDescription || description || '',
      usp1: usp1 || (usps && usps[0]) || '',
      usp2: usp2 || (usps && usps[1]) || '',
      usp3: usp3 || (usps && usps[2]) || '',
      // Base64 images from frontend
      base64Images: images
    };
    
    const newProduct = await ProductService.createProduct(productData, req.files);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
      id: newProduct.id,
      product_id: newProduct.product_id,
      name: newProduct.name,
      status: newProduct.status,
      images: newProduct.images || []
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    console.error('Error stack:', error.stack);

    // Check if it's a validation error
    if (error.message && error.message.includes('validation')) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }

    // Check if it's a database error
    if (error.code && (error.code.includes('ER_') || error.code === 'ECONNREFUSED')) {
      return res.status(500).json({
        success: false,
        error: 'Database error',
        message: 'Failed to save product to database',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      message: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      product_id,
      sku,
      name,
      description,
      mrp,
      selling_price,
      stock_quantity,
      batch_no,
      product_type_id,
      category_id,
      subcategory_id,
      brand,
      status,
      existing_images
    } = req.body;
    
    // Validate required fields
    if (!product_id || !sku || !name || !mrp || !product_type_id || !category_id || !brand) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: 'product_id, sku, name, mrp, product_type_id, category_id, brand'
      });
    }
    
    // Check if product exists
    const product = await ProductService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if product type exists
    const productType = await ProductService.getProductTypeById(product_type_id);
    if (!productType) {
      return res.status(404).json({ error: 'Product type not found' });
    }
    
    // Check if category exists
    const category = await ProductService.getCategoryById(category_id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Check if subcategory exists (if provided)
    if (subcategory_id) {
      const subcategory = await ProductService.getSubcategoryById(subcategory_id);
      if (!subcategory) {
        return res.status(404).json({ error: 'Subcategory not found' });
      }
    }
    
    // Check if at least one image is present (either existing or new)
    const hasExistingImages = existing_images && Array.isArray(existing_images) && existing_images.length > 0;
    const hasNewImages = req.files && req.files.length > 0;
    
    if (!hasExistingImages && !hasNewImages) {
      return res.status(400).json({ error: 'At least one image is required' });
    }
    
    const productData = {
      product_id,
      sku,
      name,
      description: description || '',
      mrp: parseFloat(mrp),
      selling_price: selling_price ? parseFloat(selling_price) : parseFloat(mrp),
      stock_quantity: stock_quantity ? parseInt(stock_quantity) : 0,
      batch_no: batch_no || '',
      product_type_id: parseInt(product_type_id),
      category_id: parseInt(category_id),
      subcategory_id: subcategory_id ? parseInt(subcategory_id) : null,
      brand,
      status: status || 'draft',
      existing_images: hasExistingImages ? existing_images.map(id => parseInt(id)) : []
    };
    
    const updatedProduct = await ProductService.updateProduct(id, productData, req.files || []);
    
    res.json(updatedProduct);
  } catch (error) {
    console.error(`Error in updateProduct ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to update product',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await ProductService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await ProductService.deleteProduct(id);
    res.status(204).end();
  } catch (error) {
    console.error(`Error in deleteProduct ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to delete product',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get public products for website (no authentication required)
 */
exports.getPublicProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    // For now, return sample products
    // In a real implementation, you would fetch from the database
    const sampleProducts = [
      {
        id: 1,
        name: 'Handwoven Silk Saree',
        description: 'Beautiful traditional silk saree with intricate patterns',
        price: 5999.00,
        sale_price: 4999.00,
        image_url: '/images/products/silk-saree.jpg',
        brand: 'indikriti',
        sku: 'IND-SAR-001',
        status: 'active',
        category: { id: 6, name: 'Textiles' }
      },
      {
        id: 2,
        name: 'Brass Decorative Lamp',
        description: 'Traditional brass lamp with intricate carvings',
        price: 2499.00,
        sale_price: 1999.00,
        image_url: '/images/products/brass-lamp.jpg',
        brand: 'indikriti',
        sku: 'IND-LAM-001',
        status: 'active',
        category: { id: 5, name: 'Handicrafts' }
      },
      {
        id: 3,
        name: 'Wooden Jewelry Box',
        description: 'Handcrafted wooden jewelry box with mirror',
        price: 1299.00,
        sale_price: 999.00,
        image_url: '/images/products/jewelry-box.jpg',
        brand: 'indikriti',
        sku: 'IND-JEW-001',
        status: 'active',
        category: { id: 5, name: 'Handicrafts' }
      },
      {
        id: 4,
        name: 'Cotton Kurta Set',
        description: 'Comfortable cotton kurta with matching pajama',
        price: 1899.00,
        sale_price: 1499.00,
        image_url: '/images/products/kurta-set.jpg',
        brand: 'indikriti',
        sku: 'IND-KUR-001',
        status: 'active',
        category: { id: 2, name: 'Clothing' }
      },
      {
        id: 5,
        name: 'Ceramic Tea Set',
        description: 'Beautiful ceramic tea set with traditional designs',
        price: 899.00,
        sale_price: 699.00,
        image_url: '/images/products/tea-set.jpg',
        brand: 'indikriti',
        sku: 'IND-TEA-001',
        status: 'active',
        category: { id: 3, name: 'Home & Kitchen' }
      },
      {
        id: 6,
        name: 'Embroidered Wall Hanging',
        description: 'Traditional embroidered wall hanging with mirror work',
        price: 799.00,
        sale_price: 599.00,
        image_url: '/images/products/wall-hanging.jpg',
        brand: 'indikriti',
        sku: 'IND-WAL-001',
        status: 'active',
        category: { id: 5, name: 'Handicrafts' }
      }
    ];

    // Apply filters
    let filteredProducts = sampleProducts;

    if (req.query.category_id) {
      filteredProducts = filteredProducts.filter(p => p.category.id == req.query.category_id);
    }

    if (req.query.brand) {
      filteredProducts = filteredProducts.filter(p => p.brand === req.query.brand);
    }

    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    // Apply pagination
    const total = filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching public products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get public product by ID for website (no authentication required)
 */
exports.getPublicProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Sample product data (in real implementation, fetch from database)
    const sampleProducts = {
      '1': {
        id: 1,
        name: 'Handwoven Silk Saree',
        description: 'Beautiful traditional silk saree with intricate patterns. Made from pure silk with traditional weaving techniques passed down through generations.',
        price: 5999.00,
        sale_price: 4999.00,
        image_url: '/images/products/silk-saree.jpg',
        brand: 'indikriti',
        sku: 'IND-SAR-001',
        status: 'active',
        specifications: 'Material: Pure Silk, Length: 6 meters, Care: Dry clean only',
        category: { id: 6, name: 'Textiles' }
      },
      '2': {
        id: 2,
        name: 'Brass Decorative Lamp',
        description: 'Traditional brass lamp with intricate carvings. Perfect for home decoration and creating a warm ambiance.',
        price: 2499.00,
        sale_price: 1999.00,
        image_url: '/images/products/brass-lamp.jpg',
        brand: 'indikriti',
        sku: 'IND-LAM-001',
        status: 'active',
        specifications: 'Material: Brass, Height: 12 inches, Weight: 2 kg',
        category: { id: 5, name: 'Handicrafts' }
      }
    };

    const product = sampleProducts[id];

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error('Error fetching public product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
