const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const authRoutes = require('./modules/auth/auth.routes');
const propertyRoutes = require('./modules/properties/properties.routes');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/', apiLimiter); // Apply to all API routes

// Routes
app.use('/api/auth', authLimiter, authRoutes); // Stricter for auth
app.use('/api/properties', propertyRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Tafutanga API' });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  // Silent start
});
