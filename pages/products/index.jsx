import { ProductCard } from "@/components/Products/ProductCard";
import { SERVER_URL } from "@/config";
import useAllProducts from "@/services/cache/useAllProducts";
import useProductsBySet from "@/services/cache/useProductsBySet";
import useSetByCode from "@/services/cache/useSetByCode";
import { Cloudinary } from "@cloudinary/url-gen";
import { useRouter } from "next/router";
import { Button, Container, Image, Row, Spinner } from "react-bootstrap";

export default function Products({ ...props }) {
  const router = useRouter();
  const { set, pageSize = 12, pageNum = 1 } = router.query;
  const setData = useSetByCode(set);
  const productsBySet = useProductsBySet(setData.data?.set?.name);
  const allProducts = useAllProducts({pageSize, pageNum});
  const productsData = set ? productsBySet : allProducts

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    }
  });

  return (<div className="products-by-set" {...props}>
    <Container>
      {set && setData.data && <>
        <Image src={cld.image(setData.data?.set.hero).toURL()} alt={setData.data?.set.name} className="d-block mw-100" />
        <div className="my-3">
          <Button size="lg" variant="primary" type="button" className="d-block mx-auto" onClick={() => router.push(`/cards?set=${setData.data?.set.code}`)}>Browse {setData.data?.set.name} singles</Button>
        </div>
      </>}
      {productsData.isLoading ? <>
        <Spinner animation="border" role="status" style={{ display: "block", margin: "5rem auto" }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </> : <>
        <Row xs={1} md={2} lg={3} xl={4}>
          {productsData.data?.productList?.map((product) => 
            <ProductCard key={product._id} product={product} />
          )}
        </Row>
      </>}
    </Container>
  </div>);
}