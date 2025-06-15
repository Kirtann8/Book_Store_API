const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/authMiddleware');

// Cart Routes
router.post('/', auth, cartController.addToCart);      // Add to cart
router.get('/', auth, cartController.getCart);         // Get cart
router.put('/:id', auth, cartController.updateCart);   // Update cart item
router.delete('/:id', auth, cartController.removeFromCart); // Remove from cart

module.exports = router;
