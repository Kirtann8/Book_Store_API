import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/orderService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const schema = yup.object({
  shippingAddress: yup.object({
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('ZIP code is required'),
    country: yup.string().required('Country is required'),
  }),
  paymentMethod: yup.string().required('Payment method is required'),
});

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      paymentMethod: 'credit_card',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const orderData = {
        items: items.map(item => ({
          book: item.book._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        totalAmount: total,
      };

      await orderService.createOrder(orderData);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    {...register('shippingAddress.street')}
                    className="input-field"
                    placeholder="123 Main St"
                  />
                  {errors.shippingAddress?.street && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.shippingAddress.street.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      {...register('shippingAddress.city')}
                      className="input-field"
                      placeholder="New York"
                    />
                    {errors.shippingAddress?.city && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.shippingAddress.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      {...register('shippingAddress.state')}
                      className="input-field"
                      placeholder="NY"
                    />
                    {errors.shippingAddress?.state && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.shippingAddress.state.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      {...register('shippingAddress.zipCode')}
                      className="input-field"
                      placeholder="10001"
                    />
                    {errors.shippingAddress?.zipCode && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.shippingAddress.zipCode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      {...register('shippingAddress.country')}
                      className="input-field"
                      placeholder="United States"
                    />
                    {errors.shippingAddress?.country && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.shippingAddress.country.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="credit_card"
                    className="mr-3"
                  />
                  <span>Credit Card</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="paypal"
                    className="mr-3"
                  />
                  <span>PayPal</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="cash_on_delivery"
                    className="mr-3"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
              
              {errors.paymentMethod && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3">
                    <img
                      src={item.book?.coverImage || '/api/placeholder/60/80'}
                      alt={item.book?.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.book?.title}</h4>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors mt-6 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;