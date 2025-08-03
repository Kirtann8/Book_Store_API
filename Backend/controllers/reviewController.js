const Book = require('../models/Book');
const { AppError } = require('../middlewares/errorMiddleware');

// Get all reviews for a book
exports.getBookReviews = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId).populate('reviews.user', 'name email');

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    res.status(200).json({
      status: 'success',
      results: book.reviews.length,
      data: book.reviews
    });
  } catch (err) {
    next(new AppError('Error fetching reviews', 500));
  }
};

// Create a review for a book
exports.createReview = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    const existingReview = book.reviews.find(r => r.user.toString() === req.user.userId);
    if (existingReview) {
      return next(new AppError('You have already reviewed this book', 400));
    }

    const newReview = {
      user: req.user.userId,
      rating,
      review
    };

    book.reviews.push(newReview);
    book.calculateAverageRating();
    await book.save();

    res.status(201).json({
      status: 'success',
      data: newReview
    });
  } catch (err) {
    next(new AppError('Error creating review', 500));
  }
};

// Update a review for a book
exports.updateReview = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    const existingReview = book.reviews.find(r => r._id.toString() === req.params.reviewId);
    if (!existingReview) {
      return next(new AppError('Review not found', 404));
    }

    if (existingReview.user.toString() !== req.user.userId) {
      return next(new AppError('You are not authorized to update this review', 403));
    }

    existingReview.rating = rating;
    existingReview.review = review;
    book.calculateAverageRating();
    await book.save();

    res.status(200).json({
      status: 'success',
      data: existingReview
    });
  } catch (err) {
    next(new AppError('Error updating review', 500));
  }
};

// Delete a review for a book
exports.deleteReview = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    const reviewIndex = book.reviews.findIndex(r => r._id.toString() === req.params.reviewId);
    if (reviewIndex === -1) {
      return next(new AppError('Review not found', 404));
    }

    const review = book.reviews[reviewIndex];
    if (review.user.toString() !== req.user.userId) {
      return next(new AppError('You are not authorized to delete this review', 403));
    }

    book.reviews.splice(reviewIndex, 1);
    book.calculateAverageRating();
    await book.save();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(new AppError('Error deleting review', 500));
  }
};
