import { Col, Image, Row } from "react-bootstrap";
import Link from "next/link";
import AddAdjustCartButtons from "../AddAdjustCartButtons";
import { SERVER_URL } from "@/config";
import { Cloudinary } from "@cloudinary/url-gen";

export default function CartProductItem({item, product}) {

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    }
  });

  return (<div className="CartProductItem">
    <Row className="m-1 p-2 border-bottom">
      {product && <>
        <Col xs={5} md="auto">
          <Link href={`/products/${product._id}`} style={{ color: "#000000", textDecoration: "none"}}>
            <Image src={cld.image(product.image).toURL()} width="100" alt={product.name} loading="lazy" />
          </Link>
        </Col>
        <Col xs={7} md>
          <Row><Link href={`/products/${product._id}`} style={{ color: "#000000", textDecoration: "none", fontWeight: "bold"}}>{product.name}</Link></Row>
          <Row><span className="mx-1">{product.cardSet}</span></Row>
        </Col>
        <Col xs={3} md="auto"><div className="text-right" style={{width: "4em"}}>{product.stock > 0 && <>{product.price}$</>}</div></Col>
        <Col xs={3} md="auto"><div className="text-right" style={{width: "5em"}}>{product.stock > 0 && <>{parseFloat(product.price).toFixed(2)}$</>}</div></Col>
        <Col xs={6} md="auto">
          {(product.stock > 0) ?
            <AddAdjustCartButtons item={item} showRemove={true} />
          :
            <>Out of Stock</>
          }
        </Col>
      </>}
    </Row>
  </div>);
}
