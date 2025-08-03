const User = require('../models/User');

exports.addToCart = async (userId, bookId, quantity) => {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { cart: { book: bookId, quantity } } },
    { new: true }
  ).populate('cart.book');
};

exports.updateCartItem = async (userId, bookId, quantity) => {
  return await User.findOneAndUpdate(
    { _id: userId, 'cart.book': bookId },
    { $set: { 'cart.$.quantity': quantity } },
    { new: true }
  ).populate('cart.book');
};

exports.removeFromCart = async (userId, bookId) => {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { cart: { book: bookId } } },
    { new: true }
  ).populate('cart.book');
};

exports.getCart = async (userId) => {
  const user = await User.findById(userId).populate('cart.book');
  return user ? user.cart : [];
};

exports.clearCart = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: { cart: [] } },
    { new: true }
  );
};