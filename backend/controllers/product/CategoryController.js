/**
 * Category Controller - Handles operations for brand-specific product categories
 */

const {
  IndikritiBrandCategory,
  WinsomeLaneBrandCategory,
  Product,
  Company
} = require('../../models');
const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

/**
 * Get all categories - now requires brand parameter
 */
exports.getAllCategories = async (req, res) => {
  try {
    const { brand } = req.query;

    if (!brand || !['indikriti', 'winsomeLane'].includes(brand)) {
      return res.status(400).json({
        success: false,
        message: 'Brand parameter is required. Must be either "indikriti" or "winsomeLane"'
      });
    }

    let categories;
    if (brand === 'indikriti') {
      categories = await IndikritiBrandCategory.findAll({
        where: { status: 'active' },
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });
    } else {
      categories = await WinsomeLaneBrandCategory.findAll({
        where: { status: 'active' },
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });
    }

    res.json({
      success: true,
      data: categories,
      brand: brand
    });
  } catch (error) {
    logger.error('Error fetching categories:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

/**
 * Create new category
 */
exports.createCategory = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Create category endpoint',
      data: { ...req.body }
    });
  } catch (error) {
    logger.error('Error creating category:', error);
    return res.status(500).json({ success: false, message: 'Failed to create category' });
  }
};

/**
 * Get category by ID
 */
exports.getCategoryById = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Get category by ID endpoint',
      data: { id: req.params.id }
    });
  } catch (error) {
    logger.error('Error getting category:', error);
    return res.status(500).json({ success: false, message: 'Failed to get category' });
  }
};

/**
 * Update category
 */
exports.updateCategory = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Update category endpoint',
      data: { id: req.params.id, ...req.body }
    });
  } catch (error) {
    logger.error('Error updating category:', error);
    return res.status(500).json({ success: false, message: 'Failed to update category' });
  }
};

/**
 * Delete category with cascading delete support
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { brand } = req.query;

    if (!brand || !['indikriti', 'winsomeLane'].includes(brand)) {
      return res.status(400).json({
        success: false,
        message: 'Brand parameter is required. Must be either "indikriti" or "winsomeLane"'
      });
    }

    // For now, return a placeholder response
    // In a real implementation, you would delete from the brand-specific table
    res.json({
      success: true,
      message: 'Category deletion endpoint - use brand-specific controllers instead',
      data: { id: parseInt(id), brand }
    });
  } catch (error) {
    logger.error('Error deleting category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get products in a category
 */
exports.getCategoryProducts = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Get category products endpoint',
      data: { categoryId: req.params.id, products: [] }
    });
  } catch (error) {
    logger.error('Error getting category products:', error);
    return res.status(500).json({ success: false, message: 'Failed to get category products' });
  }
};

/**
 * Get category tree structure
 */
exports.getCategoryTree = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Get category tree endpoint',
      data: []
    });
  } catch (error) {
    logger.error('Error getting category tree:', error);
    return res.status(500).json({ success: false, message: 'Failed to get category tree' });
  }
};

/**
 * Get public categories for website (no authentication required)
 * Returns only Indikriti categories for the public website
 */
exports.getPublicCategories = async (req, res) => {
  try {
    // Get Indikriti categories for the public website
    const categories = await IndikritiBrandCategory.findAll({
      where: { status: 'active' },
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
      attributes: ['id', 'name', 'description']
    });

    res.json({
      success: true,
      data: categories,
      brand: 'indikriti'
    });
  } catch (error) {
    logger.error('Error fetching public categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
