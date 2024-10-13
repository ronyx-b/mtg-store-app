import AddAdjustCartButtons from "@/components/AddAdjustCartButtons";
import { SERVER_URL } from "@/config";
import useProductDetails from "@/services/cache/useProductDetails";
import { useRouter } from "next/router";
import { Col, Container, Image, Row } from "react-bootstrap";

export default function ProductById({ ...props }) {
  const router = useRouter();
  const { id } = router.query;
  const product = useProductDetails(id);
  const item = {
    id: product?.data?.productDetails?._id, 
    type: product?.data?.productDetails?.prodType, 
    name: product?.data?.productDetails?.name
  };

  return (<div className="ProductDetails">
    <Container>
      {product?.data && <div className="m-3">
        <Row>
          <Col xs={{span: 12, order: "last"}} sm={{span: 3, order: "first"}}>
            <Image src={`${SERVER_URL}/img/${product?.data?.productDetails?.image}`} className="w-100" alt={product?.data?.productDetails?.name} />
          </Col>
          <Col>
            <Row><h3>{product?.data?.productDetails?.name}</h3></Row>
            <Row><h4>{product?.data?.productDetails?.cardSet}</h4></Row>
            {/* <Row><h4 onClick={() => navigate(`/CardSearch?set=${product?.data?.productDetails?.cardSetCode}`)}>{product?.data?.productDetails?.cardSet}</h4></Row> */}
            <Row>{product?.data?.productDetails?.description}</Row>
            <Row className="mb-3">
            {(product?.data?.productDetails?.stock > 0)?
              <>
                <Col xs className="text-right fw-bold">
                  {product?.data?.productDetails?.price}$ ({product?.data?.productDetails?.stock} in stock) 
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