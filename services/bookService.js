const bookDAO = require('../dao/bookDAO');
const { bookSchemas, validate } = require('../utils/validation');
const { CACHE_KEYS, withCache, clearCacheByPattern } = require('../utils/cache');
const { createPaginationOptions, formatPaginatedResponse } = require('../utils/pagination');

exports.createBook = async (bookData) => {
  try {
    // Validate input data
    const validatedData = validate(bookData, bookSchemas.create);
    
    // Create book
    const newBook = await bookDAO.create(validatedData);
    
    // Clear relevant caches
    clearCacheByPattern('books');
    
    return newBook;
  } catch (error) {
    throw new Error(`Error creating book: ${error.message}`);
  }
};

exports.getAllBooks = async (query = {}) => {
  try {
    const { sortBy, sortOrder, page, limit, ...filters } = query;
    
    // Create sort options
    const allowedSortFields = ['title', 'price', 'rating', 'createdAt'];
    const sortOptions = {};
    if (sortBy && allowedSortFields.includes(sortBy)) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    // Create pagination options
    const paginationOptions = createPaginationOptions({ page, limit });

    // Get data with caching
    const cacheKey = `books_${JSON.stringify({ sortOptions, paginationOptions, filters })}`;
    const { data, total } = await withCache(
      cacheKey,
      async () => {
        const [data, total] = await Promise.all([
          bookDAO.findAll(sortOptions, filters, paginationOptions),
          bookDAO.count(filters)
        ]);
        return { data, total };
      }
    );

    return formatPaginatedResponse(data, total, paginationOptions);
  } catch (error) {
    throw new Error(`Error fetching books: ${error.message}`);
  }
};

exports.updateBook = async (id, bookData) => {
  try {
    const updatedBook = await bookDAO.updateById(id, bookData);
    if (!updatedBook) {
      return null;
    }
    return updatedBook;
  } catch (error) {
    throw new Error(`Error updating book: ${error.message}`);
  }
};

exports.deleteBook = async (id) => {
  try {
    return await bookDAO.deleteById(id);
  } catch (error) {
    throw new Error(`Error deleting book: ${error.message}`);
  }
};

exports.searchBooks = async (query) => {
  try {
    const authorDAO = require('../dao/authorDAO');
    const genreDAO = require('../dao/genreDAO');
    const searchRegex = new RegExp(query, 'i');

    // Search for matching authors and genres
    const [matchingAuthors, matchingGenres] = await Promise.all([
      authorDAO.findAll(), // We'll filter in memory since we need regex
      genreDAO.findAll()  // We'll filter in memory since we need regex
    ]);

    const authorIds = matchingAuthors
      .filter(author => searchRegex.test(author.name))
      .map(author => author._id);
    
    const genreIds = matchingGenres
      .filter(genre => searchRegex.test(genre.name))
      .map(genre => genre._id);

    const searchConditions = [
      { title: searchRegex },
      { description: searchRegex }
    ];

    if (authorIds.length > 0) {
      searchConditions.push({ author: { $in: authorIds } });
    }
    if (genreIds.length > 0) {
      searchConditions.push({ genre: { $in: genreIds } });
    }

    return await bookDAO.findByConditions({ $or: searchConditions });
  } catch (error) {
    throw new Error(`Error searching books: ${error.message}`);
  }
}; 