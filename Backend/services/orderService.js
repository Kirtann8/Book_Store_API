const orderDAO = require('../dao/orderDAO');
const userDAO = require('../dao/userDAO');

exports.createOrder = async (userId, shippingAddress, paymentMethod) => {
  try {
    const user = await userDAO.findById(userId);
    if (!user || user.cart.length === 0) {
      return null; // Indicates user not found or empty cart
    }

    const orderData = {
      user: user._id,
      items: user.cart,
      totalAmount: user.cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0),
      shippingAddress,
      paymentMethod,
      status: 'Placed'
    };

    const order = await orderDAO.create(orderData);
    
    // Clear the user's cart after successful order
    await userDAO.updateById(userId, { cart: [] });
    
    return order;
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }

};

exports.getUserOrders = async (userId) => {
  try {
    return await orderDAO.findByUserId(userId);
  } catch (error) {
    throw new Error(`Error fetching user orders: ${error.message}`);
  }
};

exports.getAllOrders = async () => {
  try {
    return await orderDAO.findAll();
  } catch (error) {
    throw new Error(`Error fetching all orders: ${error.message}`);
  }
};

exports.getOrderById = async (orderId) => {
  try {
    return await orderDAO.findById(orderId);
  } catch (error) {
    throw new Error(`Error fetching order: ${error.message}`);
  }
};

exports.updateOrderStatus = async (orderId, status) => {
  try {
    return await orderDAO.updateById(orderId, { status });
  } catch (error) {
    throw new Error(`Error updating order status: ${error.message}`);
  }
};

exports.deleteOrder = async (orderId) => {
  try {
    return await orderDAO.deleteById(orderId);
  } catch (error) {
    throw new Error(`Error deleting order: ${error.message}`);
  }
};
exports.getOrders = async (userId) => {
  try {
    return await orderDAO.findByUserId(userId);
  } catch (error) {
    throw new Error(`Error fetching user orders: ${error.message}`);
  }
};

exports.getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId
  }).populate('items.book');
  return order;
};

exports.updateOrder = async (orderId, userId, status) => {
  const validStatuses = ['Pending', 'Placed', 'Shipped', 'Delivered'];
  if (!validStatuses.includes(status)) {
    return { error: 'Invalid status' }; // Indicates invalid status
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId
  });

  if (!order) {
    return null; // Indicates order not found
  }

  order.status = status;
  await order.save();

  const updatedOrder = await Order.findById(order._id)
    .populate('items.book');

  return updatedOrder;
}; 