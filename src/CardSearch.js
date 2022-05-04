import { useEffect, useState } from "react";
import { Container, Pagination } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { CardSearchRow } from "./CardSearchRow";

export function CardSearch() {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState({ num: 1, pageCards: []});
  const [pages, setPages] = useState([1]);
  const location = useLocation();

  const PER_PAGE = 25;

  const updatePage = (goto) => {
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
      let set = urlParams.get('set');
      let requestString = 'https://api.scryfall.com/cards/search';
      if (set) {
        requestString += `?order=set&q=e%3A${set}&unique=prints`;
      } else {
        requestString += `?q=${search}&unique=prints`;
      }
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      cardData = data.data;
      if (cardData.length > PER_PAGE) {
        setPage({ num: 1, pageCards: cardData.slice(0,PER_PAGE)});
      } else {
        setPage({ num: 1, pageCards: cardData});
      }
      while (data.has_more) {
        response = await fetch(data.next_page, { method: 'GET'});
        data = await response.json();
        cardData = [...cardData, ...data.data];
      }
      setCards(cardData);
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
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
    }
  }, [location.search]);

  return (<div className="CardSearch">
    <Container>
      {page.pageCards && page.pageCards.map((card, i) => 
        <CardSearchRow key={card.id} index={i + 1 + (page.num - 1) * PER_PAGE} card={card} />
      )}
      <div className="d-block mx-auto" style={{width: "fit-content"}}>
        <Pagination>
          <Pagination.Prev onClick={() => updatePage("-1")} disabled={page.num === 1} />  
          {pages && pages.map((pageNum, i) => {
            if (pages.length > 7) {
              if (pageNum < page.num - 1 && pageNum > 1) {
                if (page.num > 4) {
                  if (pageNum === 2) {
                    return (<Pagination.Ellipsis key={i} />);
                  } else if (!(page.num > pages.length - 4 && pageNum > pages.length - 5)) {
                    return null;
                  }
                } 
              } else if (pageNum > page.num + 1 && pageNum < pages.length) {
                if (page.num < pages.length - 3) {
                  if (pageNum === pages.length - 1) {
                    return (<Pagination.Ellipsis key={i} />);
                  } else if (!(page.num < 5 && pageNum < 6)) {
                    return null;
                  }
                } 
              }
            }
            return (<Pagination.Item key={i} active={pageNum === page.num} onClick={() => updatePage(pageNum)}>{pageNum}</Pagination.Item>);
          })}
          <Pagination.Next onClick={() => updatePage("+1")} disabled={page.num === pages.length} />
        </Pagination>
      </div>
    </Container>
  </div>);
}