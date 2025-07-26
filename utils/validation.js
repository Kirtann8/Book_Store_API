const Joi = require('joi');

// Book validation schemas
const bookSchemas = {
  create: Joi.object({
    title: Joi.string().required().min(1).max(200),
    author: Joi.string().required(), // MongoDB ObjectId
    genre: Joi.string().required(), // MongoDB ObjectId
    description: Joi.string().required().min(10),
    price: Joi.number().required().min(0),
    stock: Joi.number().integer().min(0).required(),
    isbn: Joi.string().pattern(/^[\d-]{10,17}$/),
    publishedYear: Joi.number().integer().min(1800).max(new Date().getFullYear())
  }),

  update: Joi.object({
    title: Joi.string().min(1).max(200),
    author: Joi.string(), // MongoDB ObjectId
    genre: Joi.string(), // MongoDB ObjectId
    description: Joi.string().min(10),
    price: Joi.number().min(0),
    stock: Joi.number().integer().min(0),
    isbn: Joi.string().pattern(/^[\d-]{10,17}$/),
    publishedYear: Joi.number().integer().min(1800).max(new Date().getFullYear())
  })
};

// Author validation schemas
const authorSchemas = {
  create: Joi.object({
    name: Joi.string().required().min(2).max(100),
    bio: Joi.string().min(10),
    birthDate: Joi.date().iso().max('now'),
    nationality: Joi.string()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100),
    bio: Joi.string().min(10),
    birthDate: Joi.date().iso().max('now'),
    nationality: Joi.string()
  })
};

// Order validation schemas
const orderSchemas = {
  create: Joi.object({
    items: Joi.array().items(
      Joi.object({
        book: Joi.string().required(), // MongoDB ObjectId
        quantity: Joi.number().integer().min(1).required()
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    }).required(),
    paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'paypal').required()
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled').required()
  })
};

// Validation function
const validate = (data, schema) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    throw new Error(`Validation error: ${errorMessage}`);
  }
  return value;
};

module.exports = {
  bookSchemas,
  authorSchemas,
  orderSchemas,
  validate
};
