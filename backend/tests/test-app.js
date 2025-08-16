/**
 * Simple test script to start the backend
 */
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import basic routes
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend is running',
    version: '1.0.0'
  });
});

// Simple user routes
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock login
  if (email === 'admin@example.com' && password === 'password123') {
    return res.json({
      success: true,
      token: 'mock-token-123456',
      user: {
        id: 1,
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    });
  }
  
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
});

// Set port
const PORT = 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 