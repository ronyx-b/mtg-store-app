import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AddAdjustCartButtons } from "./AddAdjustCartButtons";
import { SERVER_URL } from "./config";

export function CartProductItem({item, product}) {

  return (<div className="CartProductItem">
    <Row className="m-1 p-2 border-bottom">
      {product && <>
        <Col xs={5} md="auto">
          <Link to={`/ProductDetails/${product._id}`} style={{ color: "#000000", textDecoration: "none"}}>
            <img src={`${SERVER_URL}/img/${product.image}`} height="70" alt={product.name} loading="lazy" />
          </Link>
        </Col>
        <Col xs={7} md>
          <Row><Link to={`/ProductDetails/${product._id}`} style={{ color: "#000000", textDecoration: "none", fontWeight: "bold"}}>{product.name}</Link></Row>
          <Row><span className="mx-1">{product.cardSet}</span></Row>
        </Col>
        <Col xs={3} md="auto"><div className="text-right" style={{width: "4em"}}>{product.stock > 0 && <>{product.price}$</>}</div></Col>
        <Col xs={3} md="auto"><div className="text-right" style={{width: "5em"}}>{product.stock > 0 && <>{parseFloat(product.price).toFixed(2)}$</>}</div></Col>
        <Col xs={6} md="auto">
          {(product.stock > 0)?
          <AddAdjustCartButtons item={item} showRemove={true} />
          :
          <>Out of Stock</>
          }
        </Col>
      </>}
    </Row>
  </div>);
}
