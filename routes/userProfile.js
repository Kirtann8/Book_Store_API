const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const auth = require('../middlewares/authMiddleware');
const { validateUser, validatePassword } = require('../middlewares/validationMiddleware');
const { authorize } = require('../middlewares/authorizationMiddleware');

// Profile routes
router.get('/profile', auth, userProfileController.getProfile);
router.patch('/profile', auth, validateUser, userProfileController.updateProfile);
router.patch('/change-password', auth, validatePassword, userProfileController.changePassword);

// Admin routes
router.use(auth, authorize('admin'));
router.get('/', userProfileController.getAllUsers);
router.get('/:id', userProfileController.getUser);
router.patch('/:id', validateUser, userProfileController.updateUser);
router.delete('/:id', userProfileController.deleteUser);

module.exports = router;
