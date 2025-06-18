const Author = require('../models/Author');

exports.createAuthor = async (authorData) => {
  const author = new Author(authorData);
  await author.save();
  return author;
};

exports.getAllAuthors = async () => {
  const authors = await Author.find();
  return authors;
};

exports.updateAuthor = async (id, authorData) => {
  const updatedAuthor = await Author.findByIdAndUpdate(
    id,
    authorData,
    { new: true }
  );
  return updatedAuthor;
};

exports.deleteAuthor = async (id) => {
  await Author.findByIdAndDelete(id);
  return { message: 'Author deleted successfully' };
}; 