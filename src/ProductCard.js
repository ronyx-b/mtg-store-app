import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "./config";
import { addOrRemoveToCart, adjustCart } from "./features/cart/cartSlice";
import { selectDecodedToken } from "./features/token/tokenSlice";

export function ProductCard({product}) {
  const decodedToken = useSelector(selectDecodedToken);
  const isAdmin = decodedToken?.isAdmin;
  const cartQty = useSelector((state) => state.cart.value.find((item) => item.id === product._id )?.qty || 0);
  const [qty, setQty] = useState(cartQty === 0 ? 1 : cartQty);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    let item = {id: product._id, type: product.prodType, name: product.name};
    if (cartQty === 0) {
      dispatch(addOrRemoveToCart({item, qty}));
    } else {
      dispatch(adjustCart({item, qty}));
      if (qty === 0) {
        setQty(1);
      }
    } 
  };

  return (<>
    <Col className="my-3 position-relative">
      <Card className="m-2 h-100 shadow" style={{ maxWidth: '18rem' }} id={product._id}>
        <Link to={`/ProductDetails/${product._id}`} style={{ color: "#000000", textDecoration: "none"}}>
          <Card.Img variant="top" src={`${SERVER_URL}/img/${product.image}`} loading="lazy" />
        </Link>
        <Card.Body>
          <Card.Title>
            <Link to={`/ProductDetails/${product._id}`} style={{ color: "#000000", textDecoration: "none"}}>{product.name}</Link>
          </Card.Title>
          <Card.Text>
            {product.description}
          </Card.Text>
          {(product.stock > 0)?
          <Row xs={1} sm={2}>
            <Col className="text-right">
              {product.price}$
            </Col>
            <Col md="auto">
              <Form onSubmit={handleSubmit}>
                <div className="d-flex flex-nowrap">
                  <Form.Control type="number" size="sm" style={{width: "50px"}} name="qty" value={qty} onChange={handleChange} />
                  <Button type="submit" size="sm" disabled={qty === cartQty}>{cartQty === 0 ? "Add": "Adjust"}</Button>
                </div>
              </Form>
            </Col>
          </Row>
          :<>Out of Stock</>}
          {isAdmin && 
            <Button size="sm" className="position-absolute" style={{top: "10px", right: "10px"}} onClick={() => {navigate(`/EditProduct/${product._id}`)}}><i className="bi bi-gear"></i> Edit</Button>
          }
        </Card.Body>
      </Card>  
    </Col>
  </>);
}