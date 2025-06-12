const User = require('../models/User');
const Order = require('../models/Order');

// 🧾 Place Order
exports.placeOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart.book');
    if (user.cart.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const order = new Order({
      user: user._id,
      items: user.cart,
      total: user.cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0)
    });

    await order.save();
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};

// 📜 View Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('items.book');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get orders', error: err.message });
  }
};
