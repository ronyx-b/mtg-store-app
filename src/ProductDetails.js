import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import shoppingCart from "./shoppingCart";
import { SERVER_URL } from "./config";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

export function ProductDetails(props) {
  const setCart = props.setCart;
  const setCartQty = props.setCartQty;
  let params = useParams();
  let id = params?.id || null;
  const [product, setProduct] = useState();
  const [qty, setQty] = useState(shoppingCart.getItemQty(id));

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
    setCart(shoppingCart.addOrRemoveToCart({id: product._id, type: product.prodType, name: product.name}, qty));
    setCartQty(shoppingCart.getCartQty());
    setQty(1);
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
  }, [id]);

  return (<div className="ProductDetails">
    <Container>
      {product && <div className="m-3">
        <Row sm={1} md={2}>
          <Col md="auto" xs={{ order: 'last' }}>
            <img src={`${SERVER_URL}/img/${product.image}`} style={{maxWidth: "250px"}} alt={product.name} />
          </Col>
          <Col>
            <Row><h3>{product.name}</h3></Row>
            <Row><h4>{product.cardSet}</h4></Row>
            <Row>{product.description}</Row>
            <Row>
            {(product.stock > 0)?
              <>
                <Col md="auto">
                  {product.price}$
                </Col>
                <Col>
                  <Form onSubmit={handleSubmit}>
                    <div className="d-flex flex-nowrap">
                      <Form.Control type="number" size="sm" style={{width: "50px"}} name="qty" value={qty} onChange={handleChange} />
                      <Button type="submit" size="sm">Add</Button>
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