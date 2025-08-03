const { body, param, validationResult } = require('express-validator');
const User = require('../models/User');
const Genre = require('../models/Genre');
const Author = require('../models/Author');
const Book = require('../models/Book');
const { AppError } = require('./errorMiddleware');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
    return next(new AppError(errorMessages, 400));
  }
  next();
};

// Custom validator for checking unique fields
const isUnique = (Model, field) => async (value) => {
  const query = {};
  query[field] = value;
  const exists = await Model.findOne(query);
  if (exists) {
    throw new Error(`${field} already exists`);
  }
  return true;
};

// Custom validator for checking if document exists
const exists = (Model) => async (value) => {
  const doc = await Model.findById(value);
  if (!doc) {
    throw new Error('Document not found');
  }
  return true;
};

exports.validateUser = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail()
    .custom(isUnique(User, 'email')),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

exports.validateBook = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('author')
    .isMongoId().withMessage('Valid author ID is required')
    .custom(exists(Author)),
  body('genre')
    .isMongoId().withMessage('Valid genre ID is required')
    .custom(exists(Genre)),
  body('price')
    .isFloat({ min: 0, max: 9999.99 }).withMessage('Price must be between 0 and 9999.99')
    .custom((value) => !isNaN(parseFloat(value)) && parseFloat(value).toFixed(2)),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters'),
  handleValidationErrors,
];

exports.validateOrder = [
  body('shippingAddress')
    .isObject().withMessage('Shipping address is required'),
  body('shippingAddress.street')
    .trim()
    .notEmpty().withMessage('Street is required')
    .isLength({ max: 100 }).withMessage('Street must not exceed 100 characters'),
  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('City is required')
    .isLength({ max: 50 }).withMessage('City must not exceed 50 characters'),
  body('shippingAddress.state')
    .trim()
    .notEmpty().withMessage('State is required')
    .isLength({ max: 50 }).withMessage('State must not exceed 50 characters'),
  body('shippingAddress.zipCode')
    .trim()
    .notEmpty().withMessage('Zip code is required')
    .matches(/^\d{5}(-\d{4})?$/).withMessage('Invalid zip code format'),
  body('shippingAddress.country')
    .trim()
    .notEmpty().withMessage('Country is required')
    .isLength({ max: 50 }).withMessage('Country must not exceed 50 characters'),
  body('paymentMethod')
    .isIn(['credit_card', 'debit_card', 'paypal'])
    .withMessage('Invalid payment method'),
  handleValidationErrors,
];

exports.validateAuthor = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .custom(isUnique(Author, 'name')),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Bio must not exceed 1000 characters'),
  handleValidationErrors,
];

exports.validateGenre = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .custom(isUnique(Genre, 'name')),
  handleValidationErrors,
];

exports.validateCart = [
  body('bookId')
    .isMongoId().withMessage('Valid book ID is required')
    .custom(exists(Book)),
  body('quantity')
    .isInt({ min: 1, max: 99 }).withMessage('Quantity must be between 1 and 99'),
  handleValidationErrors,
];

exports.validateCartUpdate = [
  body('quantity')
    .isInt({ min: 1, max: 99 }).withMessage('Quantity must be between 1 and 99'),
  handleValidationErrors,
];

exports.validateId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors,
];

exports.validateOrderStatus = [
  body('status')
    .isIn(['Pending', 'Placed', 'Shipped', 'Delivered'])
    .withMessage('Invalid status value'),
  handleValidationErrors,
];

exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

exports.validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .trim()
    .notEmpty()
    .withMessage('Review text is required')
    .isLength({ max: 500 })
    .withMessage('Review must not exceed 500 characters'),
  handleValidationErrors,
];

exports.validatePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  handleValidationErrors,
];
