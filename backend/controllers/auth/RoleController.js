const { Role, Permission } = require('../../models');
const { validationResult } = require('express-validator');

// @desc    Get all roles
// @route   GET /api/v1/auth/roles
// @access  Private (Super Admin)
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }],
      order: [['id', 'ASC']]
    });

    return res.json({
      success: true,
      count: roles.length,
      roles
    });
  } catch (err) {
    console.error('Get all roles error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching roles'
    });
  }
};

// @desc    Get role by id
// @route   GET /api/v1/auth/roles/:id
// @access  Private (Super Admin)
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    return res.json({
      success: true,
      role
    });
  } catch (err) {
    console.error('Get role by id error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching role'
    });
  }
};

// @desc    Create a new role
// @route   POST /api/v1/auth/roles
// @access  Private (Super Admin)
const createRole = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, permissions } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }

    // Create role
    const role = await Role.create({
      name,
      description
    });

    // Assign permissions if provided
    if (permissions && permissions.length > 0) {
      await role.setPermissions(permissions);
    }

    // Return role with permissions
    const newRole = await Role.findByPk(role.id, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    return res.status(201).json({
      success: true,
      message: 'Role created successfully',
      role: newRole
    });
  } catch (err) {
    console.error('Create role error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error creating role'
    });
  }
};

// @desc    Update a role
// @route   PUT /api/v1/auth/roles/:id
// @access  Private (Super Admin)
const updateRole = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, permissions } = req.body;
    
    // Find role by id
    const role = await Role.findByPk(req.params.id);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Check if it's a system role
    if (role.isSystem) {
      return res.status(403).json({
        success: false,
        message: 'System roles cannot be modified'
      });
    }
    
    // Check if name already exists (if name is changed)
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: 'Role with this name already exists'
        });
      }
    }
    
    // Update role
    await role.update({
      name: name || role.name,
      description: description || role.description
    });
    
    // Update permissions if provided
    if (permissions) {
      await role.setPermissions(permissions);
    }
    
    // Return updated role with permissions
    const updatedRole = await Role.findByPk(role.id, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });
    
    return res.json({
      success: true,
      message: 'Role updated successfully',
      role: updatedRole
    });
  } catch (err) {
    console.error('Update role error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error updating role'
    });
  }
};

// @desc    Delete a role
// @route   DELETE /api/v1/auth/roles/:id
// @access  Private (Super Admin)
const deleteRole = async (req, res) => {
  try {
    // Find role by id
    const role = await Role.findByPk(req.params.id);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Check if it's a system role
    if (role.isSystem) {
      return res.status(403).json({
        success: false,
        message: 'System roles cannot be deleted'
      });
    }
    
    // Check if role is assigned to any users
    const usersWithRole = await role.countUsers();
    if (usersWithRole > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. It is assigned to ${usersWithRole} user(s)`
      });
    }
    
    // Delete role
    await role.destroy();
    
    return res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (err) {
    console.error('Delete role error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting role'
    });
  }
};

// @desc    Assign permissions to a role
// @route   POST /api/v1/auth/roles/:roleId/permissions
// @access  Private (Super Admin)
const assignPermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissions } = req.body;
    
    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Permissions array is required'
      });
    }
    
    // Find role by id
    const role = await Role.findByPk(roleId);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Assign permissions
    await role.addPermissions(permissions);
    
    // Get updated role with permissions
    const updatedRole = await Role.findByPk(roleId, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });
    
    return res.json({
      success: true,
      message: 'Permissions assigned successfully',
      role: updatedRole
    });
  } catch (err) {
    console.error('Assign permissions error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error assigning permissions'
    });
  }
};

// @desc    Remove a permission from a role
// @route   DELETE /api/v1/auth/roles/:roleId/permissions/:permissionId
// @access  Private (Super Admin)
const removePermission = async (req, res) => {
  try {
    const { roleId, permissionId } = req.params;
    
    // Find role by id
    const role = await Role.findByPk(roleId);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Find permission by id
    const permission = await Permission.findByPk(permissionId);
    
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      });
    }
    
    // Remove permission from role
    await role.removePermission(permission);
    
    // Get updated role with permissions
    const updatedRole = await Role.findByPk(roleId, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });
    
    return res.json({
      success: true,
      message: 'Permission removed successfully',
      role: updatedRole
    });
  } catch (err) {
    console.error('Remove permission error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error removing permission'
    });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermissions,
  removePermission
}; 