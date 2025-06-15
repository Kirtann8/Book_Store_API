const Book = require('../models/Book');
const Author = require('../models/Author');
const Genre = require('../models/Genre');

// Create Book
exports.createBook = async (req, res) => {
  try {
    const { title, author, genre, price, rating, description } = req.body;
    const book = new Book({ title, author, genre, price, rating, description });
    await book.save();

    const populatedBook = await Book.findById(book._id)
      .populate('author', 'name')
      .populate('genre', 'name');

    res.status(201).json({
      success: true,
      data: populatedBook
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get All Books
exports.getAllBooks = async (req, res) => {
  try {
    const { sortBy, sortOrder } = req.query;
    let query = Book.find();

    const allowedSortFields = ['title', 'price', 'rating', 'createdAt'];
    const sortOptions = {};

    if (sortBy && allowedSortFields.includes(sortBy)) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default sort if no valid sortBy is provided
      sortOptions.createdAt = -1; 
    }
    query = query.sort(sortOptions);

    const books = await query
      .populate('author', 'name')
      .populate('genre', 'name');
    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Update Book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, genre, price, rating, description } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, genre, price, rating, description },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    const populatedBook = await Book.findById(updatedBook._id)
      .populate('author', 'name')
      .populate('genre', 'name');

    res.json({
      success: true,
      data: populatedBook
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Delete Book
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    
    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Search Books
exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const searchRegex = new RegExp(query, 'i'); // Case-insensitive search

    // Find authors and genres matching the search query
    const matchingAuthors = await Author.find({ name: searchRegex }).select('_id');
    const matchingGenres = await Genre.find({ name: searchRegex }).select('_id');

    const authorIds = matchingAuthors.map(author => author._id);
    const genreIds = matchingGenres.map(genre => genre._id);

    const searchConditions = [
      { title: searchRegex },
      { description: searchRegex },
    ];

    if (authorIds.length > 0) {
      searchConditions.push({ author: { $in: authorIds } });
    }
    if (genreIds.length > 0) {
      searchConditions.push({ genre: { $in: genreIds } });
    }

    const books = await Book.find({
      $or: searchConditions
    })
      .populate('author', 'name')
      .populate('genre', 'name');

    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
