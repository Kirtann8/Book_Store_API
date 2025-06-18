const genreService = require('../services/genreService');

//  Create Genre
exports.createGenre = async (req, res) => {
  try {
    const genre = await genreService.createGenre(req.body);
    res.status(201).json(genre);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create genre', error: err.message });
  }
};

//  Get All Genres
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await genreService.getAllGenres();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch genres', error: err.message });
  }
};
