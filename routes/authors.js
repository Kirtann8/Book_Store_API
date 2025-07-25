const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

// CRUD Routes
router.post('/', authorController.createAuthor);
router.get('/', authorController.getAllAuthors);
router.put('/:id', authorController.updateAuthor);
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;
