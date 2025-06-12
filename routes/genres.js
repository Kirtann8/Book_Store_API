const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');

router.post('/', genreController.createGenre);
router.get('/', genreController.getAllGenres);

module.exports = router;
