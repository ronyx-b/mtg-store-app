import { createSlice } from "@reduxjs/toolkit";

const localStorageIsAvailable = typeof window !== "undefined";

const initialState = {
  value: localStorageIsAvailable ? JSON.parse(localStorage.getItem('cart')) || [] : [],
};

const saveCart = (cart) => {
  if (localStorageIsAvailable) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addOrRemoveToCart: (state, action) => {
      let qty = parseInt(action.payload.qty);
      let item = action.payload.item;
      let cart = [...state.value];
      let index = cart.findIndex((cartItem) => {
        return cartItem.id === item.id && cartItem.type === item.type;
      })
      if (index >= 0) {
        cart[index].qty += qty;
        if (cart[index].qty <= 0) {
          cart.splice(index, 1);
        }
      } else {
        let newItem = {
          id: item.id,
          type: item.type,
          name: item.name,
          qty
        }
        cart.push(newItem);
      }
      state.value = cart;
      saveCart(cart);
    },

    adjustCart: (state, action) => {
      let qty = parseInt(action.payload.qty);
      let item = action.payload.item;
      let cart = [...state.value];
      let index = cart.findIndex((cartItem) => {
        return cartItem.id === item.id && cartItem.type === item.type;
      })
      if (index >= 0) {
        cart[index].qty = qty;
        if (cart[index].qty <= 0) {
          cart.splice(index, 1);
        } else if (cart[index].qty > 20) {
          cart[index].qty = 20;
        }
      } else {
        let newItem = {
          id: item.id,
          type: item.type,
          name: item.name,
          qty: qty
        }
        cart.push(newItem);
      }
      state.value = cart;
      saveCart(cart);
    },

    emptyCart: (state) => {
      if (localStorageIsAvailable) {
        localStorage.removeItem('cart');
      }
      state.value = [];
    }
  }
});

export const { addOrRemoveToCart, adjustCart, emptyCart } = cartSlice.actions;

export const selectCart = (state) => state.cart.value;

export const selectCartQty = (state) => [ ...state?.cart?.value ].reduce((total, item) => total += item.qty, 0);

export default cartSlice.reducer;