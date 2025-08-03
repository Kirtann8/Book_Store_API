const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/authorizationMiddleware');

// Admin only routes
router.use(auth);
router.use(authorize('admin'));

router.get('/', analyticsController.getAnalytics);
router.post('/reset', analyticsController.resetAnalytics);

module.exports = router;