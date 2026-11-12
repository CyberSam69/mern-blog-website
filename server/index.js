const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB, getStatus } = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const tagRoutes = require('./routes/tags');
const authorRoutes = require('./routes/authors');
const postRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connectivity check middleware for data endpoints
const requireDatabase = (req, res, next) => {
  const { connected } = getStatus();
  if (!connected) {
    return res.status(503).json({
      success: false,
      databaseOffline: true,
      message: 'MongoDB is currently offline. Please ensure MongoDB is started locally (e.g. `net start MongoDB`) or provide your connection string (e.g. MongoDB Atlas) in server/.env.',
    });
  }
  next();
};

// API Routes
app.use('/api/auth', requireDatabase, authRoutes);
app.use('/api/categories', requireDatabase, categoryRoutes);
app.use('/api/tags', requireDatabase, tagRoutes);
app.use('/api/authors', requireDatabase, authorRoutes);
app.use('/api/posts', requireDatabase, postRoutes);
app.use('/api/upload', requireDatabase, uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getStatus();
  res.status(200).json({
    status: 'ok',
    message: 'FlyerTech Blog REST API is operational',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack || err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] FlyerTech Blog API running on http://localhost:${PORT}`);
  });
});

module.exports = app;
