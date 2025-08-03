const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/authMiddleware');
const { authorize, checkResourceOwnership } = require('../middlewares/authorizationMiddleware');
const { validateOrder } = require('../middlewares/validationMiddleware');
const { body } = require('express-validator');

// All routes require authentication
router.use(auth);

// User routes (protected by resource ownership)
router.post('/', validateOrder, orderController.createOrder);
router.get('/my-orders', orderController.getOrders); // Get user's own orders
router.get('/:id', checkResourceOwnership, orderController.getOrderById);

// Admin routes
router.get('/', authorize('admin'), orderController.getOrders); // Get all orders
router.put('/:id', authorize('admin'), [
  body('status').isIn(['Pending', 'Placed', 'Shipped', 'Delivered']).withMessage('Invalid status')
], orderController.updateOrder);

module.exports = router;
