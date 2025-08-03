import api from './api';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (bookId, quantity = 1) => {
    const response = await api.post('/cart', { bookId, quantity });
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  }
};