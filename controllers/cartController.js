const User = require('../models/User');
const Book = require('../models/Book');

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    
    // Validate book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    const user = await User.findById(req.user.userId);
    const existing = user.cart.find(item => item.book.toString() === bookId);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ book: bookId, quantity });
    }

    await user.save();
    
    // Populate book details before sending response
    const populatedUser = await User.findById(user._id)
      .populate('cart.book');
    
    res.json({
      success: true,
      data: populatedUser.cart
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('cart.book');
    
    res.json({
      success: true,
      data: user.cart
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Update Cart Item
exports.updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.userId);
    
    const cartItem = user.cart.id(req.params.id);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    cartItem.quantity = quantity;
    await user.save();

    const populatedUser = await User.findById(user._id)
      .populate('cart.book');
    
    res.json({
      success: true,
      data: populatedUser.cart
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    const cartItem = user.cart.id(req.params.id);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    await cartItem.deleteOne();
    await user.save();

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};
