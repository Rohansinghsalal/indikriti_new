/**
 * Main application configuration
 */

require('dotenv').config();

module.exports = {
  // Application settings
  app: {
    name: 'E-Commerce Admin Panel',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    apiPrefix: '/api/v1',
    url: process.env.APP_URL || 'http://localhost:3000',
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000']
  },
  
  // File uploads
  uploads: {
    directory: 'storage/uploads',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      'image/jpeg', 
      'image/png', 
      'image/webp', 
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
      'application/vnd.ms-excel' // xls
    ]
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    directory: 'storage/logs',
    maxSize: '10m',
    maxFiles: 5,
    format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
  },
  
  // Rate limiting (overall API)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
  },
  
  // Email settings
  email: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    from: process.env.EMAIL_FROM || 'admin@example.com',
    transport: {
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: parseInt(process.env.EMAIL_PORT || '2525'),
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || ''
      }
    }
  },
  
  // Feature flags
  features: {
    userRegistration: true,
    forgotPassword: true,
    twoFactorAuth: false,
    darkMode: true,
    multiLanguage: false,
    analytics: true,
    exportReports: true
  },
  
  // System defaults
  defaults: {
    locale: 'en',
    timezone: 'UTC',
    currency: 'USD',
    itemsPerPage: 10,
    superAdminEmail: process.env.SUPER_ADMIN_EMAIL || 'admin@example.com',
    systemCompanyId: 1
  }
}; 