const Order = require('../models/Order');

/**
 * Create a new order
 * @param {Object} orderData - The order data to create
 * @returns {Promise<Object>} The created order object
 */
exports.create = async (orderData) => {
  try {
    const order = new Order(orderData);
    await order.save();
    return await Order.findById(order._id)
      .populate('user', 'name email')
      .populate({
        path: 'items.book',
        select: 'title price',
        populate: [
          { path: 'author', select: 'name' },
          { path: 'genre', select: 'name' }
        ]
      });
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

/**
 * Find all orders
 * @returns {Promise<Array>} Array of order objects
 */
exports.findAll = async () => {
  try {
    return await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate({
        path: 'items.book',
        select: 'title price',
        populate: [
          { path: 'author', select: 'name' },
          { path: 'genre', select: 'name' }
        ]
      });
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

/**
 * Find an order by ID
 * @param {string} id - The order ID
 * @returns {Promise<Object|null>} The order object if found, null otherwise
 */
exports.findById = async (id) => {
  try {
    return await Order.findById(id)
      .populate('user', 'name email')
      .populate({
        path: 'items.book',
        select: 'title price',
        populate: [
          { path: 'author', select: 'name' },
          { path: 'genre', select: 'name' }
        ]
      });
  } catch (error) {
    throw new Error(`Error finding order: ${error.message}`);
  }
};

/**
 * Find orders by user ID
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of order objects
 */
exports.findByUserId = async (userId) => {
  try {
    return await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate({
        path: 'items.book',
        select: 'title price',
        populate: [
          { path: 'author', select: 'name' },
          { path: 'genre', select: 'name' }
        ]
      });
  } catch (error) {
    throw new Error(`Error finding orders by user: ${error.message}`);
  }
};

/**
 * Update an order by ID
 * @param {string} id - The order ID to update
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object|null>} The updated order object
 */
exports.updateById = async (id, updateData) => {
  try {
    return await Order.findByIdAndUpdate(id, updateData, { new: true })
      .populate('user', 'name email')
      .populate({
        path: 'items.book',
        select: 'title price',
        populate: [
          { path: 'author', select: 'name' },
          { path: 'genre', select: 'name' }
        ]
      });
  } catch (error) {
    throw new Error(`Error updating order: ${error.message}`);
  }
};

/**
 * Delete an order by ID
 * @param {string} id - The order ID to delete
 * @returns {Promise<Object|null>} The deleted order object
 */
exports.deleteById = async (id) => {
  try {
    return await Order.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting order: ${error.message}`);
  }
};
