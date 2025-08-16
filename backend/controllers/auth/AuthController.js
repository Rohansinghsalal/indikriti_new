const jwt = require('jsonwebtoken');
const { Role, Admin } = require('../../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const logger = require('../../utils/logger');

// @desc    Login admin and get token
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    
    // Find admin by email (simplified without associations for now)
    const admin = await Admin.findOne({
      where: { email }
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (admin.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active. Please contact the super administrator'
      });
    }

    // Check if password matches
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Note: last_login_at column doesn't exist in current schema
    // await admin.update({ last_login_at: new Date() });
    
    // Prepare token payload
    const tokenPayload = {
      id: admin.id,
      email: admin.email,
      role: admin.access_level, // Use access_level as role for now
      userType: 'admin',
      isAdmin: true
    };

    // Prepare user data for response
    const userData = {
      id: admin.id,
      email: admin.email,
      firstName: admin.first_name,
      lastName: admin.last_name,
      role: admin.access_level, // Use access_level as role for now
      permissions: [], // Empty permissions for now
      avatar: admin.avatar,
      companyId: admin.company_id,
      accessLevel: admin.access_level,
      isSuperAdmin: admin.is_super_admin
    };

    // Generate JWT token
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: admin.id, email: admin.email, userType: 'admin' },
      process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );

    // Log the successful login
    logger.info(`Admin logged in: ${admin.email}`);

    // Return admin and token
    return res.json({
      success: true,
      token,
      refreshToken,
      user: userData,
      userType: 'admin'
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Verify user token
// @route   GET /api/v1/auth/verify
// @access  Private
const verifyToken = async (req, res) => {
  try {
    // The auth middleware already verified the token
    // If we got here, the token is valid
    return res.json({
      success: true,
      message: 'Token is valid'
    });
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during token verification'
    });
  }
};

// @desc    Refresh user token
// @route   POST /api/v1/auth/refresh-token
// @access  Private
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key'
    );

    // Get admin by id (simplified without Role associations since Admin model doesn't have them)
    const admin = await Admin.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if admin is still active
    if (admin.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Generate new access token with same payload structure as login
    const newToken = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.access_level, // Use access_level as role
        userType: 'admin',
        isAdmin: true
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Return new token
    return res.json({
      success: true,
      token: newToken
    });
  } catch (err) {
    console.error('Token refresh error:', err);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
};

// @desc    Get current admin profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // Admin is already attached to req by auth middleware
    const { id } = req.user;

    // Use direct MySQL connection to completely bypass Sequelize associations
    const mysql = require('mysql2/promise');
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'indikriti',
      password: process.env.DB_PASSWORD || 'indikriti123',
      database: process.env.DB_NAME || 'admin'
    };

    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute(
        'SELECT id, first_name, last_name, email, role_id, company_id, department, status, access_level, is_super_admin, phone, created_at, updated_at FROM admins WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      const admin = rows[0];

      // Prepare admin data for response
      const userData = {
        id: admin.id,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        phone: admin.phone,
        department: admin.department,
        status: admin.status,
        role: admin.access_level || 'admin', // Use access_level as role
        permissions: [], // Empty permissions for now
        companyId: admin.company_id,
        accessLevel: admin.access_level,
        isSuperAdmin: Boolean(admin.is_super_admin),
        createdAt: admin.created_at,
        updatedAt: admin.updated_at
      };

      // Return admin data
      return res.json({
        success: true,
        data: {
          user: userData,
          userType: 'admin'
        }
      });

    } finally {
      await connection.end();
    }

  } catch (err) {
    console.error('Get admin profile error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving admin profile'
    });
  }
};

// @desc    Logout admin (clear token)
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = (req, res) => {
  // JWT is stateless, so we don't need to do anything server-side
  // The client will clear the token from local storage
  return res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Change admin password
// @route   PUT /api/v1/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;

    // Get admin
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if current password matches
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    return res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during password change'
    });
  }
};

// @desc    Send password reset email to super admin
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      // For security reasons, don't reveal that the email doesn't exist
      return res.json({
        success: true,
        message: 'If your email is registered, a password reset request has been sent to the super admin.'
      });
    }

    // Find super admin
    const superAdmin = await Admin.findOne({ where: { is_super_admin: true } });

    if (!superAdmin) {
      return res.status(500).json({
        success: false,
        message: 'Super admin not found. Please contact system administrator.'
      });
    }

    // In a real application, you would send an email to the super admin here
    // For now, just log the request
    logger.info(`Password reset requested for ${email}. Super admin should be notified at ${superAdmin.email}.`);

    return res.json({
      success: true,
      message: 'Password reset request has been sent to the super admin.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
};

module.exports = {
  login,
  verifyToken,
  refreshToken,
  getMe,
  logout,
  changePassword,
  forgotPassword
}; 