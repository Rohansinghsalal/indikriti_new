/**
 * Enhanced 4-Level Hierarchy Controller
 * Handles Brand → Category → Subcategory → Product Type hierarchy
 */

const {
  IndikritiBrandCategory,
  WinsomeLaneBrandCategory,
  IndikritiBrandSubcategory,
  WinsomeLaneBrandSubcategory,
  IndikritiBrandProductType,
  WinsomeLaneBrandProductType,
  Product,
  sequelize
} = require('../../models');
const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

/**
 * Get subcategories by brand and category
 */
exports.getSubcategoriesByBrandAndCategory = async (req, res) => {
  try {
    const { brand, categoryId } = req.params;
    
    if (!brand || !['indikriti', 'winsomeLane'].includes(brand)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand. Must be either "indikriti" or "winsomeLane"'
      });
    }
    
    let subcategories;
    if (brand === 'indikriti') {
      subcategories = await IndikritiBrandSubcategory.findAll({
        where: { 
          category_id: categoryId,
          status: 'active' 
        },
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });
    } else {
      subcategories = await WinsomeLaneBrandSubcategory.findAll({
        where: { 
          category_id: categoryId,
          status: 'active' 
        },
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });
    }
    
    res.json({
      success: true,
      data: subcategories,
      brand: brand,
      categoryId: categoryId
    });
  } catch (error) {
    logger.error('Error fetching subcategories by brand and category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories'
    });
  }
};

/**
 * Get product types by brand and subcategory
 */
exports.getProductTypesByBrandAndSubcategory = async (req, res) => {
  try {
    const { brand, subcategoryId } = req.params;
    
    if (!brand || !['indikriti', 'winsomeLane'].includes(brand)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand. Must be either "indikriti" or "winsomeLane"'
      });
    }
    
    let productTypes;
    if (brand === 'indikriti') {
      productTypes = await IndikritiBrandProductType.findAll({
        where: { 
          subcategory_id: subcategoryId,
          status: 'active' 
        },
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });
    } else {
      productTypes = await WinsomeLaneBrandProductType.findAll({
        where: { 
          subcategory_id: subcategoryId,
          status: 'active' 
        },
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });
    }
    
    res.json({
      success: true,
      data: productTypes,
      brand: brand,
      subcategoryId: subcategoryId
    });
  } catch (error) {
    logger.error('Error fetching product types by brand and subcategory:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product types'
    });
  }
};

/**
 * Get complete hierarchy for a brand
 */
exports.getCompleteHierarchyByBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    
    if (!brand || !['indikriti', 'winsomeLane'].includes(brand)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand. Must be either "indikriti" or "winsomeLane"'
      });
    }
    
    let hierarchy;
    if (brand === 'indikriti') {
      hierarchy = await IndikritiBrandCategory.findAll({
        where: { status: 'active' },
        include: [
          {
            model: IndikritiBrandSubcategory,
            as: 'indikriti_subcategories',
            where: { status: 'active' },
            required: false,
            include: [
              {
                model: IndikritiBrandProductType,
                as: 'indikriti_productTypes',
                where: { status: 'active' },
                required: false
              }
            ]
          }
        ],
        order: [
          ['sort_order', 'ASC'],
          ['name', 'ASC'],
          [{ model: IndikritiBrandSubcategory, as: 'indikriti_subcategories' }, 'sort_order', 'ASC'],
          [{ model: IndikritiBrandSubcategory, as: 'indikriti_subcategories' }, { model: IndikritiBrandProductType, as: 'indikriti_productTypes' }, 'sort_order', 'ASC']
        ]
      });
    } else {
      hierarchy = await WinsomeLaneBrandCategory.findAll({
        where: { status: 'active' },
        include: [
          {
            model: WinsomeLaneBrandSubcategory,
            as: 'winsomelane_subcategories',
            where: { status: 'active' },
            required: false,
            include: [
              {
                model: WinsomeLaneBrandProductType,
                as: 'winsomelane_productTypes',
                where: { status: 'active' },
                required: false
              }
            ]
          }
        ],
        order: [
          ['sort_order', 'ASC'],
          ['name', 'ASC'],
          [{ model: WinsomeLaneBrandSubcategory, as: 'winsomelane_subcategories' }, 'sort_order', 'ASC'],
          [{ model: WinsomeLaneBrandSubcategory, as: 'winsomelane_subcategories' }, { model: WinsomeLaneBrandProductType, as: 'winsomelane_productTypes' }, 'sort_order', 'ASC']
        ]
      });
    }

    // Set cache control headers to prevent 304 responses during development
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'ETag': `"hierarchy-${brand}-${Date.now()}"` // Dynamic ETag to force fresh responses
    });

    res.json({
      success: true,
      data: hierarchy,
      brand: brand
    });
  } catch (error) {
    logger.error('Error fetching complete hierarchy by brand:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch hierarchy'
    });
  }
};

