/**
 * Settings Controller - Manages system settings
 */

const { Setting, User } = require('../../models');
const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

/**
 * Get all settings
 */
exports.index = async (req, res) => {
  try {
    // Add company filter (if applicable)
    const whereClause = {};
    if (req.companyId && !req.isSuperAdmin) {
      whereClause.company_id = req.companyId;
    }
    
    // Group settings by category
    const settings = await Setting.findAll({
      where: whereClause,
      order: [['category', 'ASC'], ['key', 'ASC']]
    });
    
    // Organize settings by category
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {});
    
    return res.json({
      success: true,
      data: groupedSettings
    });
  } catch (error) {
    logger.error('Error fetching settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get setting by key
 */
exports.show = async (req, res) => {
  try {
    const { key } = req.params;
    
    // Add company filter (if applicable)
    const whereClause = { key };
    if (req.companyId && !req.isSuperAdmin) {
      whereClause.company_id = req.companyId;
    }
    
    // Find setting
    const setting = await Setting.findOne({
      where: whereClause
    });
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: `Setting with key '${key}' not found`
      });
    }
    
    return res.json({
      success: true,
      data: setting
    });
  } catch (error) {
    logger.error('Error fetching setting:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch setting',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create or update setting
 */
exports.store = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { key, value, category, type = 'string', is_public = false, company_id } = req.body;
    
    // Check if user has permission
    if (!req.isSuperAdmin && !req.hasPermission('system_settings')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify settings'
      });
    }
    
    // Determine company_id
    let finalCompanyId = company_id;
    if (!req.isSuperAdmin || !finalCompanyId) {
      finalCompanyId = req.companyId;
    }
    
    // Check if setting already exists
    const existingSetting = await Setting.findOne({
      where: {
        key,
        company_id: finalCompanyId
      }
    });
    
    let setting;
    
    if (existingSetting) {
      // Update existing setting
      existingSetting.value = value;
      existingSetting.type = type;
      existingSetting.is_public = is_public;
      existingSetting.updated_by = req.user.id;
      
      setting = await existingSetting.save();
    } else {
      // Create new setting
      setting = await Setting.create({
        key,
        value,
        category,
        type,
        is_public,
        company_id: finalCompanyId,
        created_by: req.user.id
      });
    }
    
    return res.status(existingSetting ? 200 : 201).json({
      success: true,
      message: existingSetting ? 'Setting updated successfully' : 'Setting created successfully',
      data: setting
    });
  } catch (error) {
    logger.error('Error saving setting:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save setting',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update multiple settings at once
 */
exports.batchUpdate = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { settings } = req.body;
    
    // Check if user has permission
    if (!req.isSuperAdmin && !req.hasPermission('system_settings')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify settings'
      });
    }
    
    // Add company filter (if applicable)
    const whereClause = { key: Object.keys(settings) };
    if (req.companyId && !req.isSuperAdmin) {
      whereClause.company_id = req.companyId;
    }
    
    // Get existing settings
    const existingSettings = await Setting.findAll({
      where: whereClause
    });
    
    // Update each setting
    const updatedSettings = [];
    for (const existingSetting of existingSettings) {
      if (settings[existingSetting.key] !== undefined) {
        existingSetting.value = settings[existingSetting.key];
        existingSetting.updated_by = req.user.id;
        
        await existingSetting.save();
        updatedSettings.push(existingSetting);
      }
    }
    
    return res.json({
      success: true,
      message: `${updatedSettings.length} settings updated successfully`,
      data: updatedSettings
    });
  } catch (error) {
    logger.error('Error updating settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete setting
 */
exports.destroy = async (req, res) => {
  try {
    const { key } = req.params;
    
    // Check if user has permission
    if (!req.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can delete settings'
      });
    }
    
    // Add company filter (if applicable)
    const whereClause = { key };
    if (req.companyId && !req.isSuperAdmin) {
      whereClause.company_id = req.companyId;
    }
    
    // Find setting
    const setting = await Setting.findOne({
      where: whereClause
    });
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: `Setting with key '${key}' not found`
      });
    }
    
    // Delete setting
    await setting.destroy();
    
    return res.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting setting:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete setting',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all settings
 */
exports.getAllSettings = async (req, res) => {
  try {
    // Add company filter (if applicable)
    const whereClause = {};
    if (req.companyId && !req.isSuperAdmin) {
      whereClause.company_id = req.companyId;
    }
    
    // Return placeholder data
    return res.json({
      success: true,
      data: {
        general: [
          { key: 'company_name', value: 'E-Commerce Inc.', type: 'string' },
          { key: 'site_title', value: 'Admin Dashboard', type: 'string' },
          { key: 'contact_email', value: 'contact@example.com', type: 'string' }
        ],
        appearance: [
          { key: 'primary_color', value: '#3f51b5', type: 'color' },
          { key: 'secondary_color', value: '#f50057', type: 'color' },
          { key: 'logo_url', value: '/images/logo.png', type: 'image' }
        ],
        notifications: [
          { key: 'email_notifications', value: 'true', type: 'boolean' },
          { key: 'order_notifications', value: 'true', type: 'boolean' }
        ]
      }
    });
  } catch (error) {
    logger.error('Error fetching settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
