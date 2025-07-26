const NodeCache = require('node-cache');

// Create cache instances with different TTLs (Time To Live)
const shortTermCache = new NodeCache({ stdTTL: 300 }); // 5 minutes
const longTermCache = new NodeCache({ stdTTL: 3600 }); // 1 hour

// Cache keys
const CACHE_KEYS = {
  ALL_BOOKS: 'all_books',
  ALL_AUTHORS: 'all_authors',
  ALL_GENRES: 'all_genres',
  BOOK_BY_ID: (id) => `book_${id}`,
  AUTHOR_BY_ID: (id) => `author_${id}`,
  GENRE_BY_ID: (id) => `genre_${id}`
};

/**
 * Generic cache wrapper for async functions
 * @param {string} key - Cache key
 * @param {Function} fn - Async function to execute if cache miss
 * @param {Object} cache - Cache instance to use
 * @returns {Promise<any>} - Cached or fresh data
 */
const withCache = async (key, fn, cache = shortTermCache) => {
  const cachedData = cache.get(key);
  if (cachedData !== undefined) {
    return cachedData;
  }

  const freshData = await fn();
  cache.set(key, freshData);
  return freshData;
};

/**
 * Clear cache entries by pattern
 * @param {string} pattern - Pattern to match cache keys
 * @param {Object} cache - Cache instance to clear
 */
const clearCacheByPattern = (pattern, cache = shortTermCache) => {
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.includes(pattern));
  cache.del(matchingKeys);
};

module.exports = {
  shortTermCache,
  longTermCache,
  CACHE_KEYS,
  withCache,
  clearCacheByPattern
};
