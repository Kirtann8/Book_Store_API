const Book = require('../models/Book');
const Author = require('../models/Author');
const Genre = require('../models/Genre');

exports.createBook = async (bookData) => {
  const book = new Book(bookData);
  await book.save();
  const populatedBook = await Book.findById(book._id)
    .populate('author', 'name')
    .populate('genre', 'name');
  return populatedBook;
};

exports.getAllBooks = async (sortBy, sortOrder) => {
  let query = Book.find();

  const allowedSortFields = ['title', 'price', 'rating', 'createdAt'];
  const sortOptions = {};

  if (sortBy && allowedSortFields.includes(sortBy)) {
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  } else {
    sortOptions.createdAt = -1;
  }
  query = query.sort(sortOptions);

  const books = await query
    .populate('author', 'name')
    .populate('genre', 'name');
  return books;
};

exports.updateBook = async (id, bookData) => {
  const updatedBook = await Book.findByIdAndUpdate(
    id,
    bookData,
    { new: true }
  );
  if (!updatedBook) {
    return null;
  }
  const populatedBook = await Book.findById(updatedBook._id)
    .populate('author', 'name')
    .populate('genre', 'name');
  return populatedBook;
};

exports.deleteBook = async (id) => {
  const deletedBook = await Book.findByIdAndDelete(id);
  return deletedBook;
};

exports.searchBooks = async (query) => {
  const searchRegex = new RegExp(query, 'i');

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
  return books;
}; 