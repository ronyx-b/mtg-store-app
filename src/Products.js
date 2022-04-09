import { useState, useEffect } from "react";
import { Card, CardGroup } from "react-bootstrap";
import { SERVER_URL } from "./config"
// import { useSelector, useDispatch, connect } from "react-redux";
// import { addProducts } from "./productsSlice";

export function Products() {
  // const products = useSelector((state) => state.products.all);
  // const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let requestString = `${SERVER_URL}/api/products`;
    fetch(requestString, { method: 'GET'})
    .then(response => response.json())
    .then(data => { setProducts(data.products) })
    // .then(data => { dispatch(addProducts(data.products)) })
    .catch(err => { console.error(err); });
  }, []);

  return (
    <div className="Products">
      <CardGroup>
      {products && products.map((prod) => 
        <Card style={{ width: '18rem' }} key={prod._id} id={prod._id}>
          <Card.Img variant="top" src={`${SERVER_URL}/img/${prod.image}`} />
          <Card.Body>
            <Card.Title>{prod.name}</Card.Title>
            <Card.Text>
              {prod.description}
            </Card.Text>
          </Card.Body>
        </Card>  
      )}
      </CardGroup>
    </div>
  );
}

// export default connect()(Products);