/**
 * Server Entry Point
 * Arab Research Publishing Platform
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');
const { rateLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const submissionsRoutes = require('./routes/submissions');
const adminRoutes = require('./routes/admin');
const notificationsRoutes = require('./routes/notifications');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Serve static files (قبل Rate Limiting)
app.use(express.static(path.join(__dirname, '../public')));

// Rate limiting (فقط على API routes)
app.use('/api', rateLimiter);

// ============================================
// API ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API documentation
app.get('/api', (req, res) => {
  res.json({
    name: 'Arab Research Publishing Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      submissions: '/api/submissions',
      admin: '/api/admin',
      notifications: '/api/notifications',
    },
    documentation: '/api/docs',
  });
});

// ============================================
// FRONTEND ROUTES (SPA)
// ============================================

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  } else {
    res.status(404).json({ error: 'Endpoint not found' });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
  });
});

// Global error handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Arab Research Publishing Platform                ║
║                                                       ║
║   Server running on: http://localhost:${PORT}         ║
║   Environment: ${process.env.NODE_ENV || 'development'}                  ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;

