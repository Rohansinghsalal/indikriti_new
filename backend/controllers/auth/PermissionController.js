const { Permission } = require('../../models');
const { validationResult } = require('express-validator');

// @desc    Get all permissions
// @route   GET /api/v1/auth/permissions
// @access  Private (Super Admin)
const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      order: [
        ['module', 'ASC'],
        ['action', 'ASC']
      ]
    });

    return res.json({
      success: true,
      count: permissions.length,
      permissions
    });
  } catch (err) {
    console.error('Get all permissions error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching permissions'
    });
  }
};

// @desc    Get permission by id
// @route   GET /api/v1/auth/permissions/:id
// @access  Private (Super Admin)
const getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      });
    }

    return res.json({
      success: true,
      permission
    });
  } catch (err) {
    console.error('Get permission by id error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching permission'
    });
  }
};

// @desc    Get all permissions by module
// @route   GET /api/v1/auth/permissions/module/:moduleName
// @access  Private (Super Admin)
const getPermissionsByModule = async (req, res) => {
  try {
    const { moduleName } = req.params;
    
    const permissions = await Permission.findAll({
      where: { module: moduleName },
      order: [['action', 'ASC']]
    });

    return res.json({
      success: true,
      count: permissions.length,
      module: moduleName,
      permissions
    });
  } catch (err) {
    console.error('Get permissions by module error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching permissions by module'
    });
  }
};

// @desc    Create a new permission
// @route   POST /api/v1/auth/permissions
// @access  Private (Super Admin)
const createPermission = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, module, action } = req.body;

    // Check if permission already exists
    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      return res.status(400).json({
        success: false,
        message: 'Permission with this name already exists'
      });
    }

    // Create permission
    const permission = await Permission.create({
      name,
      description,
      module,
      action
    });

    return res.status(201).json({
      success: true,
      message: 'Permission created successfully',
      permission
    });
  } catch (err) {
    console.error('Create permission error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error creating permission'
    });
  }
};

// @desc    Update a permission
// @route   PUT /api/v1/auth/permissions/:id
// @access  Private (Super Admin)
const updatePermission = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, module, action } = req.body;
    
    // Find permission by id
    const permission = await Permission.findByPk(req.params.id);
    
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      });
    }
    
    // Check if name already exists (if name is changed)
    if (name && name !== permission.name) {
      const existingPermission = await Permission.findOne({ where: { name } });
      if (existingPermission) {
        return res.status(400).json({
          success: false,
          message: 'Permission with this name already exists'
        });
      }
    }
    
    // Update permission
    await permission.update({
      name: name || permission.name,
      description: description || permission.description,
      module: module || permission.module,
      action: action || permission.action
    });
    
    return res.json({
      success: true,
      message: 'Permission updated successfully',
      permission
    });
  } catch (err) {
    console.error('Update permission error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error updating permission'
    });
  }
};

// @desc    Delete a permission
// @route   DELETE /api/v1/auth/permissions/:id
// @access  Private (Super Admin)
const deletePermission = async (req, res) => {
  try {
    // Find permission by id
    const permission = await Permission.findByPk(req.params.id);
    
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      });
    }
    
    // Delete permission
    await permission.destroy();
    
    return res.json({
      success: true,
      message: 'Permission deleted successfully'
    });
  } catch (err) {
    console.error('Delete permission error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting permission'
    });
  }
};

module.exports = {
  getAllPermissions,
  getPermissionById,
  getPermissionsByModule,
  createPermission,
  updatePermission,
  deletePermission
}; 