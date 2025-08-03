import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookById(id);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (isAuthenticated && book) {
      addToCart(book._id, quantity);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < Math.floor(rating) ? (
          <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
        ) : (
          <StarOutlineIcon key={i} className="w-5 h-5 text-gray-300" />
        )
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h2>
          <p className="text-gray-600">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Book Image */}
        <div className="flex justify-center">
          <img
            src={book.coverImage || '/api/placeholder/400/600'}
            alt={book.title}
            className="w-full max-w-md h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Book Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600">by {book.author?.name}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {renderStars(book.averageRating || 0)}
            </div>
            <span className="text-gray-600">
              ({book.reviewCount || 0} reviews)
            </span>
          </div>

          <div className="text-3xl font-bold text-primary-600">
            ${book.price}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {book.description || 'No description available.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Genre:</span> {book.genre?.name}
            </div>
            <div>
              <span className="font-semibold">Stock:</span> {book.stock} available
            </div>
            <div>
              <span className="font-semibold">ISBN:</span> {book.isbn || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Pages:</span> {book.pages || 'N/A'}
            </div>
          </div>

          {isAuthenticated && book.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-semibold">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  {[...Array(Math.min(book.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          )}

          {book.stock === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold">Out of Stock</p>
              <p className="text-red-600 text-sm">This book is currently unavailable.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;