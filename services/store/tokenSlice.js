import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from 'jwt-decode';

const initialState = {
  // value: localStorage.getItem('token'),
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken: (state, action) => {
      // localStorage.setItem('token', action.payload);
      state.value = action.payload;
    },

    removeToken: (state) => {
      // localStorage.removeItem('token');
      state.value = null;
    }
  }
});

export const { setToken, removeToken } = tokenSlice.actions;

export const selectToken = (state) => state.token.value;

export const selectDecodedToken = (state) => state.token.value ? jwt_decode(state.token.value) : null;

export default tokenSlice.reducer;