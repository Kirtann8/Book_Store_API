const userService = require('../services/userService');
const { AppError } = require('../middlewares/errorMiddleware');
const logger = require('../config/logger');

// Register New User
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    logger.info('Attempting to register new user', { email });
    const user = await userService.registerUser(name, email, password, role);

    if (!user) {
      return next(new AppError('User with this email already exists', 400));
    }

    logger.info('User registered successfully', { email });
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully'
    });
  } catch (err) {
    logger.error('Registration failed', { error: err.message, email: req.body.email });
    next(new AppError('Registration failed', 500));
  }
};

// Login User
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    logger.info('Attempting user login', { email });
    const token = await userService.loginUser(email, password);

    if (!token) {
      const userExists = await userService.checkUserExists(email);
      if (userExists) {
        logger.warn('Failed login attempt - Invalid credentials', { email });
        return next(new AppError('Invalid credentials', 401));
      } else {
        logger.warn('Failed login attempt - User not found', { email });
        return next(new AppError('User not found', 404));
      }
    }

    logger.info('User logged in successfully', { email });
    res.json({
      status: 'success',
      token
    });
  } catch (err) {
    logger.error('Login failed', { error: err.message, email: req.body.email });
    next(new AppError('Login failed', 500));
  }
};
