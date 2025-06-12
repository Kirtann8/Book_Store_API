const User = require('../models/User');
const Book = require('../models/Book');

// ➕ Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const user = await User.findById(req.user.userId);

    const existing = user.cart.find(item => item.book.toString() === bookId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ book: bookId, quantity });
    }

    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to cart', error: err.message });
  }
};

// 🛒 Get Cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart.book');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get cart', error: err.message });
  }
};
