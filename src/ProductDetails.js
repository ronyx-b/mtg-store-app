import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "./config";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addOrRemoveToCart, adjustCart } from "./features/cart/cartSlice";

export function ProductDetails() {
  let params = useParams();
  let id = params?.id || null;
  const [product, setProduct] = useState();
  const cartQty = useSelector((state) => state.cart.value.find((item) => item.id === id )?.qty || 0);
  const [qty, setQty] = useState(cartQty === 0 ? 1 : cartQty);
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
    let item = {id, type: product.prodType, name: product.name};
    if (cartQty === 0) {
      dispatch(addOrRemoveToCart({item, qty}));
    } else {
      dispatch(adjustCart({item, qty}));
      if (qty === 0) {
        setQty(1);
      }
    } 
  };

  useEffect(() => {
    const getProductData = async (id) => {
      let requestString = `${SERVER_URL}/api/products/${id}`;
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      setProduct(data.product);
      return data;
    }

    try {
      getProductData(id);
    } catch (err) {
      console.log(err);
    }
    console.log(cartQty);
  }, [id, cartQty]);

  return (<div className="ProductDetails">
    <Container>
      {product && <div className="m-3">
        <Row>
          <Col xs={{span: 12, order: "last"}} sm={{span: "auto", order: "first"}}>
            <img src={`${SERVER_URL}/img/${product.image}`} style={{maxWidth: "250px"}} alt={product.name} />
          </Col>
          <Col>
            <Row><h3>{product.name}</h3></Row>
            <Row><h4>{product.cardSet}</h4></Row>
            <Row>{product.description}</Row>
            <Row className="mb-3">
            {(product.stock > 0)?
              <>
                <Col xs className="text-right fw-bold">
                  {product.price}$
                </Col>
                <Col xs="auto">
                  <Form onSubmit={handleSubmit}>
                    <div className="d-flex flex-nowrap">
                      <Form.Control type="number" size="sm" style={{width: "50px"}} name="qty" value={qty} onChange={handleChange} />
                      <Button type="submit" size="sm" disabled={qty === cartQty}>{cartQty === 0 ? "Add": "Adjust"}</Button>
                    </div>
                  </Form>
                </Col>
              </>
              :<>Out of Stock</>}
            </Row>
          </Col>
        </Row>
      </div>}
    </Container>
  </div>);
}