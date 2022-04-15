import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SERVER_URL } from "./config";

export function CartProductItem(props) {
  const item = props.item;
  const product = props.product;
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

  const removeItem = () => {
    adjustCart(item, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    adjustCart(item, qty);
  };

  return (<div className="CartProductItem">
    <Row className="m-1 p-2 border-bottom">
      {product && <>
        <Col className="col-lg-auto">
          <Link to={`/ProductDetails/${product._id}`} style={{ color: "#000000", textDecoration: "none"}}>
            <img src={`${SERVER_URL}/img/${product.image}`} height="70" alt={product.name} loading="lazy" />
          </Link>
        </Col>
        <Col>
          <Row><Link to={`/ProductDetails/${product._id}`} style={{ color: "#000000", textDecoration: "none", fontWeight: "bold"}}>{product.name}</Link></Row>
          <Row><span className="mx-1">{product.cardSet}</span></Row>
        </Col>
        <Col className="col-lg-auto"><div className="text-right" style={{width: "4em"}}>{product.stock > 0 && <>{product.price}$</>}</div></Col>
        <Col className="col-lg-auto"><div className="text-right" style={{width: "5em"}}>{product.stock > 0 && <>{parseFloat(product.price).toFixed(2)}$</>}</div></Col>
        <Col className="col-lg-auto">
          {(product.stock > 0)?
          <>
            <Form onSubmit={handleSubmit}>
              <div className="d-flex flex-nowrap">
                <Form.Control type="number" size="sm" style={{width: "50px"}} name="qty" value={qty} onChange={handleChange} />
                <Button type="submit" size="sm" disabled={item.qty === qty}>Adjust</Button>
                <Button variant="secondary" size="sm" onClick={removeItem}>
                  <i className="bi bi-trash3-fill"></i>
                </Button>
              </div>
            </Form> 
          </>
          :<>Out of Stock</>}
        </Col>
      </>}
    </Row>
  </div>);
}
