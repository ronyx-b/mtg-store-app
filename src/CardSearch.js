import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function CardSearch() {
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
      // console.log(data.data)
      setCards(data.data)
    })
    .catch(err => { console.error(err); });
  }, [location.search]);

  return (
    <div className="CardSearch">
      {cards && cards.map((card) => 
        <div key={card.id} id={card.id}>
          {card.name}
          <br />{card.image_uris?(<img src={card.image_uris.normal} width="300" alt={card.name} />):(<img src={card.card_faces[0].image_uris.normal} width="300" alt={card.name} />)}
        </div>
      )}
    </div>
  );
}