const Genre = require('../models/Genre');

/**
 * Create a new genre
 * @param {Object} genreData - The genre data to create
 * @returns {Promise<Object>} The created genre object
 */
exports.create = async (genreData) => {
  try {
    const genre = new Genre(genreData);
    return await genre.save();
  } catch (error) {
    throw new Error(`Error creating genre: ${error.message}`);
  }
};

/**
 * Find all genres
 * @returns {Promise<Array>} Array of genre objects
 */
exports.findAll = async () => {
  try {
    return await Genre.find().sort({ name: 1 });
  } catch (error) {
    throw new Error(`Error fetching genres: ${error.message}`);
  }
};

/**
 * Find a genre by ID
 * @param {string} id - The genre ID
 * @returns {Promise<Object|null>} The genre object if found, null otherwise
 */
exports.findById = async (id) => {
  try {
    return await Genre.findById(id);
  } catch (error) {
    throw new Error(`Error finding genre: ${error.message}`);
  }
};

/**
 * Find a genre by name
 * @param {string} name - The genre name
 * @returns {Promise<Object|null>} The genre object if found, null otherwise
 */
exports.findByName = async (name) => {
  try {
    return await Genre.findOne({ name: { $regex: new RegExp(name, 'i') } });
  } catch (error) {
    throw new Error(`Error finding genre by name: ${error.message}`);
  }
};

/**
 * Update a genre by ID
 * @param {string} id - The genre ID to update
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object|null>} The updated genre object
 */
exports.updateById = async (id, updateData) => {
  try {
    return await Genre.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw new Error(`Error updating genre: ${error.message}`);
  }
};

/**
 * Delete a genre by ID
 * @param {string} id - The genre ID to delete
 * @returns {Promise<Object|null>} The deleted genre object
 */
exports.deleteById = async (id) => {
  try {
    return await Genre.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting genre: ${error.message}`);
  }
};
