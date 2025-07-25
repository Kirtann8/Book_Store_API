const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/authMiddleware');
const { validateCart, validateCartUpdate } = require('../middlewares/validationMiddleware');

// Cart Routes
router.post('/', auth, validateCart, cartController.addToCart);      // Add to cart
router.get('/', auth, cartController.getCart);         // Get cart
router.put('/:id', auth, validateCartUpdate, cartController.updateCart);   // Update cart item
router.delete('/:id', auth, cartController.removeFromCart); // Remove from cart

module.exports = router;
