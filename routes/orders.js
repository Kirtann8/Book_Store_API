const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/authMiddleware');

// Order Routes
router.post('/', auth, orderController.createOrder);      // Create order
router.get('/', auth, orderController.getOrders);         // Get all orders
router.get('/:id', auth, orderController.getOrderById);   // Get order by ID
router.put('/:id', auth, orderController.updateOrder);    // Update order status

module.exports = router;
