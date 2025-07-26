const Book = require('../models/Book');

/**
 * Create a new book
 * @param {Object} bookData - The book data to create
 * @returns {Promise<Object>} The created book object
 */
exports.create = async (bookData) => {
  try {
    const book = new Book(bookData);
    await book.save();
    return await Book.findById(book._id)
      .populate('author', 'name')
      .populate('genre', 'name');
  } catch (error) {
    throw new Error(`Error creating book: ${error.message}`);
  }
};

/**
 * Get all books with optional sorting
 * @param {Object} sortOptions - Sorting options
 * @returns {Promise<Array>} Array of book objects
 */
exports.findAll = async (sortOptions = { createdAt: -1 }, filters = {}, pagination = null) => {
  try {
    let query = Book.find(filters);

    // Apply sorting
    query = query.sort(sortOptions);

    // Apply pagination if provided
    if (pagination) {
      const { skip, limit } = pagination;
      query = query.skip(skip).limit(limit);
    }

    // Execute query with population
    return await query
      .populate('author', 'name')
      .populate('genre', 'name');
  } catch (error) {
    throw new Error(`Error fetching books: ${error.message}`);
  }
};

/**
 * Count total number of books matching filters
 * @param {Object} filters - Query filters
 * @returns {Promise<number>} Total count of matching books
 */
exports.count = async (filters = {}) => {
  try {
    return await Book.countDocuments(filters);
  } catch (error) {
    throw new Error(`Error counting books: ${error.message}`);
  }
};

/**
 * Find a book by ID
 * @param {string} id - The book ID
 * @returns {Promise<Object|null>} The book object if found, null otherwise
 */
exports.findById = async (id) => {
  try {
    return await Book.findById(id)
      .populate('author', 'name')
      .populate('genre', 'name');
  } catch (error) {
    throw new Error(`Error finding book by id: ${error.message}`);
  }
};

/**
 * Update a book by ID
 * @param {string} id - The book ID to update
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object|null>} The updated book object
 */
exports.updateById = async (id, updateData) => {
  try {
    return await Book.findByIdAndUpdate(id, updateData, { new: true })
      .populate('author', 'name')
      .populate('genre', 'name');
  } catch (error) {
    throw new Error(`Error updating book: ${error.message}`);
  }
};

/**
 * Delete a book by ID
 * @param {string} id - The book ID to delete
 * @returns {Promise<Object|null>} The deleted book object
 */
exports.deleteById = async (id) => {
  try {
    return await Book.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting book: ${error.message}`);
  }
};

/**
 * Find books by genre ID
 * @param {string} genreId - The genre ID
 * @returns {Promise<Array>} Array of book objects
 */
exports.findByGenre = async (genreId) => {
  try {
    return await Book.find({ genre: genreId })
      .populate('author', 'name')
      .populate('genre', 'name');
  } catch (error) {
    throw new Error(`Error finding books by genre: ${error.message}`);
  }
};

/**
 * Find books by author ID
 * @param {string} authorId - The author ID
 * @returns {Promise<Array>} Array of book objects
 */
exports.findByAuthor = async (authorId) => {
  try {
    return await Book.find({ author: authorId })
      .populate('author', 'name')
      .populate('genre', 'name');
  } catch (error) {
    throw new Error(`Error finding books by author: ${error.message}`);
  }
};

/**
 * Find books by custom conditions
 * @param {Object} conditions - Mongoose query conditions
 * @returns {Promise<Array>} Array of book objects
 */
exports.findByConditions = async (conditions) => {
  try {
    return await Book.find(conditions)
      .populate('author', 'name')
      .populate('genre', 'name');
  } catch (error) {
    throw new Error(`Error finding books by conditions: ${error.message}`);
  }
};
