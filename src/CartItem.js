import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import shoppingCart from "./shoppingCart";

export function CartItem(props) {
  const item = props.item; // shoppingCart.getItem(props.index);
  const [card, setCard] = useState();
  const [qty, setQty] = useState(item.qty);

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
    shoppingCart.adjustCart(item, qty);
  };

  useEffect(() => {
    let requestString = `https://api.scryfall.com/cards/${item.id}`;
    fetch(requestString, { method: 'GET'})
    .then(response => response.json())
    .then(data => { 
      setCard(data)
    })
    .catch(err => { console.error(err); });
  }, [item.id]);

  return (<div className="CartItem">
    <Row className="m-1 p-2 border-bottom">
      {item.type === "single" && card && <>
        <Col className="col-lg-auto">{card.image_uris?(<img src={card.image_uris.normal} width="50" alt={card.name} />):(<img src={card.card_faces[0].image_uris.normal} width="50" alt={card.name} />)}</Col>
        <Col>{card.name}</Col>
        <Col className="col-lg-auto">{card.prices.usd && <>{card.prices.usd}$</>}</Col>
        <Col className="col-lg-auto">{card.prices.usd && <>{card.prices.usd * item.qty}$</>}</Col>
        <Col className="col-lg-auto">
          {(card.prices.usd)?
          <>
            <Form onSubmit={handleSubmit}>
              <div className="d-flex flex-nowrap">
                <Form.Control type="number" size="sm" style={{width: "50px"}} name="qty" value={qty} onChange={handleChange} />
                <Button type="submit" size="sm" disabled={item.qty === qty}>Adjust</Button>
              </div>
            </Form> 
          </>
          :<>Out of Stock</>}
        </Col>
      </>}
    </Row>
  </div>);
}