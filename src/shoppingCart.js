/*
let cart = [
  {
    id: Number,
    type: String,
    name: String,
    qty: Number
  }
];
*/

export function getCart() {
  return JSON.parse(localStorage.getItem('cart'));
};

export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export function emptyCart() {
  localStorage.removeItem('cart');
};

export function addOrRemoveToCart(item, qty) {
  qty = parseInt(qty);
  let cart = getCart();
  if (!cart) {
    cart = [];
  }
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
      qty: qty
    }
    cart.push(newItem);
  }
  saveCart(cart);
};

export function adjustCart(item, qty) {
  qty = parseInt(qty);
  let cart = getCart();
  let index = cart.findIndex((cartItem) => {
    return cartItem.id === item.id && cartItem.type === item.type;
  })
  if (index >= 0) {
    cart[index].qty = qty;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
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
  saveCart(cart);
};

const shoppingCart = { getCart, saveCart, emptyCart, addOrRemoveToCart, adjustCart };

export default shoppingCart;