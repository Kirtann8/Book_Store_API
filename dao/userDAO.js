const User = require('../models/User');

/**
 * Find a user by their email address
 * @param {string} email - The email address to search for
 * @returns {Promise<Object|null>} The user object if found, null otherwise
 */
exports.findByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
};

/**
 * Create a new user
 * @param {Object} userData - The user data to create
 * @returns {Promise<Object>} The created user object
 */
exports.create = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

/**
 * Find a user by their ID
 * @param {string} id - The user ID to search for
 * @returns {Promise<Object|null>} The user object if found, null otherwise
 */
exports.findById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    throw new Error(`Error finding user by id: ${error.message}`);
  }
};

/**
 * Update a user by their ID
 * @param {string} id - The user ID to update
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object|null>} The updated user object
 */
exports.updateById = async (id, updateData) => {
  try {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

/**
 * Delete a user by their ID
 * @param {string} id - The user ID to delete
 * @returns {Promise<Object|null>} The deleted user object
 */
exports.deleteById = async (id) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};
