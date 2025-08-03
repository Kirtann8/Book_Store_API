// Basic MongoDB injection sanitization
exports.mongoSanitize = (req, res, next) => {
  if (req.body) {
    req.body = JSON.parse(JSON.stringify(req.body).replace(/\$\w+/g, ''));
  }
  if (req.query) {
    req.query = JSON.parse(JSON.stringify(req.query).replace(/\$\w+/g, ''));
  }
  next();
};

// Basic XSS protection
exports.xssClean = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/<script[^>]*>.*?<\/script>/gi, '');
      }
    });
  }
  next();
};