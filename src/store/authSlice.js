import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  cart: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.cart = []; // Clear cart on logout
    },
    // Cart operations
    addToCart: (state, action) => {
      const itemToAdd = action.payload;
      const existingItem = state.cart.find((item) => item.id === itemToAdd.id);

      if (existingItem) {
        existingItem.quantity += itemToAdd.quantity || 1;
      } else {
        state.cart.push({
          ...itemToAdd,
          quantity: itemToAdd.quantity || 1,
        });
      }
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.cart = state.cart.filter((item) => item.id !== itemId);
    },
    updateCartItemQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.cart.find((item) => item.id === itemId);
      if (item) {
        item.quantity = Math.max(0, quantity);
        // Remove item if quantity is 0
        if (item.quantity === 0) {
          state.cart = state.cart.filter((item) => item.id !== itemId);
        }
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  setCredentials,
  logout,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} = authSlice.actions;

// Selectors
export const selectCart = (state) => state.auth.cart;
export const selectCartItemCount = (state) =>
  state.auth.cart.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.auth.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

export default authSlice.reducer;
