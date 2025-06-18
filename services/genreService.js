const Genre = require('../models/Genre');

exports.createGenre = async (genreData) => {
  const genre = new Genre(genreData);
  await genre.save();
  return genre;
};

exports.getAllGenres = async () => {
  const genres = await Genre.find();
  return genres;
}; 