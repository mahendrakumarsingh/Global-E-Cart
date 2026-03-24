import React, { createContext, useEffect, useReducer } from 'react';
import api from '../utils/api';

const CartContext = createContext();

const initialState = {
  cartItems: JSON.parse(localStorage.getItem('cart')) || []
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const item = action.payload;
      const exist = state.cartItems.find(i => i.product === item.product);
      let cartItems;
      if (exist) {
        cartItems = state.cartItems.map(i => i.product === exist.product ? item : i);
      } else {
        cartItems = [...state.cartItems, item];
      }
      localStorage.setItem('cart', JSON.stringify(cartItems));
      return { ...state, cartItems };
    }
    case 'REMOVE_ITEM': {
      const cartItems = state.cartItems.filter(i => i.product !== action.payload);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      return { ...state, cartItems };
    }
    case 'UPDATE_QTY': {
      const cartItems = state.cartItems.map(i => i.product === action.payload.product ? { ...i, qty: action.payload.qty } : i);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      return { ...state, cartItems };
    }
    case 'CLEAR_CART': {
      localStorage.removeItem('cart');
      return { ...state, cartItems: [] };
    }
    case 'SET_CART': {
      localStorage.setItem('cart', JSON.stringify(action.payload));
      return { ...state, cartItems: action.payload };
    }
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // sync cart with backend if logged in
    const syncIfNeeded = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await api.post('/cart/sync', { cart: state.cartItems });
        } catch (err) {
          console.error('Cart sync failed', err);
        }
      }
    };
    syncIfNeeded();
  }, [state.cartItems]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
