import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './cartSlice';
import tokenReducer from './tokenSlice'

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    cart: cartSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(/* custom middleware */),
  devTools: true,
});
