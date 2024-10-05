import useProductsBySet from "@/services/cache/useProductsBySet";
import { Container, Row } from "react-bootstrap";
import { ProductCard } from "../ProductCard";

export default function ProductsList({ set, ...props }) {
  const products = useProductsBySet(set.name);

  return (<>
    <h2>{set.name}</h2>
      <Container>
        <Row xs={1} md={2} lg={3} xl={4}>
          {products.data && products.data.productList.map((product) => 
            <ProductCard key={product._id} product={product} />
          )}
        </Row>
      </Container>
  </>);
}