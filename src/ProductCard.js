import { useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "./config";
import shoppingCart from "./shoppingCart";

export function ProductCard({product, isAdmin, setCart, setCartQty}) {
  const navigate = useNavigate();
  const [qty, setQty] = useState(shoppingCart.getItemQty(product._id));

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
          <Form onSubmit={handleSubmit}>
            <div className="d-flex flex-nowrap">
              <Form.Control type="number" size="sm" style={{width: "50px"}} name="qty" value={qty} onChange={handleChange} />
              <Button type="submit" size="sm">Add</Button>
            </div>
          </Form>
          {isAdmin && 
            <Button size="sm" className="position-absolute" style={{top: "10px", right: "10px"}} onClick={() => {navigate(`/EditProduct/${product._id}`)}}><i className="bi bi-gear"></i> Edit</Button>
          }
        </Card.Body>
      </Card>  
    </Col>
  </>);
}