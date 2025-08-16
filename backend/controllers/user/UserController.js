/**
 * User Controller - Handles CRUD operations for users
 */

const { User, Role, Company } = require('../../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const authConfig = require('../../config/auth');
const logger = require('../../utils/logger');

/**
 * Get all users with optional filtering
 */
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    
    // Apply filters
    const where = {};
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (req.query.role_id) {
      where.role_id = req.query.role_id;
    }
    
    // Add company filter (if applicable)
    if (req.companyId && !req.isSuperAdmin) {
      where.company_id = req.companyId;
    }
    
    // Get users with pagination
    const { count, rows } = await User.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { model: Role, attributes: ['id', 'name'] },
        { model: Company, attributes: ['id', 'name'] }
      ],
      attributes: { exclude: ['password'] },
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
    logger.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Search users
 */
exports.searchUsers = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Search users endpoint',
      data: []
    });
  } catch (error) {
    logger.error('Error searching users:', error);
    return res.status(500).json({ success: false, message: 'Failed to search users' });
  }
};

/**
 * Get user by ID
 */
exports.getUserById = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Get user by ID endpoint',
      data: { id: req.params.id }
    });
  } catch (error) {
    logger.error('Error getting user:', error);
    return res.status(500).json({ success: false, message: 'Failed to get user' });
  }
};

/**
 * Create new user
 */
exports.createUser = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Create user endpoint',
      data: { ...req.body }
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    return res.status(500).json({ success: false, message: 'Failed to create user' });
  }
};

/**
 * Update user
 */
exports.updateUser = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Update user endpoint',
      data: { id: req.params.id, ...req.body }
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    return res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

/**
 * Delete user
 */
exports.deleteUser = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Delete user endpoint',
      data: { id: req.params.id }
    });
  } catch (error) {
    logger.error('Error deleting user:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

/**
 * Update user status
 */
exports.updateUserStatus = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Update user status endpoint',
      data: { id: req.params.id, status: req.body.status }
    });
  } catch (error) {
    logger.error('Error updating user status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update user status' });
  }
};

/**
 * Get user activity
 */
exports.getUserActivity = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Get user activity endpoint',
      data: { id: req.params.id, activities: [] }
    });
  } catch (error) {
    logger.error('Error getting user activity:', error);
    return res.status(500).json({ success: false, message: 'Failed to get user activity' });
  }
};

/**
 * Get user profile
 */
exports.getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Get profile endpoint',
      data: { id: req.user.id }
    });
  } catch (error) {
    logger.error('Error getting profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to get profile' });
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Update profile endpoint',
      data: { id: req.user.id, ...req.body }
    });
  } catch (error) {
    logger.error('Error updating profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

/**
 * Update user avatar
 */
exports.updateAvatar = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Update avatar endpoint',
      data: { id: req.user.id, avatar: req.body.avatar }
    });
  } catch (error) {
    logger.error('Error updating avatar:', error);
    return res.status(500).json({ success: false, message: 'Failed to update avatar' });
  }
};

/**
 * Update user preferences
 */
exports.updatePreferences = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Update preferences endpoint',
      data: { id: req.user.id, preferences: req.body.preferences }
    });
  } catch (error) {
    logger.error('Error updating preferences:', error);
    return res.status(500).json({ success: false, message: 'Failed to update preferences' });
  }
};
