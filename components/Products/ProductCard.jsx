import { Button, Card, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { selectDecodedToken } from "@/services/store/tokenSlice";
import AddAdjustCartButtons from "../AddAdjustCartButtons";
import { Cloudinary } from "@cloudinary/url-gen";

export function ProductCard({product}) {
  const decodedToken = useSelector(selectDecodedToken);
  const isAdmin = decodedToken?.isAdmin;
  const item = {id: product._id, type: product.prodType, name: product.name};
  const router = useRouter();

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    }
  });

  return (<>
    <Col className="my-3 position-relative">
      <Card className="m-2 h-100 shadow" style={{ maxWidth: '18rem' }} id={product._id}>
        <Link href={`/products/${product._id}`} style={{ color: "#000000", textDecoration: "none"}}>
          {/* <Card.Img variant="top" src={`${SERVER_URL}/img/${product.image}`} loading="lazy" /> */}
          <Card.Img variant="top" src={cld.image(product.image).toURL()} loading="lazy" />
        </Link>
        <Card.Body>
          <Card.Title>
            <Link href={`/products/${product._id}`} style={{ color: "#000000", textDecoration: "none"}}>{product.name}</Link>
          </Card.Title>
          {/* <Card.Text>
            {product.description}
          </Card.Text> */}
          {(product.stock > 0)?
          <Row xs={1} sm={2}>
            <Col className="text-right">
              {product.price}$
            </Col>
            <Col md="auto">
              <AddAdjustCartButtons item={item} />
            </Col>
          </Row>
          :<>Out of Stock</>}
          {isAdmin && 
            <Button size="sm" className="position-absolute" style={{top: "10px", right: "10px"}} onClick={() => {router.push(`/products/${product._id}/edit`)}}><i className="bi bi-gear"></i> Edit</Button>
          }
        </Card.Body>
      </Card>  
    </Col>
  </>);
}