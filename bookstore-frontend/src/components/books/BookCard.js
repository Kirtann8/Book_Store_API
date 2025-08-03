import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      addToCart(book._id, 1);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <Link to={`/books/${book._id}`}>
        <div className="aspect-w-3 aspect-h-4 bg-gray-200">
          <img
            src={book.coverImage || '/api/placeholder/300/400'}
            alt={book.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/books/${book._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary-600 line-clamp-2">
            {book.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-2">
          by {book.author?.name || 'Unknown Author'}
        </p>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {renderStars(book.averageRating || 0)}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            ({book.reviewCount || 0})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-primary-600">
            ${book.price}
          </div>
          
          {isAuthenticated && (
            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-1 bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
        
        {book.stock <= 5 && book.stock > 0 && (
          <p className="text-sm text-orange-600 mt-2">
            Only {book.stock} left in stock!
          </p>
        )}
        
        {book.stock === 0 && (
          <p className="text-sm text-red-600 mt-2">
            Out of stock
          </p>
        )}
      </div>
    </div>
  );
};

export default BookCard;