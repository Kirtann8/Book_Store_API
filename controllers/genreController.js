const genreService = require('../services/genreService');
const { success } = require('../utils/responseHandler');

exports.createGenre = async (req, res, next) => {
  try {
    const genre = await genreService.createGenre(req.body);
    success(res, genre, 'Genre created successfully', 201);
  } catch (err) {
    next(err);
  }
};

exports.getAllGenres = async (req, res, next) => {
  try {
    const genres = await genreService.getAllGenres();
    success(res, genres, 'Genres fetched successfully');
  } catch (err) {
    next(err);
  }
};
