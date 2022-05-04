import { configureStore } from '@reduxjs/toolkit';
import cartSlice from '../features/cart/cartSlice';
import tokenReducer from '../features/token/tokenSlice'

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    cart: cartSlice,
  },
});
