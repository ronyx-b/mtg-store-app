import React, { useEffect, useState } from "react";
import { Card, Carousel, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SERVER_URL } from "./config"

export function Home() {
  const [featuredSets, setFeaturedSets] = useState();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getFeaturedSets = async () => {
      let requestString = `${SERVER_URL}/api/sets`;
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      let setsData = data.sets;
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
        <Carousel.Item>
          <img src={`${SERVER_URL}/img/hero/streets-of-new-capenna_hero.jpg`} alt="Streets of New Capenna Hero" className="d-block mw-100" />
          <Carousel.Caption>
            <h3 style={{textShadow: "0 0 3px #000000"}}>Order Streets of New Capenna</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={`${SERVER_URL}/img/hero/kamigawa-neon-dynasty_hero.jpg`} alt="Kamigawa Neon Dynasty Hero" className="d-block mw-100" />
          <Carousel.Caption>
            <h3 style={{textShadow: "0 0 3px #000000"}}>Order Kamigawa Neon Dynasty</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={`${SERVER_URL}/img/hero/innistrad-crimson-vow_hero.jpg`} alt="Innistrad: Crimson Vow Hero" className="d-block mw-100" />
          <Carousel.Caption>
            <h3 style={{textShadow: "0 0 3px #000000"}}>Order Innistrad: Crimson Vow</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={`${SERVER_URL}/img/hero/innistrad-midnight-hunt_hero.jpg`} alt="Innistrad: Midnight Hunt Hero" className="d-block mw-100" />
          <Carousel.Caption>
            <h3 style={{textShadow: "0 0 3px #000000"}}>Order Innistrad: Midnight Hunt</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={`${SERVER_URL}/img/hero/kaldheim_hero.jpg`} alt="Kaldheim Hero" className="d-block mw-100" />
          <Carousel.Caption>
            <h3 style={{textShadow: "0 0 3px #000000"}}>Order Kaldheim</h3>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <h1 className="my-4 text-center text-uppercase">Shop our latests sets</h1>
      {featuredSets && featuredSets.map((set, i) => <div key={set._id}>
        <h2>{set.name}</h2>
        <Container>
          <Row xs={1} md={2} lg={3} className="g-4">
            {products && products.filter((prod) => prod.cardSet === set.name).map((prod) => 
              <Col key={prod._id}>
                <Card className="" style={{ width: '18rem' }} id={prod._id}>
                  <Link to={`/ProductDetails/${prod._id}`} style={{ color: "#000000", textDecoration: "none"}}>
                    <Card.Img variant="top" src={`${SERVER_URL}/img/${prod.image}`} loading="lazy" />
                  </Link>
                  <Card.Body>
                    <Card.Title>
                      <Link to={`/ProductDetails/${prod._id}`} style={{ color: "#000000", textDecoration: "none"}}>{prod.name}</Link>
                      {/* {isAdmin && <Link to={`/EditProduct/${prod._id}`} className="h6">Edit</Link>} */}
                    </Card.Title>
                    <Card.Text>
                      {prod.description}
                    </Card.Text>
                  </Card.Body>
                </Card>  
              </Col>
            )}
          </Row>
        </Container>
      </div>)}
    </Container>
  </div>);
}