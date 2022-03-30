import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

export function CardSearch(props) {
  const [cards, setCards] = useState([]);
  const location = useLocation();
  const shoppingCart = props.shoppingCart;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    let search = urlParams.get('search');
    let requestString = 'https://api.scryfall.com/cards/search';
    requestString += `?q=${search}`;
    fetch(requestString, { method: 'GET'})
    .then(response => response.json())
    .then(data => { 
      setCards(data.data)
    })
    .catch(err => { console.error(err); });
  }, [location.search]);

  return (<div className="CardSearch">
    <Container>
      {cards && cards.map((card) => 
        <Row key={card.id} id={card.id} className="m-1 p-2 border-bottom">
          <Col className="col-lg-auto">{card.image_uris?(<img src={card.image_uris.normal} width="100" alt={card.name} />):(<img src={card.card_faces[0].image_uris.normal} width="100" alt={card.name} />)}</Col>
          <Col>{card.name}</Col>
          <Col className="col-lg-auto">{card.prices.usd && <>{card.prices.usd}$</>}</Col>
          <Col className="col-lg-auto">
            {(card.prices.usd)?
            <Form>
              <Button onClick={() => {shoppingCart.addOrRemoveToCart({id: card.id, type: "single", name: card.name}, 1)}}>Add to Cart</Button>
            </Form>
            :<>Out of Stock</>}
          </Col>
        </Row>
      )}
    </Container>
    
  </div>);
}