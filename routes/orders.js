const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/authMiddleware');

router.post('/place', auth, orderController.placeOrder);
router.get('/', auth, orderController.getOrders);

module.exports = router;
