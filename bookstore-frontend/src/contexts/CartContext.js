import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        loading: false,
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + (action.payload.price * action.payload.quantity),
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload._id ? action.payload : item
        ),
        total: state.items.reduce((sum, item) => 
          sum + (item._id === action.payload._id ? 
            action.payload.price * action.payload.quantity : 
            item.price * item.quantity), 0
        ),
      };
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item._id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  total: 0,
  loading: false,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartService.getCart();
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (bookId, quantity = 1) => {
    try {
      const response = await cartService.addToCart(bookId, quantity);
      dispatch({ type: 'ADD_ITEM', payload: response.data });
      toast.success('Item added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      dispatch({ type: 'UPDATE_ITEM', payload: response.data });
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
      toast.success('Item removed from cart!');
    } catch (error) {
      console.error('Remove item error:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  const value = {
    ...state,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};