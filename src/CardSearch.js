import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { CardSearchRow } from "./CardSearchRow";

export function CardSearch(props) {
  const [cards, setCards] = useState([]);
  const location = useLocation();

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
        <CardSearchRow key={card.id} card={card} setCart={props.setCart} setCartQty={props.setCartQty} />
      )}
    </Container>
  </div>);
}