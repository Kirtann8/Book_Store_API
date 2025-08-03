const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: 'text' // Text index for full-text search
  },
  author: {                   // Reference to Author
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
    index: true // Index for author lookups
  },
  genre: {                    // Reference to Genre
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
    required: true,
    index: true // Index for genre lookups
  },
  price: {
    type: Number,
    required: true,
    index: true // Index for price sorting and filtering
  },
  coverImage: {
    type: String,
    default: 'default-book-cover.jpg'
  },
  description: {
    type: String
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numberOfReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update average rating when a review is added or modified
bookSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numberOfReviews = 0;
  } else {
    this.averageRating = this.reviews.reduce((acc, item) => item.rating + acc, 0) / this.reviews.length;
    this.numberOfReviews = this.reviews.length;
  }
};

// Create compound indexes for common query patterns
bookSchema.index({ genre: 1, price: 1 }); // For filtering books by genre and price
bookSchema.index({ title: 1, author: 1 }); // For searching books by title and author
bookSchema.index({ averageRating: -1, price: 1 }); // For sorting by rating and price

// Create text index for search functionality
bookSchema.index({ 
  title: 'text', 
  description: 'text' 
}, {
  weights: {
    title: 10,
    description: 5
  }
});

module.exports = mongoose.model('Book', bookSchema);
