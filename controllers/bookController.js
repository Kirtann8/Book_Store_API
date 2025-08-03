const Book = require('../models/Book');
const { AppError } = require('../middlewares/errorMiddleware');
const APIFeatures = require('../utils/apiFeatures');

// Create Book
exports.createBook = async (req, res, next) => {
  try {
    const bookData = {
      ...req.body,
      coverImage: req.file ? req.file.filename : undefined
    };

    const book = await Book.create(bookData);
    const populatedBook = await Book.findById(book._id)
      .populate('author', 'name')
      .populate('genre', 'name');

    res.status(201).json({
      status: 'success',
      data: populatedBook
    });
  } catch (err) {
    next(new AppError('Error creating book', 500));
  }
};

// Get All Books
exports.getAllBooks = async (req, res, next) => {
  try {
    // Use lean() for read-only data to improve performance
    const features = new APIFeatures(
      Book.find()
        .populate('author', 'name')  // Only select necessary fields
        .populate('genre', 'name')   // Only select necessary fields
        .lean(),                     // Convert to plain JavaScript objects
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const books = await features.query;

    res.status(200).json({
      status: 'success',
      results: books.length,
      data: books
    });
  } catch (err) {
    next(new AppError('Error fetching books', 500));
  }
};

// Get Single Book
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('author', 'name')
      .populate('genre', 'name')
      .populate('reviews.user', 'name');

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: book
    });
  } catch (err) {
    next(new AppError('Error fetching book', 500));
  }
};

// Update Book
exports.updateBook = async (req, res, next) => {
  try {
    const bookData = {
      ...req.body
    };

    if (req.file) {
      bookData.coverImage = req.file.filename;
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      bookData,
      {
        new: true,
        runValidators: true
      }
    ).populate('author genre');

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: book
    });
  } catch (err) {
    next(new AppError('Error updating book', 500));
  }
};

// Delete Book
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(new AppError('Error deleting book', 500));
  }
};

// Search Books
exports.searchBooks = async (req, res, next) => {
  try {
    const { q, query, minPrice, maxPrice, genre } = req.query;
    const searchTerm = q || query;
    
    if (!searchTerm) {
      return next(new AppError('Search query is required', 400));
    }

    let books = [];
    
    try {
      // Try text index search first
      const searchQuery = {
        $text: { $search: searchTerm }
      };

      // Add optional filters
      if (minPrice || maxPrice) {
        searchQuery.price = {};
        if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
        if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
      }

      if (genre) {
        searchQuery.genre = genre;
      }

      books = await Book.find(searchQuery)
        .select('title author genre price averageRating coverImage')
        .populate('author', 'name')
        .populate('genre', 'name')
        .lean()
        .sort({ 
          score: { $meta: 'textScore' },
          averageRating: -1
        });
    } catch (textSearchError) {
      // Fallback to regex search if text index fails
      const regexQuery = {
        title: { $regex: searchTerm, $options: 'i' }
      };

      // Add optional filters
      if (minPrice || maxPrice) {
        regexQuery.price = {};
        if (minPrice) regexQuery.price.$gte = parseFloat(minPrice);
        if (maxPrice) regexQuery.price.$lte = parseFloat(maxPrice);
      }

      if (genre) {
        regexQuery.genre = genre;
      }

      books = await Book.find(regexQuery)
        .select('title author genre price averageRating coverImage')
        .populate('author', 'name')
        .populate('genre', 'name')
        .lean()
        .sort({ averageRating: -1 });
    }

    res.status(200).json({
      status: 'success',
      results: books.length,
      data: books
    });
  } catch (err) {
    next(new AppError('Error searching books', 500));
  }
};
