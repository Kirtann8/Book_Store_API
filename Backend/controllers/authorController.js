const authorService = require('../services/authorService');

// Create Author
exports.createAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const author = await authorService.createAuthor({ name, bio });
    res.status(201).json(author);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Author creation failed', error: error.message });
  }
};

// Get All Authors
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await authorService.getAllAuthors();
    res.json(authors);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch authors', error: error.message });
  }
};

// Update Author
exports.updateAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const updatedAuthor = await authorService.updateAuthor(
      req.params.id,
      { name, bio }
    );
    res.json(updatedAuthor);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// Delete Author
exports.deleteAuthor = async (req, res) => {
  try {
    const result = await authorService.deleteAuthor(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};
