import { Carousel, Container, Image } from "react-bootstrap";
import { SERVER_URL } from "@/config"
import Link from "next/link";
import ProductsList from "@/components/home/ProductsList";
import useAllSets from "@/services/cache/useAllSets";

export default function Home() {
  const sets = useAllSets();

  return (<div className="Home">
    <Container fluid="md">
      <Carousel fade>
        {sets.data && sets.data.featuredSetList.map((set) =>
          <Carousel.Item key={set._id}>
            <Link href={`/products?set=${set.code}`}>
              <Image src={`${SERVER_URL}/img/hero/${set.hero}`} alt={`${set.name} Hero`} className="d-block mw-100" />
            </Link>
            <Carousel.Caption>
              <Link href={`/products?set=${set.code}`} style={{ textDecoration: "none", color: "inherit" }}>
                <h3 className="text-reset" style={{textShadow: "0 0 3px #000000"}}>Order {set.name}</h3>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        )}
      </Carousel>
      <h1 className="my-4 text-center text-uppercase">Shop our latests sets</h1>
      {sets.data && sets.data.featuredSetList.filter((set) => set.featured).map((set, i) => <div key={set._id}>
        <ProductsList set={set} />
      </div>)}
    </Container>
  </div>);
}