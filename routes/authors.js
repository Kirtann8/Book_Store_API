const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const { validateAuthor } = require('../middlewares/validationMiddleware');
const auth = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/authorizationMiddleware');

// Public route
router.get('/', authorController.getAllAuthors);

// Protected admin-only routes
router.use(auth); // Apply authentication to all routes below
router.post('/', authorize('admin'), validateAuthor, authorController.createAuthor);
router.put('/:id', authorize('admin'), validateAuthor, authorController.updateAuthor);
router.delete('/:id', authorize('admin'), authorController.deleteAuthor);

module.exports = router;
