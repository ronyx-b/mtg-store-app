import { useState, useEffect } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_URL } from "./config"
import { ProductCard } from "./ProductCard";
// import { useSelector, useDispatch, connect } from "react-redux";
// import { addProducts } from "./productsSlice";

export function Products({decodedToken, setCart, setCartQty}) {
  // const products = useSelector((state) => state.products.all);
  // const dispatch = useDispatch();
  const isAdmin = decodedToken?.isAdmin;
  let params = useParams();
  let set = params?.set || null;
  const [cardSet, setCardSet] = useState(); 
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      let requestString = `${SERVER_URL}/api/products`;
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      let products = data.products;
      if (set) {
        products = products.filter((product) => product.cardSet === set);
      }
      setProducts(products);
    };

    const getSet = async () => {
      let requestString = `${SERVER_URL}/api/sets/${set}`;
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      setCardSet(data.set);
    }

    try {
      getProducts();
      if (set) {
        getSet();
      }
    } catch (err) {
      console.error(err);
    }
  }, [set]);

  return (
    <div className="Products">
      <Container>
        {set && cardSet && <>
        <img src={`${SERVER_URL}/img/hero/${cardSet.hero}`} alt={cardSet.name} className="d-block mw-100" />
        <div className="my-3">
          <Button size="lg" variant="primary" type="button" className="d-block mx-auto" onClick={() => navigate(`/CardSearch?set=${cardSet.code}`)}>Brose {cardSet.name} singles</Button>
        </div>
        </>}
        <Row xs={1} md={2} lg={3} xl={4}>
          {products && products.map((product) => 
            <ProductCard key={product._id} product={product} isAdmin={isAdmin} setCart={setCart} setCartQty={setCartQty} />
          )}
        </Row>
      </Container>
    </div>
  );
}

// export default connect()(Products);