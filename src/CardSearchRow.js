import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import shoppingCart from "./shoppingCart";

export function CardSearchRow(props) {
  const card = props.card;
  const setCart = props.setCart;
  const setCartQty = props.setCartQty;
  const [qty, setQty] = useState(1);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setCart(shoppingCart.addOrRemoveToCart({id: card.id, type: "single", name: card.name}, qty));
    setCartQty(shoppingCart.getCartQty());
    setQty(1);
  };

  return (<div className="CardSearRow">
    <Row className="m-1 p-2 border-bottom">
      <Col className="col-lg-auto">{card.image_uris?(<img src={card.image_uris.normal} height="150" alt={card.name} />):(<img src={card.card_faces[0].image_uris.normal} width="100" alt={card.name} />)}</Col>
      <Col>{card.name}</Col>
      <Col className="col-lg-auto">{card.prices.usd && <>{card.prices.usd}$</>}</Col>
      <Col className="col-lg-auto">
        {(card.prices.usd)?
        <>
          <Form onSubmit={handleSubmit}>
            <div className="d-flex flex-nowrap">
              <Form.Control type="number" size="sm" style={{width: "50px"}} name="qty" value={qty} onChange={handleChange} />
              <Button type="submit" size="sm">Add</Button>
            </div>
          </Form> 
        </>
        :<>Out of Stock</>}
      </Col>
    </Row>
  </div>);
}