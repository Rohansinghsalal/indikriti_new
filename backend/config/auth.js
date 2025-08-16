/**
 * Authentication configuration
 */

require('dotenv').config();

module.exports = {
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'ecommerce-admin-panel',
    audience: 'admin-users'
  },
  
  // Password configuration
  password: {
    saltRounds: 10,
    minLength: 6,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false
  },
  
  // Session configuration (for future use)
  session: {
    name: 'admin-session',
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  },
  
  // Two-factor authentication (for future implementation)
  twoFactor: {
    enabled: false,
    issuer: 'E-Commerce Admin Panel'
  },
  
  // Rate limiting for login attempts
  rateLimiting: {
    enabled: true,
    maxAttempts: 5, // Maximum login attempts
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 3, // Delay responses after 3 attempts
    delayMs: 500 // Delay by 500ms
  },
  
  // Token blacklisting (for logout, password change)
  tokenBlacklist: {
    enabled: false, // Set to true when implementing Redis
    expiryCheckInterval: 60 * 60 * 1000 // 1 hour
  }
}; 