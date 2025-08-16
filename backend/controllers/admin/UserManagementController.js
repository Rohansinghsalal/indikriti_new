/**
 * User Management Controller
 * Handles CRUD operations for user management by admins
 */

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { Admin, User, Employee, Role, Permission } = require('../../models');
const { Op } = require('sequelize');

/**
 * Get all users with pagination and filtering
 * @route GET /api/v1/admin/users
 * @access Admin, Super Admin
 */
const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      status = '',
      userType = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // Add status filter
    if (status) {
      whereClause.status = status;
    }

    let users = [];
    let totalCount = 0;

    // Get users based on type filter
    if (!userType || userType === 'admin') {
      const adminUsers = await Admin.findAndCountAll({
        where: whereClause,
        include: [{
          model: Role,
          as: 'role',
          required: false
        }],
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      users = users.concat(adminUsers.rows.map(user => ({
        ...user.toJSON(),
        userType: 'admin'
      })));
      totalCount += adminUsers.count;
    }

    if (!userType || userType === 'employee') {
      const employeeUsers = await Employee.findAndCountAll({
        where: whereClause,
        include: [{
          model: Role,
          as: 'role',
          required: false
        }],
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      users = users.concat(employeeUsers.rows.map(user => ({
        ...user.toJSON(),
        userType: 'employee'
      })));
      totalCount += employeeUsers.count;
    }

    if (!userType || userType === 'user') {
      const regularUsers = await User.findAndCountAll({
        where: whereClause,
        include: [{
          model: Role,
          as: 'role',
          required: false
        }],
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      users = users.concat(regularUsers.rows.map(user => ({
        ...user.toJSON(),
        userType: 'user'
      })));
      totalCount += regularUsers.count;
    }

    // Sort combined results
    users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

/**
 * Get user by ID
 * @route GET /api/v1/admin/users/:id
 * @access Admin, Super Admin
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType } = req.query;

    let user = null;

    // Try to find user in different tables
    if (userType === 'admin') {
      user = await Admin.findByPk(id, {
        include: [{
          model: Role,
          as: 'role',
          include: [{
            model: Permission,
            as: 'permissions'
          }]
        }],
        attributes: { exclude: ['password'] }
      });
    } else if (userType === 'employee') {
      user = await Employee.findByPk(id, {
        include: [{
          model: Role,
          as: 'role',
          include: [{
            model: Permission,
            as: 'permissions'
          }]
        }],
        attributes: { exclude: ['password'] }
      });
    } else {
      user = await User.findByPk(id, {
        include: [{
          model: Role,
          as: 'role',
          include: [{
            model: Permission,
            as: 'permissions'
          }]
        }],
        attributes: { exclude: ['password'] }
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...user.toJSON(),
        userType: userType || 'user'
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

/**
 * Create new user
 * @route POST /api/v1/admin/users
 * @access Admin, Super Admin
 */
const createUser = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      department,
      userType = 'user',
      accessLevel = 'limited',
      roleId,
      companyId,
      status = 'active'
    } = req.body;

    // Check if email already exists
    const existingUser = await Admin.findOne({ where: { email } }) ||
                        await Employee.findOne({ where: { email } }) ||
                        await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = null;

    // Create user based on type
    if (userType === 'admin') {
      newUser = await Admin.create({
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        phone,
        department,
        access_level: accessLevel,
        is_super_admin: accessLevel === 'super',
        role_id: roleId,
        company_id: companyId,
        status
      });
    } else if (userType === 'employee') {
      newUser = await Employee.create({
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        phone,
        department,
        role_id: roleId,
        company_id: companyId,
        status
      });
    } else {
      newUser = await User.create({
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        phone,
        role_id: roleId,
        company_id: companyId,
        status
      });
    }

    // Fetch created user with role information
    const createdUser = await (userType === 'admin' ? Admin : 
                              userType === 'employee' ? Employee : User)
      .findByPk(newUser.id, {
        include: [{
          model: Role,
          as: 'role'
        }],
        attributes: { exclude: ['password'] }
      });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        ...createdUser.toJSON(),
        userType
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

/**
 * Update user
 * @route PUT /api/v1/admin/users/:id
 * @access Admin, Super Admin
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType } = req.query;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;

    // Hash password if provided
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Map frontend field names to database field names
    if (updateData.firstName) {
      updateData.first_name = updateData.firstName;
      delete updateData.firstName;
    }
    if (updateData.lastName) {
      updateData.last_name = updateData.lastName;
      delete updateData.lastName;
    }
    if (updateData.accessLevel) {
      updateData.access_level = updateData.accessLevel;
      updateData.is_super_admin = updateData.accessLevel === 'super';
      delete updateData.accessLevel;
    }
    if (updateData.roleId) {
      updateData.role_id = updateData.roleId;
      delete updateData.roleId;
    }
    if (updateData.companyId) {
      updateData.company_id = updateData.companyId;
      delete updateData.companyId;
    }

    let user = null;
    let Model = null;

    // Determine which model to use
    if (userType === 'admin') {
      Model = Admin;
    } else if (userType === 'employee') {
      Model = Employee;
    } else {
      Model = User;
    }

    // Update user
    const [updatedRowsCount] = await Model.update(updateData, {
      where: { id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fetch updated user
    user = await Model.findByPk(id, {
      include: [{
        model: Role,
        as: 'role'
      }],
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        ...user.toJSON(),
        userType: userType || 'user'
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

/**
 * Delete user
 * @route DELETE /api/v1/admin/users/:id
 * @access Super Admin only
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType } = req.query;

    let Model = null;

    // Determine which model to use
    if (userType === 'admin') {
      Model = Admin;
    } else if (userType === 'employee') {
      Model = Employee;
    } else {
      Model = User;
    }

    const deletedRowsCount = await Model.destroy({
      where: { id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

/**
 * Get all roles for user assignment
 * @route GET /api/v1/admin/roles
 * @access Admin, Super Admin
 */
const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: Permission,
        as: 'permissions'
      }],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: error.message
    });
  }
};

/**
 * Get user statistics
 * @route GET /api/v1/admin/users/stats
 * @access Admin, Super Admin
 */
const getUserStats = async (req, res) => {
  try {
    const [adminCount, employeeCount, userCount] = await Promise.all([
      Admin.count({ where: { status: 'active' } }),
      Employee.count({ where: { status: 'active' } }),
      User.count({ where: { status: 'active' } })
    ]);

    const totalActive = adminCount + employeeCount + userCount;

    const [inactiveAdmins, inactiveEmployees, inactiveUsers] = await Promise.all([
      Admin.count({ where: { status: 'inactive' } }),
      Employee.count({ where: { status: 'inactive' } }),
      User.count({ where: { status: 'inactive' } })
    ]);

    const totalInactive = inactiveAdmins + inactiveEmployees + inactiveUsers;

    res.json({
      success: true,
      data: {
        total: totalActive + totalInactive,
        active: totalActive,
        inactive: totalInactive,
        byType: {
          admins: { active: adminCount, inactive: inactiveAdmins },
          employees: { active: employeeCount, inactive: inactiveEmployees },
          users: { active: userCount, inactive: inactiveUsers }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getRoles,
  getUserStats
};
