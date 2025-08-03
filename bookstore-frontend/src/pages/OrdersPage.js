import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <p className="text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4">
                    <img
                      src={item.book?.coverImage || '/api/placeholder/60/80'}
                      alt={item.book?.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.book?.title}</h4>
                      <p className="text-gray-600">by {item.book?.author?.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} × ${item.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-900">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {order.shippingAddress && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <p className="text-gray-600 text-sm">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;