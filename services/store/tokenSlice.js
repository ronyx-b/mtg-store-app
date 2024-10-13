import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';

const localStorageIsAvailable = typeof window !== "undefined";

const initialState = {
  value: localStorageIsAvailable ? localStorage.getItem("access_token") : "",
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      if (localStorageIsAvailable) localStorage.setItem("access_token", action.payload);
      state.value = action.payload;
    },

    removeToken: (state) => {
      if (localStorageIsAvailable) localStorage.removeItem("access_token");
      state.value = null;
    }
  }
});

export const { setToken, removeToken } = tokenSlice.actions;

export const selectToken = (state) => state.token.value;

export const selectDecodedToken = (state) => {
  let decodedToken = null;
  if (state.token.value) {
    try {
      decodedToken = jwtDecode(state.token.value)
    } catch (err) {
      console.log(`error decoding access token: ${err}`);
    }
  }
  return decodedToken;
};

export default tokenSlice.reducer;