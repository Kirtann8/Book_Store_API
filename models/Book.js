const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {                   // Reference to Author
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  genre: {                    // Reference to Genre
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('Book', bookSchema);
