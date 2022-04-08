import React, { useEffect, useState } from "react";
import { Container, Pagination } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { CardSearchRow } from "./CardSearchRow";

export function CardSearch(props) {
  const [cards, setCards] = useState([]);
  const [pageCards, setPageCards] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const location = useLocation();

  const PER_PAGE = 25;

  const updateCardsPerPage = (page) => {
    setPageCards(cards.slice((page - 1) * PER_PAGE, page * PER_PAGE));
  };

  const previousPage = () => {
    if (page > 1) {
      let currentPage = page;
      setPage(--currentPage);
      updateCardsPerPage(--currentPage);
    }
  };

  const nextPage = () => {
    if (page < lastPage) {
      let currentPage = page;
      setPage(++currentPage);
      updateCardsPerPage(++currentPage);
    }
  };

  useEffect(() => {
    const getCardData = async () => {
      let cardData = [];
      const urlParams = new URLSearchParams(location.search);
      let search = urlParams.get('search');
      console.log(search);
      let requestString = 'https://api.scryfall.com/cards/search';
      requestString += `?q=${search}`;
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      cardData = data.data;
      setPage(1);
      if (cardData.length > PER_PAGE) {
        setPageCards(cardData.slice(0,PER_PAGE));
      } else {
        setPageCards(cardData);
      }
      while (data.has_more) {
        console.log("hello from inside the loop");
        response = await fetch(data.next_page, { method: 'GET'});
        data = await response.json();
        cardData = [...cardData, ...data.data];
        console.log(cardData.length);
      }
      setCards(cardData);
      setLastPage(Math.ceil(cardData.length / PER_PAGE));
      return cardData
    };

    try {
      getCardData().then((cardData) => {
        console.log(`card data fully loaded, ${cardData.length} records`);
      });
    } catch (err) {
      console.error(err);
    }
  }, [location.search]); /* [location.search, pageCards] */

  return (<div className="CardSearch">
    <Container>
      {pageCards && pageCards.map((card, i) => 
        <CardSearchRow key={i} index={i} card={card} setCart={props.setCart} setCartQty={props.setCartQty} />
      )}
      <Pagination>
        <Pagination.Prev onClick={previousPage} />
        <Pagination.Item>{page}</Pagination.Item>
        <Pagination.Next onClick={nextPage} />
      </Pagination>
    </Container>
  </div>);
}