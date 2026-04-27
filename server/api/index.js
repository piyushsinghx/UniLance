const express = require('express');
const cors = require('cors');
const path = require('path');

// In Vercel serverless, env vars are injected automatically.
// Only load dotenv locally (it will silently fail if .env doesn't exist).
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch (e) {
  // dotenv not critical in production
}

const connectDB = require('../config/db');
const { errorHandler, notFound } = require('../middleware/errorMiddleware');
const { apiLimiter, authLimiter } = require('../middleware/rateLimiter');

// Route imports
const authRoutes = require('../routes/authRoutes');
const gigRoutes = require('../routes/gigRoutes');
const userRoutes = require('../routes/userRoutes');
const orderRoutes = require('../routes/orderRoutes');
const messageRoutes = require('../routes/messageRoutes');
const notificationRoutes = require('../routes/notificationRoutes');
const reviewRoutes = require('../routes/reviewRoutes');
const analyticsRoutes = require('../routes/analyticsRoutes');
const aiRoutes = require('../routes/aiRoutes');
const paymentRoutes = require('../routes/paymentRoutes');
const uploadRoutes = require('../routes/uploadRoutes');
const adminRoutes = require('../routes/adminRoutes');

const app = express();

// Connect to DB (cached across warm invocations in serverless)
let dbConnected = false;
if (!dbConnected) {
  connectDB().then(() => { dbConnected = true; }).catch(() => {});
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
