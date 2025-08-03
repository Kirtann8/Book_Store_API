import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

const CartPage = () => {
  const { items, total, loading, updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any books to your cart yet.
          </p>
          <Link to="/books" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={item.book?.coverImage || '/api/placeholder/100/150'}
                  alt={item.book?.title}
                  className="w-20 h-28 object-cover rounded"
                />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.book?.title}
                  </h3>
                  <p className="text-gray-600">by {item.book?.author?.name}</p>
                  <p className="text-lg font-bold text-primary-600 mt-2">
                    ${item.price}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <MinusIcon className="w-5 h-5" />
                  </button>
                  
                  <span className="text-lg font-semibold w-8 text-center">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-600 hover:text-red-800 mt-2"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/books"
              className="w-full text-center text-primary-600 hover:text-primary-700 mt-4 block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;