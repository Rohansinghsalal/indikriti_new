/**
 * Ticket Controller - Handles support ticket operations
 */

const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

/**
 * Get all tickets
 */
exports.getAllTickets = async (req, res) => {
  try {
    // Mock tickets data
    const tickets = [
      {
        id: 1,
        subject: 'Order issue #1234',
        description: 'I have not received my order yet',
        status: 'open',
        priority: 'medium',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        customer: {
          id: 101,
          name: 'John Doe',
          email: 'john@example.com'
        },
        assigned_to: null
      },
      {
        id: 2,
        subject: 'Payment failed',
        description: 'I tried to pay but it failed',
        status: 'in_progress',
        priority: 'high',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        customer: {
          id: 102,
          name: 'Jane Smith',
          email: 'jane@example.com'
        },
        assigned_to: {
          id: 201,
          name: 'Support Agent'
        }
      }
    ];
    
    return res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    logger.error('Error fetching tickets:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get ticket by ID
 */
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock ticket data
    const ticket = {
      id: parseInt(id),
      subject: 'Order issue #1234',
      description: 'I have not received my order yet',
      status: 'open',
      priority: 'medium',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      customer: {
        id: 101,
        name: 'John Doe',
        email: 'john@example.com'
      },
      assigned_to: null
    };
    
    return res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    logger.error('Error fetching ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create ticket
 */
exports.createTicket = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const ticket = {
      id: Date.now(),
      ...req.body,
      status: 'open',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket
    });
  } catch (error) {
    logger.error('Error creating ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update ticket
 */
exports.updateTicket = async (req, res) => {
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
    
    const ticket = {
      id: parseInt(id),
      ...req.body,
      updated_at: new Date()
    };
    
    return res.json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket
    });
  } catch (error) {
    logger.error('Error updating ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete ticket
 */
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    return res.json({
      success: true,
      message: 'Ticket deleted successfully',
      data: { id: parseInt(id) }
    });
  } catch (error) {
    logger.error('Error deleting ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update ticket status
 */
exports.updateTicketStatus = async (req, res) => {
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
    
    return res.json({
      success: true,
      message: 'Ticket status updated successfully',
      data: {
        id: parseInt(id),
        status,
        updated_at: new Date()
      }
    });
  } catch (error) {
    logger.error('Error updating ticket status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update ticket status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update ticket priority
 */
exports.updateTicketPriority = async (req, res) => {
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
    const { priority } = req.body;
    
    return res.json({
      success: true,
      message: 'Ticket priority updated successfully',
      data: {
        id: parseInt(id),
        priority,
        updated_at: new Date()
      }
    });
  } catch (error) {
    logger.error('Error updating ticket priority:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update ticket priority',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Assign ticket
 */
exports.assignTicket = async (req, res) => {
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
    const { user_id } = req.body;
    
    return res.json({
      success: true,
      message: 'Ticket assigned successfully',
      data: {
        id: parseInt(id),
        assigned_to: {
          id: user_id,
          name: 'Support Agent' // In a real app, we would fetch the user's name
        },
        updated_at: new Date()
      }
    });
  } catch (error) {
    logger.error('Error assigning ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to assign ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get ticket replies
 */
exports.getTicketReplies = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock replies data
    const replies = [
      {
        id: 1001,
        ticket_id: parseInt(id),
        content: 'We are looking into this issue.',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        user: {
          id: 201,
          name: 'Support Agent',
          is_staff: true
        }
      },
      {
        id: 1002,
        ticket_id: parseInt(id),
        content: 'Thank you for checking.',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        user: {
          id: 101,
          name: 'John Doe',
          is_staff: false
        }
      }
    ];
    
    return res.json({
      success: true,
      data: replies
    });
  } catch (error) {
    logger.error('Error fetching ticket replies:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket replies',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Add ticket reply
 */
exports.addTicketReply = async (req, res) => {
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
    const { content } = req.body;
    
    const reply = {
      id: Date.now(),
      ticket_id: parseInt(id),
      content,
      created_at: new Date(),
      user: {
        id: req.user?.id || 201,
        name: req.user?.name || 'Support Agent',
        is_staff: true
      }
    };
    
    return res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data: reply
    });
  } catch (error) {
    logger.error('Error adding ticket reply:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add reply',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update ticket reply
 */
exports.updateTicketReply = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { id, replyId } = req.params;
    const { content } = req.body;
    
    return res.json({
      success: true,
      message: 'Reply updated successfully',
      data: {
        id: parseInt(replyId),
        ticket_id: parseInt(id),
        content,
        updated_at: new Date()
      }
    });
  } catch (error) {
    logger.error('Error updating ticket reply:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update reply',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete ticket reply
 */
exports.deleteTicketReply = async (req, res) => {
  try {
    const { id, replyId } = req.params;
    
    return res.json({
      success: true,
      message: 'Reply deleted successfully',
      data: {
        id: parseInt(replyId),
        ticket_id: parseInt(id)
      }
    });
  } catch (error) {
    logger.error('Error deleting ticket reply:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete reply',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get ticket attachments
 */
exports.getTicketAttachments = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock attachments data
    const attachments = [
      {
        id: 2001,
        ticket_id: parseInt(id),
        filename: 'screenshot.png',
        file_url: `/uploads/tickets/${id}/screenshot.png`,
        file_size: 256000,
        mime_type: 'image/png',
        uploaded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        uploaded_by: {
          id: 101,
          name: 'John Doe'
        }
      }
    ];
    
    return res.json({
      success: true,
      data: attachments
    });
  } catch (error) {
    logger.error('Error fetching ticket attachments:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch attachments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Upload ticket attachment
 */
exports.uploadTicketAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, we would handle file upload here
    
    const attachment = {
      id: Date.now(),
      ticket_id: parseInt(id),
      filename: req.body.filename || 'file.pdf',
      file_url: `/uploads/tickets/${id}/${Date.now()}_${req.body.filename || 'file.pdf'}`,
      file_size: req.body.size || 125000,
      mime_type: req.body.mime_type || 'application/pdf',
      uploaded_at: new Date(),
      uploaded_by: {
        id: req.user?.id || 201,
        name: req.user?.name || 'Support Agent'
      }
    };
    
    return res.status(201).json({
      success: true,
      message: 'Attachment uploaded successfully',
      data: attachment
    });
  } catch (error) {
    logger.error('Error uploading attachment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload attachment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete ticket attachment
 */
exports.deleteTicketAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;
    
    return res.json({
      success: true,
      message: 'Attachment deleted successfully',
      data: {
        id: parseInt(attachmentId),
        ticket_id: parseInt(id)
      }
    });
  } catch (error) {
    logger.error('Error deleting attachment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete attachment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
