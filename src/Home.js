import React from "react";
import { Carousel, Container } from "react-bootstrap";
import { SERVER_URL } from "./config"

export function Home() {
  return (<div className="Home">
    <Container>
      <Carousel fade>
        <Carousel.Item>
          <img src={`${SERVER_URL}/img/kamigawa-neon-dynasty_hero_1640x680.jpg`} alt="Kamigawa Neon Dynasty Hero" className="d-block mw-100" />
          <Carousel.Caption>
            <h3 style={{textShadow: "0 0 3px #000000"}}>Order Kamigawa Neon Dynasty</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={`${SERVER_URL}/img/innistrad-crimson-vow_hero.jpg`} alt="Innistrad: Crimson Vow Hero" className="d-block mw-100" />
          <Carousel.Caption>
            <h3 style={{textShadow: "0 0 3px #000000"}}>Order Innistrad: Crimson Vow</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={`${SERVER_URL}/img/innistrad-midnight-hunt_hero.jpg`} alt="Innistrad: Midnight Hunt Hero" className="d-block mw-100" />
          <Carousel.Caption>
            <h3 style={{textShadow: "0 0 3px #000000"}}>Order Innistrad: Midnight Hunt</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={`${SERVER_URL}/img/kaldheim_hero.jpg`} alt="Kaldheim Hero" className="d-block mw-100" />
          <Carousel.Caption>
            <h3 style={{textShadow: "0 0 3px #000000"}}>Order Kaldheim</h3>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      Home page - insert most recent sets
    </Container>
  </div>);
}