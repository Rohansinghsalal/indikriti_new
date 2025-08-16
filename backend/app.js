/**
 * E-commerce Admin Panel API Server
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');

// Load environment variables
dotenv.config();

// Import database connection
const { sequelize, testConnection } = require('./database/connection');

// Import logger
const logger = require('./utils/logger');

// Import routes
const apiRoutes = require('./routes/api/v1');

// Initialize Express app
const app = express();

// Middlewares
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'storage/uploads')));

// API routes
app.use('/api/v1', apiRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to E-commerce Admin Panel API',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`${err.stack}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const connected = await testConnection();
    
    if (!connected) {
      logger.error('Database connection failed. Exiting application.');
      process.exit(1);
    }
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
if (require.main === module) {
  startServer();
}

// Export app for testing
module.exports = app; 