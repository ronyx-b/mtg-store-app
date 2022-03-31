import React, { useState } from "react";
import { Button, Card, Container } from "react-bootstrap";

export function Cart(props) {
  const shoppingCart = props.shoppingCart;
  const [cart, setCart] = useState(shoppingCart.getCart())

  const emptyCart = () => {
    setCart(shoppingCart.emptyCart());
  };

  return (<div className="Cart">
    <Card className="m-4">
      <Card.Header>
        <h1 className="cardHeader">Shopping Cart</h1>
      </Card.Header>
      <Container className="p-3">
      {(cart && cart.length > 0)?
        <>
        {shoppingCart.getCart().map((card) => <div key={card.id}>x{card.qty} {card.name}</div>)}
        <Button className="d-block mx-auto" onClick={emptyCart}>Empty Your Cart</Button>
        </>
        :<div className="text-center">Your shopping cart is empty</div>
      }
      </Container>
    </Card>
  </div>);
}