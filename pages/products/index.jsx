import PaginatedNavigation from "@/components/PaginatedNavigation";
import { ProductCard } from "@/components/Products/ProductCard";
import useAllProducts from "@/services/cache/useAllProducts";
import useProductsBySet from "@/services/cache/useProductsBySet";
import useSetByCode from "@/services/cache/useSetByCode";
import { Cloudinary } from "@cloudinary/url-gen";
import { useRouter } from "next/router";
import { Button, Container, Image, Row, Spinner } from "react-bootstrap";

export default function Products({ ...props }) {
  const router = useRouter();
  const { set, page } = router.query;
  const pageNum = page ? Number(page) : 1;
  const pageSize = set ? 4 : 20;
  const setDetails = useSetByCode(set);
  const productsBySet = useProductsBySet(setDetails.data?.name);
  const allProducts = useAllProducts({pageSize, pageNum});
  const productsData = set ? productsBySet : allProducts

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    }
  });

  return (<div className="products-by-set" {...props}>
    <Container>
      {set && setDetails.data && <>
        <Image src={cld.image(setDetails.data?.hero).toURL()} alt={setDetails.data?.name} className="d-block mw-100" />
        <div className="my-3">
          <Button size="lg" variant="primary" type="button" className="d-block mx-auto" onClick={() => router.push(`/cards?set=${setDetails.data?.code}`)}>Browse {setDetails.data?.name} singles</Button>
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

        {!productsData.isLoading &&
          <PaginatedNavigation totalCount={productsData.data?.count} pageSize={pageSize} />
        }
      </>}
    </Container>
  </div>);
}