import { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SERVER_URL } from "./config"
// import { useSelector, useDispatch, connect } from "react-redux";
// import { addProducts } from "./productsSlice";

export function Products({decodedToken}) {
  // const products = useSelector((state) => state.products.all);
  // const dispatch = useDispatch();
  const isAdmin = decodedToken?.isAdmin;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      let requestString = `${SERVER_URL}/api/products`;
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      setProducts(data.products);
    };

    try {
      getProducts();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="Products">
      <Container>
        <Row xs={1} md={2} lg={3} xl={4}>
          {products && products.map((prod) => 
            <Col key={prod._id} className="my-3">
              <Card className="m-2 h-100 shadow" style={{ maxWidth: '18rem' }} id={prod._id}>
                <Link to={`/ProductDetails/${prod._id}`} style={{ color: "#000000", textDecoration: "none"}}>
                  <Card.Img variant="top" src={`${SERVER_URL}/img/${prod.image}`} loading="lazy" />
                </Link>
                <Card.Body>
                  <Card.Title>
                    <Link to={`/ProductDetails/${prod._id}`} style={{ color: "#000000", textDecoration: "none"}}>{prod.name}</Link>
                    {isAdmin && <Link to={`/EditProduct/${prod._id}`} className="h6">Edit</Link>}</Card.Title>
                  <Card.Text>
                    {prod.description}
                  </Card.Text>
                </Card.Body>
              </Card>  
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

// export default connect()(Products);