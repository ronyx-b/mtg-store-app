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
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!cart) {
    cart = [];
  }
  return cart;
};

export function getCartQty() {
  let cart = getCart();
  let qty = cart.reduce((total, item) => total += item.qty, 0)
  return qty;
}

export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  return getCart();
};

export function emptyCart() {
  localStorage.removeItem('cart');
  return [];
};

export function getItem(i) {
  let cart = getCart();
  return cart[i];
}

export function getItemQty(id) {
  let qty = 0;
  let cart = getCart();
  let i = cart.findIndex((item) => item.id === id);
  if (i >= 0) {
    qty = cart[i].qty;
  }
  return qty;
}

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
  return getCart();
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
  saveCart(cart);
  return getCart();
};

const shoppingCart = { getCart, getCartQty, saveCart, emptyCart, getItem, getItemQty, addOrRemoveToCart, adjustCart };

export default shoppingCart;