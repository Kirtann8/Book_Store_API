const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// CRUD Routes
router.post('/', bookController.createBook);      // Create
router.get('/', bookController.getAllBooks);      // Read all
router.put('/:id', bookController.updateBook);    // Update
router.delete('/:id', bookController.deleteBook); // Delete

module.exports = router;
