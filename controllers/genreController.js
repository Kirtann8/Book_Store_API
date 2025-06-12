const Genre = require('../models/Genre');

// 🎭 Create Genre
exports.createGenre = async (req, res) => {
  try {
    const genre = new Genre(req.body);
    await genre.save();
    res.status(201).json(genre);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create genre', error: err.message });
  }
};

// 📋 Get All Genres
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch genres', error: err.message });
  }
};
