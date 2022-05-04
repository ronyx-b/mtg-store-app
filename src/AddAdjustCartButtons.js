import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addOrRemoveToCart, adjustCart } from "./features/cart/cartSlice";

export function AddAdjustCartButtons({item, showRemove}) {
  const cartItemQty = useSelector((state) => state.cart.value.find((cartItem) => cartItem.id === item.id )?.qty || 0);
  const [qty, setQty] = useState(cartItemQty === 0 ? 1 : cartItemQty);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    let value = parseInt(e.target.value)
    if (isNaN(value) || value < 0) {
      setQty(0);
    } else if (value > 20) {
      setQty(20);
    } else {
      setQty(value);
    }
  };

  const removeItem = () => {
    dispatch(adjustCart({item, qty: 0}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItemQty === 0) {
      dispatch(addOrRemoveToCart({item, qty}));
    } else {
      dispatch(adjustCart({item, qty}));
      if (qty === 0) {
        setQty(1);
      }
    } 
  };

  return (<div className="AddAdjustCartButtons">
    <Form onSubmit={handleSubmit}>
      <div className="d-flex flex-nowrap">
        <Form.Control type="number" size="sm" style={{width: "50px"}} name="qty" value={qty} onChange={handleChange} />
        <Button type="submit" size="sm" disabled={qty === cartItemQty}>{cartItemQty === 0 ? "Add": "Adjust"}</Button>
        {showRemove && 
        <Button variant="secondary" size="sm" onClick={removeItem}>
          <i className="bi bi-trash3-fill"></i>
        </Button>
        }
      </div>
    </Form>
  </div>);
}