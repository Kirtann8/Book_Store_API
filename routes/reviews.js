const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const auth = require('../middlewares/authMiddleware');
const { validateReview } = require('../middlewares/validationMiddleware');

router.get('/', reviewController.getBookReviews);

// Protected routes
router.use(auth);
router.post('/', validateReview, reviewController.createReview);
router.patch('/:reviewId', validateReview, reviewController.updateReview);
router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;
