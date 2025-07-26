const authorDAO = require('../dao/authorDAO');

exports.createAuthor = async (authorData) => {
  try {
    return await authorDAO.create(authorData);
  } catch (error) {
    throw new Error(`Error creating author: ${error.message}`);
  }
};

exports.getAllAuthors = async () => {
  try {
    return await authorDAO.findAll();
  } catch (error) {
    throw new Error(`Error fetching authors: ${error.message}`);
  }
};

exports.updateAuthor = async (id, authorData) => {
  try {
    const updatedAuthor = await authorDAO.updateById(id, authorData);
    if (!updatedAuthor) {
      throw new Error('Author not found');
    }
    return updatedAuthor;
  } catch (error) {
    throw new Error(`Error updating author: ${error.message}`);
  }
};

exports.deleteAuthor = async (id) => {
  try {
    const deletedAuthor = await authorDAO.deleteById(id);
    if (!deletedAuthor) {
      throw new Error('Author not found');
    }
    return { message: 'Author deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting author: ${error.message}`);
  }
}; 