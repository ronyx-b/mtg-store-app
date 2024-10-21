import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';

const localStorageIsAvailable = typeof window !== "undefined";

const getDecodedToken = () => {
  let decodedToken = null;
  try {
    if (localStorageIsAvailable) {
      decodedToken = jwtDecode(localStorage.getItem("access_token"));
    }
  }
  catch (err) {
    console.log(`couldn't decode local token: ${err}`)
  }
  return decodedToken;
};

const initialState = {
  value: localStorageIsAvailable ? localStorage.getItem("access_token") : "",
  decodedToken: getDecodedToken(),
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      if (localStorageIsAvailable) {
        try {
          localStorage.setItem("access_token", action.payload);
          state.decodedToken = jwtDecode(action.payload);
        }
        catch (err) {
          console.log(`Error setting token state: ${err}`);
        }
      }
      state.value = action.payload;
    },

    removeToken: (state) => {
      if (localStorageIsAvailable) {
        try {
          localStorage.removeItem("access_token");
        }
        catch (err) {
          console.log(`Error removing token local data: ${err}`);
        }
      }
      state.value = null;
      state.decodedToken = null;
    }
  }
});

export const { setToken, removeToken } = tokenSlice.actions;

export const selectToken = (state) => state.token.value;

export const selectDecodedToken = (state) => state.token.decodedToken;

export default tokenSlice.reducer;