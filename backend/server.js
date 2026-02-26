import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import investmentRoutes from './routes/investmentRoutes.js';
import protocolRoutes from './routes/protocolRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/defi-optimizer';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ==================== MIDDLEWARE ====================

// CORS configuration
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== DATABASE CONNECTION ====================

// MongoDB connection is optional - skip if not needed for development
// Uncomment below to enable database:
/*
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✓ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  });
*/
console.log('⚠ Running in mock mode (no database)');

// ==================== ROUTES ====================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DeFi Optimizer Backend API',
    version: '1.0.0',
    endpoints: {
      protocols: '/api/protocols',
      investments: '/api/investments',
      health: '/api/health',
    },
  });
});

/**
 * API Routes
 */
app.use('/api/protocols', protocolRoutes);
app.use('/api/investments', investmentRoutes);

// ==================== ERROR HANDLING ====================

/**
 * 404 handler - must be after all routes
 */
app.use(notFoundHandler);

/**
 * Global error handler - must be last
 */
app.use(errorHandler);

// ==================== SERVER START ====================

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║   DeFi Optimizer Backend Server        ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Frontend URL: ${FRONTEND_URL}`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  GET  http://localhost:${PORT}/api/health`);
  console.log(`  GET  http://localhost:${PORT}/api/protocols`);
  console.log(`  GET  http://localhost:${PORT}/api/protocols/best?asset=USDC`);
  console.log(`  POST http://localhost:${PORT}/api/investments`);
  console.log('');
});

export default app;
