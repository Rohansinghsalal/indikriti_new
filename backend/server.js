/**
 * E-commerce Admin Panel API Server
 */

// Load environment variables immediately
require('dotenv').config();




// Global error handlers to catch unexpected errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Log key configuration for verification
console.log('DB User:', process.env.DB_USER);
console.log('DB Dialect:', process.env.DB_DIALECT);

const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');

// Database connection and models
const { sequelize, testConnection } = require('./database/connection');
const db = require('./models');


// Logger and API routes
const logger = require('./utils/logger');
const apiRoutes = require('./routes/api/v1');
const ensureDefaultAdmin = require('./utils/ensureDefaultAdmin');

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.io with enhanced CORS and configuration
const io = socketIo(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5173'
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  allowEIO3: true
});

// Make io available globally for controllers
global.io = io;

// Socket.io connection handling with enhanced error handling
io.on('connection', (socket) => {
  console.log(`✅ Socket.IO: Client connected - ID: ${socket.id}, Transport: ${socket.conn.transport.name}`);

  // Handle transport upgrade
  socket.conn.on('upgrade', () => {
    console.log(`🔄 Socket.IO: Client ${socket.id} upgraded to ${socket.conn.transport.name}`);
  });

  // Handle room joining with validation
  socket.on('join', (room) => {
    if (typeof room === 'string' && room.trim()) {
      socket.join(room);
      console.log(`🏠 Socket.IO: Client ${socket.id} joined room: ${room}`);
      socket.emit('joined-room', { room, success: true });
    } else {
      console.error(`❌ Socket.IO: Invalid room name from client ${socket.id}:`, room);
      socket.emit('error', { message: 'Invalid room name' });
    }
  });

  // Handle room leaving with validation
  socket.on('leave', (room) => {
    if (typeof room === 'string' && room.trim()) {
      socket.leave(room);
      console.log(`🚪 Socket.IO: Client ${socket.id} left room: ${room}`);
      socket.emit('left-room', { room, success: true });
    } else {
      console.error(`❌ Socket.IO: Invalid room name from client ${socket.id}:`, room);
    }
  });

  // Handle disconnect with reason
  socket.on('disconnect', (reason) => {
    console.log(`❌ Socket.IO: Client disconnected - ID: ${socket.id}, Reason: ${reason}`);
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error(`🚨 Socket.IO: Connection error for client ${socket.id}:`, error);
  });

  // Handle inventory updates with validation
  socket.on('inventory-update', (data) => {
    try {
      if (data && typeof data === 'object') {
        console.log('📦 Socket.IO: Inventory update received:', data);
        socket.to('inventory').emit('inventory-updated', data);
        io.to('inventory').emit('inventory-updated', data); // Broadcast to all in room
      } else {
        console.error(`❌ Socket.IO: Invalid inventory update data from ${socket.id}:`, data);
      }
    } catch (error) {
      console.error(`🚨 Socket.IO: Error processing inventory update from ${socket.id}:`, error);
    }
  });

  // Handle POS events with validation
  socket.on('pos-event', (data) => {
    try {
      if (data && typeof data === 'object') {
        console.log('💰 Socket.IO: POS event received:', data);
        socket.to('pos').emit('pos-updated', data);
        io.to('pos').emit('pos-updated', data); // Broadcast to all in room
      } else {
        console.error(`❌ Socket.IO: Invalid POS event data from ${socket.id}:`, data);
      }
    } catch (error) {
      console.error(`🚨 Socket.IO: Error processing POS event from ${socket.id}:`, error);
    }
  });

  // Handle ping/pong for connection health
  socket.on('ping', () => {
    socket.emit('pong');
  });
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'], // Allow frontend on all ports
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security and performance middleware
app.use(helmet());
app.use(compression());
// Body parser middleware with increased limits for file uploads and large product data
app.use(express.json({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true
}));
app.use(express.urlencoded({
  extended: true,
  limit: '50mb',
  parameterLimit: 100000
}));

// Handle payload too large errors
app.use((error, req, res, next) => {
  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Request payload too large',
      message: 'The request data exceeds the maximum allowed size of 50MB. Please reduce the size of your data or images.',
      maxSize: '50MB'
    });
  }
  next(error);
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'storage/uploads')));

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  const logsDir = path.join(__dirname, 'storage', 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
}

// Mount API routes
app.use('/api/v1', apiRoutes);

// Default root route for health check
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to E-commerce Admin Panel API',
    version: '1.0.0'
  });
});

// Start server after verifying DB connection
async function startServer() {
  try {
    const connected = await testConnection();
    if (!connected) {
      console.error('Database connection failed. Exiting.');
      process.exit(1);
    }
    console.log('Database connection successful');
    console.log('Synchronizing database models...');
    await db.sequelize.sync({ force: false, alter: false });
    console.log('Database synchronized successfully');

    // Ensure default admin exists
    console.log('Ensuring default admin account exists...');
    await ensureDefaultAdmin();
    console.log('Default admin check completed');

    const PORT = parseInt(process.env.PORT, 10) || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    // Handle port in use error explicitly
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Exiting.`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });

    // Graceful shutdown
    const shutdown = () => {
      console.info('Shutting down server...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

module.exports = app;
