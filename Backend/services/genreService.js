const genreDAO = require('../dao/genreDAO');
const { AppError } = require('../middlewares/errorMiddleware');

exports.createGenre = async (genreData) => {
  const existingGenre = await genreDAO.findByName(genreData.name);
  if (existingGenre) {
    throw new AppError('Genre already exists', 400);
  }
  return await genreDAO.create(genreData);
};

exports.getAllGenres = async () => {
  return await genreDAO.findAll();
}; 