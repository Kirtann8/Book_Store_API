const User = require('../models/User');
const Order = require('../models/Order');

exports.createOrder = async (userId, shippingAddress, paymentMethod) => {
  const user = await User.findById(userId).populate('cart.book');
    
  if (user.cart.length === 0) {
    return null; // Indicates empty cart
  }

  const order = new Order({
    user: user._id,
    items: user.cart,
    totalAmount: user.cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0),
    shippingAddress,
    paymentMethod,
    status: 'Placed'
  });

  await order.save();
  
  // Clear the user's cart after successful order
  user.cart = [];
  await user.save();

  const populatedOrder = await Order.findById(order._id)
    .populate('items.book')
    .populate('user', 'name email');

  return populatedOrder;
};

exports.getOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate('items.book')
    .sort({ createdAt: -1 });
  return orders;
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