const genreDAO = require('../dao/genreDAO');

exports.createGenre = async (genreData) => {
  try {
    // Check if genre already exists
    const existingGenre = await genreDAO.findByName(genreData.name);
    if (existingGenre) {
      throw new Error('Genre already exists');
    }
    return await genreDAO.create(genreData);
  } catch (error) {
    throw new Error(`Error creating genre: ${error.message}`);
  }
};

exports.getAllGenres = async () => {
  try {
    return await genreDAO.findAll();
  } catch (error) {
    throw new Error(`Error fetching genres: ${error.message}`);
  }
}; 