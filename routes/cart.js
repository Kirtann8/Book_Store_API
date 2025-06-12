const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Add this line to import the auth middleware
const auth = require('../middlewares/authMiddleware');

// Protected Route - Only logged-in users can add to cart
router.post('/add', auth, cartController.addToCart);

// Example: View cart (also protected)
router.get('/', auth, cartController.getCart);

// You can add more cart routes below...
// like delete from cart etc.

module.exports = router;
