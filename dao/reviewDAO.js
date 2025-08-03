const Book = require('../models/Book');

exports.addReview = async (bookId, userId, rating, review) => {
  const book = await Book.findById(bookId);
  book.reviews.push({ user: userId, rating, review });
  book.calculateAverageRating();
  return await book.save();
};

exports.updateReview = async (bookId, userId, rating, review) => {
  const book = await Book.findById(bookId);
  const reviewIndex = book.reviews.findIndex(r => r.user.toString() === userId);
  if (reviewIndex !== -1) {
    book.reviews[reviewIndex] = { user: userId, rating, review, createdAt: Date.now() };
    book.calculateAverageRating();
    return await book.save();
  }
  return null;
};

exports.deleteReview = async (bookId, userId) => {
  const book = await Book.findById(bookId);
  book.reviews = book.reviews.filter(r => r.user.toString() !== userId);
  book.calculateAverageRating();
  return await book.save();
};

exports.getBookReviews = async (bookId) => {
  const book = await Book.findById(bookId).populate('reviews.user', 'name');
  return book ? book.reviews : [];
};