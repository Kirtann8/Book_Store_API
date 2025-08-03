
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const { errorHandler, AppError } = require('./middlewares/errorMiddleware');
const { mongoSanitize, xssClean } = require('./middlewares/sanitizeMiddleware');
const { requestTimer, memoryMonitor } = require('./middlewares/performanceMiddleware');
const analytics = require('./utils/analytics');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// Security headers
app.use(helmet());

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// JSON body parser
app.use(express.json());

// Performance monitoring
app.use(requestTimer);
app.use(memoryMonitor);

// Analytics tracking
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    analytics.trackRequest(req, res, responseTime);
    if (res.statusCode >= 400) {
      analytics.trackError();
    }
  });
  next();
});

// Data sanitization
app.use(mongoSanitize);
app.use(xssClean);

// Routes with API versioning
app.use('/api/v1/books', require('./routes/books'));
app.use('/api/v1/authors', require('./routes/authors'));
app.use('/api/v1/genres', require('./routes/genres'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/profile', require('./routes/userProfile'));
app.use('/api/v1/cart', require('./routes/cart'));
app.use('/api/v1/orders', require('./routes/orders'));
app.use('/api/v1/analytics', require('./routes/analytics'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('Welcome to Bookstore API');
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received. Closing server.');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.info('SIGINT signal received. Closing server.');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
