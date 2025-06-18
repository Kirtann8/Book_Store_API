const bookService = require('../services/bookService');
const Author = require('../models/Author');
const Genre = require('../models/Genre');

// Create Book
exports.createBook = async (req, res) => {
  try {
    const { title, author, genre, price, rating, description } = req.body;
    const populatedBook = await bookService.createBook({ title, author, genre, price, rating, description });
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
    const books = await bookService.getAllBooks(sortBy, sortOrder);
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
    const updatedBook = await bookService.updateBook(
      req.params.id,
      { title, author, genre, price, rating, description }
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: updatedBook
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
    const deletedBook = await bookService.deleteBook(req.params.id);
    
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

    const books = await bookService.searchBooks(query);

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
