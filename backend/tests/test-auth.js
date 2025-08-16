/**
 * Simple test server for authentication
 */
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Secret
const JWT_SECRET = 'test-secret-key';

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Auth Test Server is running',
    version: '1.0.0'
  });
});

// Mock users for testing
const users = [
  {
    id: 1,
    email: 'superadmin@example.com',
    password: 'SuperAdmin@123',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'superadmin',
    permissions: ['*'],
    userType: 'admin',
    isSuperAdmin: true
  },
  {
    id: 2,
    email: 'admin@company1.com',
    password: 'Admin@123',
    firstName: 'Company',
    lastName: 'Admin',
    role: 'admin',
    permissions: ['manage_users', 'manage_products', 'manage_orders'],
    userType: 'admin',
    isSuperAdmin: false,
    companyId: 1
  },
  {
    id: 3,
    email: 'manager@company1.com',
    password: 'Manager@123',
    firstName: 'Sales',
    lastName: 'Manager',
    role: 'manager',
    permissions: ['view_users', 'manage_products', 'manage_orders'],
    userType: 'employee',
    companyId: 1,
    department: 'Sales'
  },
  {
    id: 4,
    email: 'john.doe@company1.com',
    password: 'Sales@123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'staff',
    permissions: ['view_products', 'view_orders'],
    userType: 'employee',
    companyId: 1,
    department: 'Sales',
    position: 'Sales Representative'
  }
];

// Login route
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password, userType = 'user' } = req.body;
  
  // Find user by credentials
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password &&
    u.userType === userType
  );
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Create token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      role: user.role,
      userType: user.userType,
      isSuperAdmin: user.isSuperAdmin || false,
      companyId: user.companyId
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Create user object for response (remove password)
  const userResponse = { ...user };
  delete userResponse.password;
  
  return res.json({
    success: true,
    token,
    user: userResponse,
    userType: user.userType
  });
});

// Verify token
app.get('/api/v1/auth/verify', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    message: 'Token is valid'
  });
});

// Get current user
app.get('/api/v1/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Create user object for response (remove password)
  const userResponse = { ...user };
  delete userResponse.password;
  
  return res.json({
    success: true,
    data: {
      user: userResponse,
      userType: user.userType
    }
  });
});

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required'
    });
  }
  
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

// Set port
const PORT = 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Auth Test Server running on port ${PORT}`);
});

module.exports = app;