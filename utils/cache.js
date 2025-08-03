const cache = new Map();

// Professional caching service
class CacheService {
  static set(key, value, ttl = 300) {
    const expiry = Date.now() + (ttl * 1000);
    cache.set(key, { value, expiry });
    return true;
  }

  static get(key) {
    const item = cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      cache.delete(key);
      return null;
    }
    return item.value;
  }

  static del(key) {
    return cache.delete(key);
  }

  static clear() {
    cache.clear();
  }

  static keys() {
    return Array.from(cache.keys());
  }

  static stats() {
    return {
      size: cache.size,
      keys: this.keys()
    };
  }
}

// Cache middleware for GET requests
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    if (req.method !== 'GET') return next();
    
    const key = `api:${req.originalUrl}`;
    const cached = CacheService.get(key);
    
    if (cached) {
      return res.json(cached);
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      CacheService.set(key, body, duration);
      res.sendResponse(body);
    };
    
    next();
  };
};

module.exports = {
  CacheService,
  cacheMiddleware
};
