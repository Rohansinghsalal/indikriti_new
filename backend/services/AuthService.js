/**
 * Authentication Service
 * Handles user authentication, token generation, and validation
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Role, Permission } = require('../models');
const authConfig = require('../config/auth');

class AuthService {
  /**
   * Authenticate user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<object>} - User data and token
   */
  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({
        where: { email },
        include: [{
          model: Role,
          as: 'role',
          include: [{
            model: Permission,
            as: 'permissions'
          }]
        }]
      });

      // Check if user exists
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check user status
      if (user.status !== 'active') {
        throw new Error(`Your account is ${user.status}`);
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid email or password');
      }

      // Generate token
      const token = this.generateToken(user);

      // Update last login time
      user.last_login_at = new Date();
      await user.save();

      // Prepare user data (remove password)
      const userData = user.toJSON();
      delete userData.password;

      return {
        user: userData,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {object} userData - User data
   * @returns {Promise<object>} - Created user
   */
  async register(userData) {
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, authConfig.password.saltRounds);

      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword,
        status: 'active'
      });

      // Prepare user data (remove password)
      const createdUser = user.toJSON();
      delete createdUser.password;

      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify token and get user
   * @param {string} token - JWT token
   * @returns {Promise<object>} - User data
   */
  async verifyToken(token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, authConfig.jwt.secret);

      // Find user
      const user = await User.findByPk(decoded.id, {
        include: [{
          model: Role,
          as: 'role',
          include: [{
            model: Permission,
            as: 'permissions'
          }]
        }]
      });

      // Check if user exists
      if (!user) {
        throw new Error('User not found');
      }

      // Check user status
      if (user.status !== 'active') {
        throw new Error(`Your account is ${user.status}`);
      }

      // Prepare user data (remove password)
      const userData = user.toJSON();
      delete userData.password;

      return userData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate JWT token
   * @param {object} user - User object
   * @returns {string} - JWT token
   */
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      company_id: user.company_id
    };

    return jwt.sign(payload, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.expiresIn
    });
  }

  /**
   * Change user password
   * @param {number} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} - Success status
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Find user
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, authConfig.password.saltRounds);

      // Update password
      user.password = hashedPassword;
      await user.save();

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset user password
   * @param {string} email - User's email
   * @returns {Promise<boolean>} - Success status
   */
  async requestPasswordReset(email) {
    try {
      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        // For security reasons, don't reveal that email doesn't exist
        return true;
      }

      // TODO: Generate reset token and send email
      // This would be implemented with email service

      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService(); 