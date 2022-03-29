import { createSlice } from "@reduxjs/toolkit";

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    all: [],
  },
  reducers: {
    addProducts: (state, action) => {
      action.payload.forEach((product) => {state.all.push(product)});
    },
  }
});

export const { addProducts } = productsSlice.actions;

export default productsSlice.reducer;