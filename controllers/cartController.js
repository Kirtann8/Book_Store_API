const cartService = require('../services/cartService');

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    
    const cart = await cartService.addToCart(req.user.userId, bookId, quantity);

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    res.json({
      success: true,
      data: cart
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
    const cart = await cartService.getCart(req.user.userId);
    
    res.json({
      success: true,
      data: cart
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
    const cart = await cartService.updateCart(req.user.userId, req.params.id, quantity);
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      data: cart
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
    const result = await cartService.removeFromCart(req.user.userId, req.params.id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

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
