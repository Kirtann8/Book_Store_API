const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const reviewRouter = require('./reviews');
const { validateBook } = require('../middlewares/validationMiddleware');
const auth = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/authorizationMiddleware');
const upload = require('../utils/fileUpload');

// Forward review routes
router.use('/:bookId/reviews', reviewRouter);

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/search', bookController.searchBooks);
router.get('/:id', bookController.getBook);

// Protected admin-only routes
router.use(auth);
router.post('/',
  authorize('admin'),
  upload.single('coverImage'),
  validateBook,
  bookController.createBook
);
router.put('/:id',
  authorize('admin'),
  upload.single('coverImage'),
  validateBook,
  bookController.updateBook
);
router.delete('/:id', authorize('admin'), bookController.deleteBook);

module.exports = router;
