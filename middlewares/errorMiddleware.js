class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.statusCode = 400;
    err.status = 'fail';
    err.message = `${field} already exists. Please use another value`;
    err.isOperational = true;
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    err.statusCode = 400;
    err.status = 'fail';
    err.message = `Invalid input data: ${errors.join('. ')}`;
    err.isOperational = true;
  }

  // Handle Mongoose CastError (invalid ID)
  if (err.name === 'CastError') {
    err.statusCode = 400;
    err.status = 'fail';
    err.message = `Invalid ${err.path}: ${err.value}`;
    err.isOperational = true;
  }

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
      ...(err.errors && { validationErrors: err.errors })
    });
  } else {
    // Production error response
    if (err.isOperational) {
      // Trusted error: send message to client
      const response = {
        status: err.status,
        message: err.message
      };
      
      // Include validation errors if they exist
      if (err.errors) {
        response.validationErrors = err.errors;
      }
      
      res.status(err.statusCode).json(response);
    } else {
      // Programming or unknown error: don't leak error details
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

module.exports = {
  AppError,
  errorHandler,
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
  handleJWTError,
  handleJWTExpiredError
};