/**
 * Create subcategory for a brand category
 */
exports.createBrandSubcategory = async (req, res) => {
  try {
    const { brand, categoryId } = req.params;
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
        message: 'Subcategory name is required'
      });
    }
    
    let newSubcategory;
    if (brand === 'indikriti') {
      newSubcategory = await IndikritiBrandSubcategory.create({
        name,
        description: description || '',
        category_id: categoryId,
        sort_order: sort_order || 0,
        status: 'active'
      });
    } else {
      newSubcategory = await WinsomeLaneBrandSubcategory.create({
        name,
        description: description || '',
        category_id: categoryId,
        sort_order: sort_order || 0,
        status: 'active'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      data: newSubcategory
    });
  } catch (error) {
    logger.error('Error creating brand subcategory:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create subcategory'
    });
  }
};

/**
 * Create product type for a brand subcategory
 */
exports.createBrandProductType = async (req, res) => {
  try {
    const { brand, subcategoryId } = req.params;
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
        message: 'Product type name is required'
      });
    }
    
    let newProductType;
    if (brand === 'indikriti') {
      newProductType = await IndikritiBrandProductType.create({
        name,
        description: description || '',
        subcategory_id: subcategoryId,
        sort_order: sort_order || 0,
        status: 'active'
      });
    } else {
      newProductType = await WinsomeLaneBrandProductType.create({
        name,
        description: description || '',
        subcategory_id: subcategoryId,
        sort_order: sort_order || 0,
        status: 'active'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Product type created successfully',
      data: newProductType
    });
  } catch (error) {
    logger.error('Error creating brand product type:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product type'
    });
  }
};

/**
 * Update subcategory for a brand
 */
exports.updateBrandSubcategory = async (req, res) => {
  try {
    const { brand, subcategoryId } = req.params;
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
        message: 'Subcategory name is required'
      });
    }

    let subcategory;
    if (brand === 'indikriti') {
      subcategory = await IndikritiBrandSubcategory.findByPk(subcategoryId);
      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: 'Subcategory not found'
        });
      }

      await subcategory.update({
        name,
        description: description || '',
        sort_order: sort_order || 0
      });
    } else {
      subcategory = await WinsomeLaneBrandSubcategory.findByPk(subcategoryId);
      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: 'Subcategory not found'
        });
      }

      await subcategory.update({
        name,
        description: description || '',
        sort_order: sort_order || 0
      });
    }

    res.json({
      success: true,
      data: subcategory,
      message: 'Subcategory updated successfully'
    });
  } catch (error) {
    logger.error('Error updating brand subcategory:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update subcategory'
    });
  }
};

/**
 * Delete subcategory for a brand
 */
