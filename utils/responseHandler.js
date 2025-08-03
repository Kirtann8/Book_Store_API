exports.success = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

exports.error = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message
  });
};