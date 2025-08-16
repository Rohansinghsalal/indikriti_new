/**
 * SEO Controller - Manages SEO settings for the site and individual pages
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

/**
 * Get all SEO settings
 */
exports.getAllSEOSettings = async (req, res) => {
  try {
    // Mock SEO settings data
    const seoSettings = {
      global: {
        title: 'E-Commerce Admin Dashboard',
        description: 'Admin Dashboard for Multi-Company E-Commerce Platform',
        keywords: 'admin, dashboard, e-commerce, multi-company',
        ogImage: '/uploads/og-default.jpg',
        twitterImage: '/uploads/twitter-default.jpg'
      },
      pages: [
        { 
          path: '/', 
          title: 'Home - E-Commerce Admin',
          description: 'Welcome to the E-Commerce Admin Dashboard',
          keywords: 'home, admin, dashboard' 
        },
        { 
          path: '/products', 
          title: 'Products - E-Commerce Admin',
          description: 'Manage your products in the admin dashboard',
          keywords: 'products, inventory, admin' 
        }
      ]
    };

    return res.json({
      success: true,
      message: 'SEO settings retrieved successfully',
      data: seoSettings
    });
  } catch (error) {
    logger.error('Error getting SEO settings:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving SEO settings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update global SEO settings
 */
exports.updateSEOSettings = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Mock updating global SEO settings
    const updatedSettings = {
      global: {
        ...req.body,
        updatedAt: new Date()
      }
    };

    return res.json({
      success: true,
      message: 'SEO settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    logger.error('Error updating SEO settings:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating SEO settings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get SEO settings for a specific page
 */
exports.getSEOByPage = async (req, res) => {
  try {
    const pagePath = req.params.page;
    
    // Mock SEO settings for a page
    const pageSEO = { 
      path: `/${pagePath}`, 
      title: `${pagePath.charAt(0).toUpperCase() + pagePath.slice(1)} - E-Commerce Admin`,
      description: `${pagePath.charAt(0).toUpperCase() + pagePath.slice(1)} page for the E-Commerce Admin Dashboard`,
      keywords: `${pagePath}, admin, dashboard`,
      ogImage: `/uploads/${pagePath}-og.jpg`,
      twitterImage: `/uploads/${pagePath}-twitter.jpg`,
      updatedAt: new Date()
    };

    return res.json({
      success: true,
      message: 'SEO settings retrieved successfully',
      data: pageSEO
    });
  } catch (error) {
    logger.error('Error getting SEO settings for page:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving SEO settings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update SEO settings for a specific page
 */
exports.updateSEOByPage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const pagePath = req.params.page;
    
    // Mock updating SEO settings for a page
    const updatedPageSEO = {
      path: `/${pagePath}`,
      ...req.body,
      updatedAt: new Date()
    };

    return res.json({
      success: true,
      message: `SEO settings for ${pagePath} updated successfully`,
      data: updatedPageSEO
    });
  } catch (error) {
    logger.error('Error updating SEO settings for page:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating SEO settings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
