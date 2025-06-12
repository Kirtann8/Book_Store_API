const Book = require('../models/Book');

// Create Book
exports.createBook = async (req, res) => {
  try {
    const { title, author, genre, price, rating, description } = req.body;
    const book = new Book({ title, author, genre, price, rating, description });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Book creation failed', error: error.message });
  }
};

// Get All Books (with populate)
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('author').populate('genre');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Fetch failed', error: error.message });
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
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// Delete Book
exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};
