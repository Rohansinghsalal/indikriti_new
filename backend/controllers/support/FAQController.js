/**
 * FAQ Controller - Handles FAQ functionality
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

/**
 * Get all FAQs
 */
exports.getAllFAQs = async (req, res) => {
  try {
    // Mock FAQs data
    const faqs = [
      {
        id: 1,
        question: 'How do I place an order?',
        answer: 'You can place an order by adding products to your cart and proceeding to checkout.',
        category_id: 1,
        category: 'Orders',
        status: 'published',
        order: 1
      },
      {
        id: 2,
        question: 'What payment methods do you accept?',
        answer: 'We accept credit cards, PayPal, and bank transfers.',
        category_id: 2,
        category: 'Payments',
        status: 'published',
        order: 1
      },
      {
        id: 3,
        question: 'How long does shipping take?',
        answer: 'Shipping typically takes 3-5 business days within the country.',
        category_id: 3,
        category: 'Shipping',
        status: 'published',
        order: 1
      }
    ];
    
    return res.json({
      success: true,
      data: faqs
    });
  } catch (error) {
    logger.error('Error fetching FAQs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get FAQ categories
 */
exports.getFAQCategories = async (req, res) => {
  try {
    // Mock categories data
    const categories = [
      {
        id: 1,
        name: 'Orders',
        description: 'Questions about placing and managing orders',
        order: 1,
        faq_count: 5
      },
      {
        id: 2,
        name: 'Payments',
        description: 'Questions about payment methods and issues',
        order: 2,
        faq_count: 4
      },
      {
        id: 3,
        name: 'Shipping',
        description: 'Questions about shipping and delivery',
        order: 3,
        faq_count: 6
      }
    ];
    
    return res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    logger.error('Error fetching FAQ categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get FAQs by category
 */
exports.getFAQsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock FAQs by category
    const faqs = [
      {
        id: 1,
        question: 'How do I place an order?',
        answer: 'You can place an order by adding products to your cart and proceeding to checkout.',
        category_id: parseInt(id),
        status: 'published',
        order: 1
      },
      {
        id: 4,
        question: 'How do I track my order?',
        answer: 'You can track your order in your account under "Order History".',
        category_id: parseInt(id),
        status: 'published',
        order: 2
      }
    ];
    
    const category = {
      id: parseInt(id),
      name: id == 1 ? 'Orders' : id == 2 ? 'Payments' : 'Shipping',
      description: 'Category description'
    };
    
    return res.json({
      success: true,
      data: {
        category,
        faqs
      }
    });
  } catch (error) {
    logger.error('Error fetching FAQs by category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs by category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get FAQ by ID
 */
exports.getFAQById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock FAQ data
    const faq = {
      id: parseInt(id),
      question: 'How do I place an order?',
      answer: 'You can place an order by adding products to your cart and proceeding to checkout.',
      category_id: 1,
      category: 'Orders',
      status: 'published',
      order: 1,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    };
    
    return res.json({
      success: true,
      data: faq
    });
  } catch (error) {
    logger.error('Error fetching FAQ:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create FAQ
 */
exports.createFAQ = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { question, answer, category_id, status = 'draft', order } = req.body;
    
    const faq = {
      id: Date.now(),
      question,
      answer,
      category_id,
      status,
      order,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq
    });
  } catch (error) {
    logger.error('Error creating FAQ:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create FAQ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update FAQ
 */
exports.updateFAQ = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { id } = req.params;
    const { question, answer, category_id, status, order } = req.body;
    
    const faq = {
      id: parseInt(id),
      question,
      answer,
      category_id,
      status,
      order,
      updated_at: new Date()
    };
    
    return res.json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq
    });
  } catch (error) {
    logger.error('Error updating FAQ:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update FAQ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete FAQ
 */
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    
    return res.json({
      success: true,
      message: 'FAQ deleted successfully',
      data: { id: parseInt(id) }
    });
  } catch (error) {
    logger.error('Error deleting FAQ:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete FAQ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Toggle FAQ status
 */
exports.toggleFAQStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    return res.json({
      success: true,
      message: 'FAQ status updated successfully',
      data: {
        id: parseInt(id),
        status,
        updated_at: new Date()
      }
    });
  } catch (error) {
    logger.error('Error toggling FAQ status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle FAQ status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create FAQ category
 */
exports.createFAQCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { name, description, order } = req.body;
    
    const category = {
      id: Date.now(),
      name,
      description,
      order,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return res.status(201).json({
      success: true,
      message: 'FAQ category created successfully',
      data: category
    });
  } catch (error) {
    logger.error('Error creating FAQ category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create FAQ category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update FAQ category
 */
exports.updateFAQCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { id } = req.params;
    const { name, description, order } = req.body;
    
    const category = {
      id: parseInt(id),
      name,
      description,
      order,
      updated_at: new Date()
    };
    
    return res.json({
      success: true,
      message: 'FAQ category updated successfully',
      data: category
    });
  } catch (error) {
    logger.error('Error updating FAQ category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update FAQ category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete FAQ category
 */
exports.deleteFAQCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    return res.json({
      success: true,
      message: 'FAQ category deleted successfully',
      data: { id: parseInt(id) }
    });
  } catch (error) {
    logger.error('Error deleting FAQ category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete FAQ category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
