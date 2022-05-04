import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addOrRemoveToCart } from "./features/cart/cartSlice";

export function CardSearchRow({card}) {
  const item = {id: card.id, type: "single", name: card.name}
  const [qty, setQty] = useState(1);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addOrRemoveToCart({item, qty}))
    setQty(1);
  };

  return (<div className="CardSearRow">
    <Row className="m-1 p-2 border-bottom">
      <Col xs={5} sm="auto">
        <Link to={`/CardDetails/${card.id}`} style={{ color: "#000000", textDecoration: "none"}}>
          <img src={card.image_uris?(card.image_uris.normal):(card.card_faces[0].image_uris.normal)} height="150" alt={card.name} loading="lazy" />
        </Link>
      </Col>
      <Col xs={7} sm>
        <Row><Link to={`/CardDetails/${card.id}`} style={{ color: "#000000", textDecoration: "none", fontWeight: "bold"}}>{card.name}</Link></Row>
        <Row><span className="mx-1">{card.set_name}</span></Row>
      </Col>
      <Col xs={5} sm="auto" className="fw-bold">{card.prices.usd && <>{card.prices.usd}$</>}</Col>
      <Col xs={7} sm="auto">
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