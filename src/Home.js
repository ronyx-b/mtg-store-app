import React, { useEffect, useState } from "react";
import { Carousel, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SERVER_URL } from "./config"
import { ProductCard } from "./ProductCard";

export function Home() {
  const [featuredSets, setFeaturedSets] = useState();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getFeaturedSets = async () => {
      let requestString = `${SERVER_URL}/api/sets`;
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      let setsData = data.sets.sort((first, second) => {
        let dateFirst = new Date(first.released_at);
        let dateSecond = new Date(second.released_at);
        return dateSecond - dateFirst;
      });
      setFeaturedSets(setsData)
      return setsData;
    }

    const getProducts = async () => {
      let requestString = `${SERVER_URL}/api/products`;
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      setProducts(data.products);
    };

    try {
      getFeaturedSets();
      getProducts();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (<div className="Home">
    <Container fluid="md">
      <Carousel fade>
        {featuredSets && featuredSets.map((set) =>
          <Carousel.Item key={set._id}>
            <Link to={`/Products/${set.name}`}>
              <img src={`${SERVER_URL}/img/hero/${set.hero}`} alt={`${set.name} Hero`} className="d-block mw-100" />
            </Link>
            <Carousel.Caption>
              {/* <Link to={`/Products/${set.name}`}> */}
                <h3 className="text-reset" style={{textShadow: "0 0 3px #000000"}}>Order {set.name}</h3>
              {/* </Link> */}
            </Carousel.Caption>
          </Carousel.Item>
        )}
      </Carousel>
      <h1 className="my-4 text-center text-uppercase">Shop our latests sets</h1>
      {featuredSets && featuredSets.filter((set) => set.featured).map((set, i) => <div key={set._id}>
        <h2>{set.name}</h2>
        <Container>
          <Row xs={1} md={2} lg={3} xl={4}>
            {products && products.filter((product) => product.cardSet === set.name).map((product) => 
              <ProductCard key={product._id} product={product} />
            )}
          </Row>
        </Container>
      </div>)}
    </Container>
  </div>);
}