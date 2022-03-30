import React from "react";
import { Container } from "react-bootstrap";
import { SERVER_URL } from "./config"

export function Home() {
  return (<div className="Home">
    <Container>
      <img src={`${SERVER_URL}/img/kamigawa-neon-dynasty_hero_1500x500.jpg`} alt="Hero" className="mw-100" />
      Home page - insert most recent sets
    </Container>
  </div>);
}