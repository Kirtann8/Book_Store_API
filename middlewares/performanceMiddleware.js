const logger = require('../config/logger');

// Request timing middleware
const requestTimer = (req, res, next) => {
  req.startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Memory usage monitoring
const memoryMonitor = (req, res, next) => {
  const memUsage = process.memoryUsage();
  req.memoryUsage = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024)
  };
  next();
};

module.exports = {
  requestTimer,
  memoryMonitor
};