const Author = require('../models/Author');

/**
 * Create a new author
 * @param {Object} authorData - The author data to create
 * @returns {Promise<Object>} The created author object
 */
exports.create = async (authorData) => {
  try {
    const author = new Author(authorData);
    return await author.save();
  } catch (error) {
    throw new Error(`Error creating author: ${error.message}`);
  }
};

/**
 * Find all authors
 * @returns {Promise<Array>} Array of author objects
 */
exports.findAll = async () => {
  try {
    return await Author.find().sort({ name: 1 });
  } catch (error) {
    throw new Error(`Error fetching authors: ${error.message}`);
  }
};

/**
 * Find an author by ID
 * @param {string} id - The author ID
 * @returns {Promise<Object|null>} The author object if found, null otherwise
 */
exports.findById = async (id) => {
  try {
    return await Author.findById(id);
  } catch (error) {
    throw new Error(`Error finding author: ${error.message}`);
  }
};

/**
 * Update an author by ID
 * @param {string} id - The author ID to update
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object|null>} The updated author object
 */
exports.updateById = async (id, updateData) => {
  try {
    return await Author.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw new Error(`Error updating author: ${error.message}`);
  }
};

/**
 * Delete an author by ID
 * @param {string} id - The author ID to delete
 * @returns {Promise<Object|null>} The deleted author object
 */
exports.deleteById = async (id) => {
  try {
    return await Author.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting author: ${error.message}`);
  }
};
