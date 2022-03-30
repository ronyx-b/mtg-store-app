import React from "react";
import { Card, Container } from "react-bootstrap";

export function Cart(props) {
  let shoppingCart = props.shoppingCart;

  return (<div className="Cart">
    <Card className="m-4">
      <Card.Header>
        <h1 className="cardHeader">Shopping Cart</h1>
      </Card.Header>
      <Container className="p-3">
      {(shoppingCart.getCart())?
        <>{shoppingCart.getCart().map((card) => <div key={card.id}>x{card.qty} {card.name}</div>)}</>
        :<div className="text-center">Your shopping cart is empty</div>
      }
      </Container>
    </Card>
  </div>);
}