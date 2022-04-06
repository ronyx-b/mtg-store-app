import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export function CartItem(props) {
  const item = props.item;
  const card = props.card;
  const adjustCart = props.adjustCart;
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
    adjustCart(item, qty);
  };

  return (<div className="CartItem">
    <Row className="m-1 p-2 border-bottom">
      {card && <>
        <Col className="col-lg-auto">{card.image_uris?(<img src={card.image_uris.normal} height="70" alt={card.name} />):(<img src={card.card_faces[0].image_uris.normal} height="70" alt={card.name} />)}</Col>
        <Col>{card.name}</Col>
        <Col className="col-lg-auto"><div className="text-right" style={{width: "4em"}}>{card.prices.usd && <>{card.prices.usd}$</>}</div></Col>
        <Col className="col-lg-auto"><div className="text-right" style={{width: "5em"}}>{card.prices.usd && <>{(parseFloat(card.prices.usd) * item.qty).toFixed(2)}$</>}</div></Col>
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
