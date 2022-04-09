import { useEffect, useState } from "react";
import { Container, Pagination } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { CardSearchRow } from "./CardSearchRow";

export function CardSearch(props) {
  const [cards, setCards] = useState([]);
  // const [pageCards, setPageCards] = useState([]);
  const [page, setPage] = useState({ num: 1, pageCards: []});
  const [pages, setPages] = useState([1]);
  // const [lastPage, setLastPage] = useState(1);
  const location = useLocation();

  const PER_PAGE = 25;

  const updatePage = (goto) => {
    console.log(goto)
    let num, pageCards, first, last;
    switch (goto) {
      case "+1":
        num = page.num + 1;
        break;
      case "-1":
        num = page.num - 1;
        break;
      default:
        num = parseInt(goto);
        break;
    }
    if (isNaN(num) || num < 1 || num > pages.length) {
      num = page.num;
    }
    console.log(num);
    first = (num - 1) * PER_PAGE;
    last = first + PER_PAGE;
    if (last > cards.length) {
      last = cards.length;
    }
    pageCards = cards.slice(first, last);
    setPage({num, pageCards});
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
      if (cardData.length > PER_PAGE) {
        setPage({ num: 1, pageCards: cardData.slice(0,PER_PAGE)});
      } else {
        setPage({ num: 1, pageCards: cardData});
      }
      while (data.has_more) {
        console.log("hello from inside the loop");
        response = await fetch(data.next_page, { method: 'GET'});
        data = await response.json();
        cardData = [...cardData, ...data.data];
        console.log(cardData.length);
      }
      setCards(cardData);
      // setLastPage(Math.ceil(cardData.length / PER_PAGE));
      let pagesArr = [];
      let lastPage = Math.ceil(cardData.length / PER_PAGE);
      for (let i = 1; i <= lastPage; i++) {
        pagesArr.push(i);
      }
      setPages(pagesArr);
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
      {page.pageCards && page.pageCards.map((card, i) => 
        <CardSearchRow key={i} index={i} card={card} setCart={props.setCart} setCartQty={props.setCartQty} />
      )}
      <Pagination>
        <Pagination.Prev onClick={() => updatePage("-1")} disabled={page.num === 1} />  
        {pages && pages.map((pageNum) => 
          <Pagination.Item active={pageNum === page.num} onClick={() => updatePage(pageNum)}>{pageNum}</Pagination.Item>
        )}
        <Pagination.Next onClick={() => updatePage("+1")} disabled={page.num === pages.length} />
      </Pagination>
    </Container>
  </div>);
}