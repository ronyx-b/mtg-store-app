import React, { useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { CartItem } from "./CartItem";
import shoppingCart from "./shoppingCart";

export function Cart(props) {
  const [cart, setCart] = useState(shoppingCart.getCart());

  const emptyCart = () => {
    setCart(shoppingCart.emptyCart());
  };

  const adjustCart = (item, qty) => {
    setCart(shoppingCart.adjustCart(item, qty));
  };

  return (<div className="Cart">
    <Card className="m-4">
      <Card.Header>
        <h1 className="cardHeader">Shopping Cart</h1>
      </Card.Header>
      <Container className="p-3">
      {(cart && cart.length > 0)?
        <>
        {shoppingCart.getCart().map((item, i) => 
          <CartItem key={i} item={item} index={i} adjustCart={adjustCart} />
        )}
        <Button className="d-block mx-auto" onClick={emptyCart}>Empty Your Cart</Button>
        </>
        :<div className="text-center">Your shopping cart is empty</div>
      }
      </Container>
    </Card>
  </div>);
}
