const analytics = require('../utils/analytics');
const { CacheService } = require('../utils/cache');
const { success } = require('../utils/responseHandler');

// Get API analytics (Admin only)
exports.getAnalytics = async (req, res, next) => {
  try {
    const stats = analytics.getStats();
    const cacheStats = CacheService.stats();
    
    const analyticsData = {
      api: stats,
      cache: cacheStats,
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      }
    };
    
    success(res, analyticsData, 'Analytics retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Reset analytics (Admin only)
exports.resetAnalytics = async (req, res, next) => {
  try {
    analytics.reset();
    success(res, null, 'Analytics reset successfully');
  } catch (err) {
    next(err);
  }
};