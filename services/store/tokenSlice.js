import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';

/**
 * @typedef {Object} DecodedToken
 * @property {string} _id
 * @property {string} email
 * @property {boolean} [isAdmin]
 * @property {number} iat
 * @property {number} [exp]
 */

const initialState = {
  value: "",
  decodedToken: null,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    hydrateToken: (state) => {
      if (typeof window !== "undefined") {
        try {
          const token = localStorage.getItem("access_token");
          state.value = token || "";
          state.decodedToken = token ? jwtDecode(token) : null;
        }
        catch (err) {
          state.value = "";
          state.decodedToken = null;
        }
      }
    },

    setToken: (state, action) => {
      if (typeof window !== "undefined") {
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
      if (typeof window !== "undefined") {
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

export const { setToken, removeToken, hydrateToken } = tokenSlice.actions;

/**
 * Selects the user's token
 * @param {Object} state
 * @param {Object} state.token
 * @param {string} state.token.value
 * @returns {string}
 */
export const selectToken = (state) => state.token.value;

/**
 * Selects the user's decoded token
 * @param {Object} state
 * @param {Object} state.token
 * @param {DecodedToken} state.token.decodedToken
 * @returns {DecodedToken}
 */
export const selectDecodedToken = (state) => state.token.decodedToken;

export default tokenSlice.reducer;