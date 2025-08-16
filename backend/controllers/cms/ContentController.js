/**
 * Content Controller - Manages content blocks, media, and menus
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');
const path = require('path');

/**
 * Get all content blocks
 */
exports.getAllBlocks = async (req, res) => {
  try {
    // Mock data for content blocks
    const blocks = [
      { id: 1, name: 'Header Block', key: 'header', content: '<h1>Welcome to Our Store</h1>', status: 'active' },
      { id: 2, name: 'Footer Block', key: 'footer', content: '<footer>Copyright 2023</footer>', status: 'active' },
      { id: 3, name: 'Sidebar', key: 'sidebar', content: '<div>Sidebar content</div>', status: 'active' }
    ];

    return res.json({
      success: true,
      message: 'Content blocks retrieved successfully',
      data: blocks
    });
  } catch (error) {
    logger.error('Error getting content blocks:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving content blocks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create a new content block
 */
exports.createBlock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Mock creating a content block
    const newBlock = {
      id: 4,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return res.status(201).json({
      success: true,
      message: 'Content block created successfully',
      data: newBlock
    });
  } catch (error) {
    logger.error('Error creating content block:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the content block',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get content block by ID
 */
exports.getBlockById = async (req, res) => {
  try {
    const blockId = parseInt(req.params.id);
    
    // Mock fetching a block by ID
    const block = { 
      id: blockId, 
      name: `Block ${blockId}`, 
      key: `block-${blockId}`,
      content: `<div>Content for block ${blockId}</div>`,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Content block not found'
      });
    }

    return res.json({
      success: true,
      message: 'Content block retrieved successfully',
      data: block
    });
  } catch (error) {
    logger.error('Error getting content block by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the content block',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update a content block
 */
exports.updateBlock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const blockId = parseInt(req.params.id);
    
    // Mock updating a block
    const updatedBlock = {
      id: blockId,
      ...req.body,
      updatedAt: new Date()
    };

    return res.json({
      success: true,
      message: 'Content block updated successfully',
      data: updatedBlock
    });
  } catch (error) {
    logger.error('Error updating content block:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the content block',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete a content block
 */
exports.deleteBlock = async (req, res) => {
  try {
    const blockId = parseInt(req.params.id);
    
    // Mock deleting a block
    return res.json({
      success: true,
      message: `Content block with ID ${blockId} deleted successfully`
    });
  } catch (error) {
    logger.error('Error deleting content block:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the content block',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get content block by key
 */
exports.getBlockByKey = async (req, res) => {
  try {
    const key = req.params.key;
    
    // Mock fetching block by key
    const block = {
      id: Math.floor(Math.random() * 100),
      name: key,
      key: key,
      content: `<div>Content for ${key}</div>`,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Content block not found'
      });
    }

    return res.json({
      success: true,
      message: 'Content block retrieved successfully',
      data: block
    });
  } catch (error) {
    logger.error('Error getting content block by key:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the content block',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all media
 */
exports.getAllMedia = async (req, res) => {
  try {
    // Mock data for media
    const media = [
      { id: 1, filename: 'image1.jpg', path: '/uploads/image1.jpg', type: 'image/jpeg', size: 1024, createdAt: new Date() },
      { id: 2, filename: 'document.pdf', path: '/uploads/document.pdf', type: 'application/pdf', size: 2048, createdAt: new Date() },
      { id: 3, filename: 'video.mp4', path: '/uploads/video.mp4', type: 'video/mp4', size: 8192, createdAt: new Date() }
    ];

    return res.json({
      success: true,
      message: 'Media retrieved successfully',
      data: media
    });
  } catch (error) {
    logger.error('Error getting media:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving media',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Upload media
 */
exports.uploadMedia = async (req, res) => {
  try {
    // Mock upload media (in a real app, this would handle file uploads)
    const uploadedFile = {
      id: Math.floor(Math.random() * 1000),
      filename: req.body.filename || 'uploaded-file.jpg',
      path: `/uploads/${Date.now()}-${req.body.filename || 'file.jpg'}`,
      type: req.body.type || 'image/jpeg',
      size: req.body.size || 1024,
      createdAt: new Date()
    };

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: uploadedFile
    });
  } catch (error) {
    logger.error('Error uploading media:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while uploading media',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete media
 */
exports.deleteMedia = async (req, res) => {
  try {
    const mediaId = parseInt(req.params.id);
    
    // Mock deleting media
    return res.json({
      success: true,
      message: `Media with ID ${mediaId} deleted successfully`
    });
  } catch (error) {
    logger.error('Error deleting media:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the media',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create media folder
 */
exports.createFolder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Mock creating a folder
    const folder = {
      id: Math.floor(Math.random() * 1000),
      name: req.body.name,
      path: `/uploads/${req.body.name}`,
      parentId: req.body.parentId,
      createdAt: new Date()
    };

    return res.status(201).json({
      success: true,
      message: 'Folder created successfully',
      data: folder
    });
  } catch (error) {
    logger.error('Error creating media folder:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the media folder',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all media folders
 */
exports.getAllFolders = async (req, res) => {
  try {
    // Mock data for folders
    const folders = [
      { id: 1, name: 'Images', path: '/uploads/images', parentId: null, createdAt: new Date() },
      { id: 2, name: 'Documents', path: '/uploads/documents', parentId: null, createdAt: new Date() },
      { id: 3, name: 'Product Images', path: '/uploads/images/products', parentId: 1, createdAt: new Date() }
    ];

    return res.json({
      success: true,
      message: 'Folders retrieved successfully',
      data: folders
    });
  } catch (error) {
    logger.error('Error getting media folders:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving media folders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all menus
 */
exports.getAllMenus = async (req, res) => {
  try {
    // Mock data for menus
    const menus = [
      { id: 1, name: 'Main Menu', location: 'header', items: [
        { id: 1, title: 'Home', url: '/', order: 1 },
        { id: 2, title: 'Products', url: '/products', order: 2 },
        { id: 3, title: 'About', url: '/about', order: 3 }
      ]},
      { id: 2, name: 'Footer Menu', location: 'footer', items: [
        { id: 4, title: 'Privacy Policy', url: '/privacy', order: 1 },
        { id: 5, title: 'Terms of Service', url: '/terms', order: 2 },
        { id: 6, title: 'Contact', url: '/contact', order: 3 }
      ]}
    ];

    return res.json({
      success: true,
      message: 'Menus retrieved successfully',
      data: menus
    });
  } catch (error) {
    logger.error('Error getting menus:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving menus',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create a menu
 */
exports.createMenu = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Mock creating a menu
    const menu = {
      id: Math.floor(Math.random() * 1000),
      ...req.body,
      items: req.body.items || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return res.status(201).json({
      success: true,
      message: 'Menu created successfully',
      data: menu
    });
  } catch (error) {
    logger.error('Error creating menu:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the menu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get menu by ID
 */
exports.getMenuById = async (req, res) => {
  try {
    const menuId = parseInt(req.params.id);
    
    // Mock fetching a menu by ID
    const menu = { 
      id: menuId, 
      name: `Menu ${menuId}`,
      location: menuId === 1 ? 'header' : 'footer',
      items: [
        { id: 1, title: 'Home', url: '/', order: 1 },
        { id: 2, title: 'About', url: '/about', order: 2 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    return res.json({
      success: true,
      message: 'Menu retrieved successfully',
      data: menu
    });
  } catch (error) {
    logger.error('Error getting menu by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the menu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update a menu
 */
exports.updateMenu = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const menuId = parseInt(req.params.id);
    
    // Mock updating a menu
    const updatedMenu = {
      id: menuId,
      ...req.body,
      updatedAt: new Date()
    };

    return res.json({
      success: true,
      message: 'Menu updated successfully',
      data: updatedMenu
    });
  } catch (error) {
    logger.error('Error updating menu:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the menu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete a menu
 */
exports.deleteMenu = async (req, res) => {
  try {
    const menuId = parseInt(req.params.id);
    
    // Mock deleting a menu
    return res.json({
      success: true,
      message: `Menu with ID ${menuId} deleted successfully`
    });
  } catch (error) {
    logger.error('Error deleting menu:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the menu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get menu by location
 */
exports.getMenuByLocation = async (req, res) => {
  try {
    const location = req.params.location;
    
    // Mock fetching menu by location
    const menu = {
      id: location === 'header' ? 1 : 2,
      name: location === 'header' ? 'Main Menu' : 'Footer Menu',
      location: location,
      items: [
        { id: 1, title: 'Home', url: '/', order: 1 },
        { id: 2, title: 'About', url: '/about', order: 2 },
        { id: 3, title: 'Contact', url: '/contact', order: 3 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    return res.json({
      success: true,
      message: 'Menu retrieved successfully',
      data: menu
    });
  } catch (error) {
    logger.error('Error getting menu by location:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the menu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
