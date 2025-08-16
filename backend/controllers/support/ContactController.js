/**
 *  - Basic controller structure
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

/**
 * List all records
 */
exports.index = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: 'Controller initialized successfully'
    });
  } catch (error) {
    logger.error('Error in controller:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Contact Controller - Handles contact form submissions
 */

/**
 * Submit contact form
 */
exports.submitContactForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { name, email, subject, message } = req.body;
    
    const submission = {
      id: Date.now(),
      name,
      email,
      subject,
      message,
      status: 'pending',
      created_at: new Date()
    };
    
    return res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: submission
    });
  } catch (error) {
    logger.error('Error submitting contact form:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get contact submissions
 */
exports.getContactSubmissions = async (req, res) => {
  try {
    // Mock submissions data
    const submissions = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Product Inquiry',
        message: 'I need information about your products.',
        status: 'pending',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Order Issue',
        message: 'I have a problem with my order.',
        status: 'replied',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        replied_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      }
    ];
    
    return res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    logger.error('Error fetching contact submissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch contact submissions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get contact submission by ID
 */
exports.getContactSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock submission data
    const submission = {
      id: parseInt(id),
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Product Inquiry',
      message: 'I need information about your products.',
      status: 'pending',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    };
    
    return res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    logger.error('Error fetching contact submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch contact submission',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update contact submission status
 */
exports.updateContactSubmissionStatus = async (req, res) => {
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
    const { status } = req.body;
    
    if (!['pending', 'in_progress', 'replied', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    return res.json({
      success: true,
      message: 'Contact submission status updated successfully',
      data: {
        id: parseInt(id),
        status,
        updated_at: new Date()
      }
    });
  } catch (error) {
    logger.error('Error updating contact submission status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update contact submission status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete contact submission
 */
exports.deleteContactSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    
    return res.json({
      success: true,
      message: 'Contact submission deleted successfully',
      data: { id: parseInt(id) }
    });
  } catch (error) {
    logger.error('Error deleting contact submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete contact submission',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Reply to contact submission
 */
exports.replyToContactSubmission = async (req, res) => {
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
    const { reply } = req.body;
    
    // In a real app, we would send the email here
    
    return res.json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        id: parseInt(id),
        reply,
        status: 'replied',
        replied_at: new Date(),
        replied_by: {
          id: req.user?.id || 1,
          name: req.user?.name || 'Admin User'
        }
      }
    });
  } catch (error) {
    logger.error('Error replying to contact submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reply to contact submission',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
