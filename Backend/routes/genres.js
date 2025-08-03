const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const { validateGenre } = require('../middlewares/validationMiddleware');
const auth = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/authorizationMiddleware');

// Public route
router.get('/', genreController.getAllGenres);

// Protected admin-only route
router.use(auth);
router.post('/', authorize('admin'), validateGenre, genreController.createGenre);

module.exports = router;
