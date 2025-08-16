/**
 * Brand Category Controller - Handles operations for brand-specific categories
 */

const { IndikritiBrandCategory, WinsomeLaneBrandCategory, Product } = require('../../models');
const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

/**
 * Get categories by brand
 */
exports.getCategoriesByBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    
    if (!brand || !['indikriti', 'winsomeLane'].includes(brand)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand. Must be either "indikriti" or "winsomeLane"'
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
    logger.error('Error fetching categories by brand:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};

/**
 * Create new brand category
 */
exports.createBrandCategory = async (req, res) => {
  try {
    const { brand } = req.params;
    const { name, description, sort_order } = req.body;
    
    if (!brand || !['indikriti', 'winsomeLane'].includes(brand)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand. Must be either "indikriti" or "winsomeLane"'
      });
    }
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }
    
    let newCategory;
    if (brand === 'indikriti') {
      newCategory = await IndikritiBrandCategory.create({
        name,
        description: description || '',
        sort_order: sort_order || 0,
        status: 'active'
      });
    } else {
      newCategory = await WinsomeLaneBrandCategory.create({
        name,
        description: description || '',
        sort_order: sort_order || 0,
        status: 'active'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (error) {
    logger.error('Error creating brand category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create category'
    });
  }
};

/**
 * Update brand category
 */
exports.updateBrandCategory = async (req, res) => {
  try {
    const { brand, id } = req.params;
    const { name, description, sort_order, status } = req.body;
    
    if (!brand || !['indikriti', 'winsomeLane'].includes(brand)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand. Must be either "indikriti" or "winsomeLane"'
      });
    }
    
    let category;
    if (brand === 'indikriti') {
      category = await IndikritiBrandCategory.findByPk(id);
    } else {
      category = await WinsomeLaneBrandCategory.findByPk(id);
    }
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Update category
    await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      sort_order: sort_order !== undefined ? sort_order : category.sort_order,
      status: status || category.status
    });
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    logger.error('Error updating brand category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update category'
    });
  }
};

/**
 * Delete brand category
 */
exports.deleteBrandCategory = async (req, res) => {
  try {
    const { brand, id } = req.params;
    
    if (!brand || !['indikriti', 'winsomeLane'].includes(brand)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand. Must be either "indikriti" or "winsomeLane"'
      });
    }
    
    let category;
    if (brand === 'indikriti') {
      category = await IndikritiBrandCategory.findByPk(id);
    } else {
      category = await WinsomeLaneBrandCategory.findByPk(id);
    }
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if category has products
    const productCount = await Product.count({
      where: brand === 'indikriti' 
        ? { indikriti_category_id: id }
        : { winsomelane_category_id: id }
    });
    
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} products associated with it.`
      });
    }
    
    await category.destroy();
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting brand category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete category'
    });
  }
};

/**
 * Get category by ID
 */
exports.getBrandCategoryById = async (req, res) => {
  try {
    const { brand, id } = req.params;
    
    if (!brand || !['indikriti', 'winsomeLane'].includes(brand)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand. Must be either "indikriti" or "winsomeLane"'
      });
    }
    
    let category;
    if (brand === 'indikriti') {
      category = await IndikritiBrandCategory.findByPk(id);
    } else {
      category = await WinsomeLaneBrandCategory.findByPk(id);
    }
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    logger.error('Error fetching brand category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch category'
    });
  }
};

/**
 * Get all brands
 */
exports.getAllBrands = async (req, res) => {
  try {
    const brands = [
      { id: 'indikriti', name: 'Indikriti' },
      { id: 'winsomeLane', name: 'Winsome Lane' }
    ];
    
    res.json({
      success: true,
      data: brands
    });
  } catch (error) {
    logger.error('Error fetching brands:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch brands'
    });
  }
};
