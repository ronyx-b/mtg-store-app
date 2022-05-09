import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_URL } from "./config";
import { Col, Container, Row } from "react-bootstrap";
import { AddAdjustCartButtons } from "./AddAdjustCartButtons";

export function ProductDetails() {
  let params = useParams();
  let id = params?.id || null;
  const [product, setProduct] = useState();
  const [item, setItem] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getProductData = async (id) => {
      let requestString = `${SERVER_URL}/api/products/${id}`;
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      setProduct(data.product);
      return data.product;
    }

    try {
      getProductData(id).then((prod) => {
        setItem({id: prod._id, type: prod.prodType, name: prod.name});
      });
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  return (<div className="ProductDetails">
    <Container>
      {product && <div className="m-3">
        <Row>
          <Col xs={{span: 12, order: "last"}} sm={{span: 3, order: "first"}}>
            <img src={`${SERVER_URL}/img/${product.image}`} className="w-100" alt={product.name} />
          </Col>
          <Col>
            <Row><h3>{product.name}</h3></Row>
            <Row><h4>{product.cardSet}</h4></Row>
            {/* <Row><h4 onClick={() => navigate(`/CardSearch?set=${product.cardSetCode}`)}>{product.cardSet}</h4></Row> */}
            <Row>{product.description}</Row>
            <Row className="mb-3">
            {(product.stock > 0)?
              <>
                <Col xs className="text-right fw-bold">
                  {product.price}$ ({product.stock} in stock) 
                </Col>
                <Col xs="auto">
                  <AddAdjustCartButtons item={item} />
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