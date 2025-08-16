/**
 * Test Server - Minimal version with just auth routes
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock users for authentication
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: '$2a$10$XVE/z8gL5JJ5W4eIKKsOZOqxDFKA9vFoQ2qQbDfgHemGQb9.jG4FG', // 'password'
    name: 'Admin User',
    role: 'Super Admin',
    permissions: ['*']
  },
  {
    id: 2,
    email: 'company@example.com',
    password: '$2a$10$XVE/z8gL5JJ5W4eIKKsOZOqxDFKA9vFoQ2qQbDfgHemGQb9.jG4FG', // 'password'
    name: 'Company Admin',
    role: 'Company Admin',
    company_id: 1,
    permissions: ['users:*', 'products:*', 'orders:*']
  },
  {
    id: 3,
    email: 'manager@example.com',
    password: '$2a$10$XVE/z8gL5JJ5W4eIKKsOZOqxDFKA9vFoQ2qQbDfgHemGQb9.jG4FG', // 'password'
    name: 'Manager',
    role: 'Manager',
    company_id: 1,
    permissions: ['users:view', 'products:*', 'orders:*']
  },
  {
    id: 4,
    email: 'staff@example.com',
    password: '$2a$10$XVE/z8gL5JJ5W4eIKKsOZOqxDFKA9vFoQ2qQbDfgHemGQb9.jG4FG', // 'password'
    name: 'Staff',
    role: 'Staff',
    company_id: 1,
    permissions: ['products:view', 'orders:view']
  }
];

// Helper function to find user by email
const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token is required'
    });
  }
  
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }
    
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        permissions: user.permissions,
        company_id: user.company_id
      }, 
      'your_jwt_secret', 
      { expiresIn: '1h' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          company_id: user.company_id
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
      error: error.message
    });
  }
});

app.get('/api/v1/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company_id: user.company_id,
      permissions: user.permissions
    }
  });
});

app.post('/api/v1/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test API is working'
  });
});

// Protected test route
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Protected API is working',
    user: req.user
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
});

/**
 * Example login:
 * 
 * curl -X POST http://localhost:5000/api/v1/auth/login \
 *   -H "Content-Type: application/json" \
 *   -d '{"email": "admin@example.com", "password": "password"}'
 */ 