exports.deleteBrandSubcategory = async (req, res) => {
  try {
    const { brand, subcategoryId } = req.params;
    const { forceCascade } = req.query;

    if (!brand || !['indikriti', 'winsomeLane'].includes(brand)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand. Must be either "indikriti" or "winsomeLane"'
      });
    }

    const transaction = await sequelize.transaction();

    try {
      let subcategory;
      let ProductTypeModel;
      let ProductModel;

      if (brand === 'indikriti') {
        subcategory = await IndikritiBrandSubcategory.findByPk(subcategoryId);
        ProductTypeModel = IndikritiBrandProductType;
        // Note: You may need to import the Product model for Indikriti brand
      } else {
        subcategory = await WinsomeLaneBrandSubcategory.findByPk(subcategoryId);
        ProductTypeModel = WinsomeLaneBrandProductType;
        // Note: You may need to import the Product model for WinsomeLane brand
      }

      if (!subcategory) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Subcategory not found'
        });
      }

      if (forceCascade === 'true') {
        // Cascading delete: Delete all related data first

        // Step 1: Delete all product types in this subcategory
        const productTypes = await ProductTypeModel.findAll({
          where: { subcategory_id: subcategoryId }
        });

        for (const productType of productTypes) {
          await productType.destroy({ transaction });
        }

        // Step 2: Delete the subcategory
        await subcategory.destroy({ transaction });

        await transaction.commit();

        res.json({
          success: true,
          message: `Subcategory and all related data deleted successfully (${productTypes.length} product types)`,
          data: {
            id: parseInt(subcategoryId),
            cascaded: true,
            deletedCounts: {
              productTypes: productTypes.length
            }
          }
        });
      } else {
        // Non-cascading delete: Check for dependencies first
        const productTypes = await ProductTypeModel.findAll({
          where: { subcategory_id: subcategoryId }
        });

        if (productTypes.length > 0) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `Cannot delete subcategory because it has ${productTypes.length} associated product types. Use ?forceCascade=true to delete all related data.`,
            suggestion: 'Use ?forceCascade=true to delete all related data'
          });
        }

        // Safe to delete
        await subcategory.destroy({ transaction });
        await transaction.commit();

        res.json({
          success: true,
          message: 'Subcategory deleted successfully',
          data: {
            id: parseInt(subcategoryId),
            cascaded: false
          }
        });
      }
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    logger.error('Error deleting brand subcategory:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete subcategory',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update product type for a brand
 */
exports.updateBrandProductType = async (req, res) => {
  try {
    const { brand, productTypeId } = req.params;
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
        message: 'Product type name is required'
      });
    }

    let productType;
    if (brand === 'indikriti') {
      productType = await IndikritiBrandProductType.findByPk(productTypeId);
      if (!productType) {
        return res.status(404).json({
          success: false,
          message: 'Product type not found'
        });
      }

      await productType.update({
        name,
        description: description || '',
        sort_order: sort_order || 0
      });
    } else {
      productType = await WinsomeLaneBrandProductType.findByPk(productTypeId);
      if (!productType) {
        return res.status(404).json({
          success: false,
          message: 'Product type not found'
        });
      }

      await productType.update({
        name,
        description: description || '',
        sort_order: sort_order || 0
      });
    }

    res.json({
      success: true,
      data: productType,
      message: 'Product type updated successfully'
    });
  } catch (error) {
    logger.error('Error updating brand product type:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product type'
    });
  }
};

/**
 * Delete product type for a brand
 */
exports.deleteBrandProductType = async (req, res) => {
  try {
    const { brand, productTypeId } = req.params;

    if (!brand || !['indikriti', 'winsomeLane'].includes(brand)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand. Must be either "indikriti" or "winsomeLane"'
      });
    }

    let productType;
    if (brand === 'indikriti') {
      productType = await IndikritiBrandProductType.findByPk(productTypeId);
      if (!productType) {
        return res.status(404).json({
          success: false,
          message: 'Product type not found'
        });
      }

      await productType.destroy();
    } else {
      productType = await WinsomeLaneBrandProductType.findByPk(productTypeId);
      if (!productType) {
        return res.status(404).json({
          success: false,
          message: 'Product type not found'
        });
      }

      await productType.destroy();
    }

    res.json({
      success: true,
      message: 'Product type deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting brand product type:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product type'
    });
  }
};
