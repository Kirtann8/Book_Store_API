const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true // Index for searching users by name
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true // Index for quick email lookups during login
  },
  password: { // hashed password
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    index: true // Index for role-based queries
  },
  cart: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
