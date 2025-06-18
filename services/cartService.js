const User = require('../models/User');
const Book = require('../models/Book');

exports.addToCart = async (userId, bookId, quantity) => {
  const book = await Book.findById(bookId);
  if (!book) {
    return null; // Indicates book not found
  }

  const user = await User.findById(userId);
  const existing = user.cart.find(item => item.book.toString() === bookId);
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    user.cart.push({ book: bookId, quantity });
  }

  await user.save();
  
  const populatedUser = await User.findById(user._id)
    .populate('cart.book');
  
  return populatedUser.cart;
};

exports.getCart = async (userId) => {
  const user = await User.findById(userId)
    .populate('cart.book');
  
  return user.cart;
};

exports.updateCart = async (userId, cartItemId, quantity) => {
  const user = await User.findById(userId);
  
  const cartItem = user.cart.id(cartItemId);
  if (!cartItem) {
    return null; // Indicates cart item not found
  }

  cartItem.quantity = quantity;
  await user.save();

  const populatedUser = await User.findById(user._id)
    .populate('cart.book');
  
  return populatedUser.cart;
};

exports.removeFromCart = async (userId, cartItemId) => {
  const user = await User.findById(userId);
  
  const cartItem = user.cart.id(cartItemId);
  if (!cartItem) {
    return null; // Indicates cart item not found
  }

  await cartItem.deleteOne();
  await user.save();

  return { message: 'Item removed from cart successfully' };
}; 