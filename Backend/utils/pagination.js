/**
 * Create pagination options from query parameters
 * @param {Object} query - Query parameters from request
 * @returns {Object} Pagination options
 */
const createPaginationOptions = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip
  };
};

/**
 * Format paginated response
 * @param {Array} data - The data to paginate
 * @param {number} total - Total number of records
 * @param {Object} options - Pagination options
 * @returns {Object} Formatted response with pagination metadata
 */
const formatPaginatedResponse = (data, total, options) => {
  const { page, limit } = options;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      pageSize: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

module.exports = {
  createPaginationOptions,
  formatPaginatedResponse
};
