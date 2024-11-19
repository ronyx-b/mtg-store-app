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

const localStorageIsAvailable = typeof window !== "undefined";

const getDecodedToken = () => {
  /** @type {(DecodedToken | null)} */
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