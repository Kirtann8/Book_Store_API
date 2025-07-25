const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateLogin } = require('../middlewares/validationMiddleware');

// POST /api/users/register
router.post('/register', validateUser, userController.registerUser);

// POST /api/users/login
router.post('/login', validateLogin, userController.loginUser);

module.exports = router;
