/**
 * Page Controller - Manages CMS pages
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

/**
 * Get all pages
 */
exports.getAllPages = async (req, res) => {
  try {
    // In a real application, this would fetch from database
    const mockPages = [
      { id: 1, title: 'Home Page', slug: 'home', status: 'published', updatedAt: new Date() },
      { id: 2, title: 'About Us', slug: 'about-us', status: 'published', updatedAt: new Date() },
      { id: 3, title: 'Contact', slug: 'contact', status: 'draft', updatedAt: new Date() }
    ];

    return res.json({
      success: true,
      message: 'Pages retrieved successfully',
      data: mockPages
    });
  } catch (error) {
    logger.error('Error getting pages:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving pages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create a new page
 */
exports.createPage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Mock creating a page
    const newPage = {
      id: 4,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return res.status(201).json({
      success: true,
      message: 'Page created successfully',
      data: newPage
    });
  } catch (error) {
    logger.error('Error creating page:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the page',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get page by ID
 */
exports.getPageById = async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    
    // Mock fetching a page by ID
    const page = { 
      id: pageId, 
      title: `Page ${pageId}`, 
      slug: `page-${pageId}`,
      content: `<h1>Page ${pageId}</h1><p>This is the content of page ${pageId}</p>`,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    return res.json({
      success: true,
      message: 'Page retrieved successfully',
      data: page
    });
  } catch (error) {
    logger.error('Error getting page by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the page',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update a page by ID
 */
exports.updatePage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const pageId = parseInt(req.params.id);
    
    // Mock updating a page
    const updatedPage = {
      id: pageId,
      ...req.body,
      updatedAt: new Date()
    };

    return res.json({
      success: true,
      message: 'Page updated successfully',
      data: updatedPage
    });
  } catch (error) {
    logger.error('Error updating page:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the page',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete a page by ID
 */
exports.deletePage = async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    
    // Mock deleting a page
    return res.json({
      success: true,
      message: `Page with ID ${pageId} deleted successfully`
    });
  } catch (error) {
    logger.error('Error deleting page:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the page',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Publish a page by ID
 */
exports.publishPage = async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    
    // Mock publishing a page
    return res.json({
      success: true,
      message: `Page with ID ${pageId} published successfully`,
      data: {
        id: pageId,
        status: 'published',
        publishedAt: new Date()
      }
    });
  } catch (error) {
    logger.error('Error publishing page:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while publishing the page',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get page by slug
 */
exports.getPageBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    
    // Mock fetching page by slug
    const page = {
      id: Math.floor(Math.random() * 100),
      title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      slug: slug,
      content: `<h1>${slug}</h1><p>This is the content of the ${slug} page</p>`,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    return res.json({
      success: true,
      message: 'Page retrieved successfully',
      data: page
    });
  } catch (error) {
    logger.error('Error getting page by slug:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the page',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
