import CardSearchRow from "@/components/CardSearch/CardSearchRow";
import useCardsBySearchTerm from "@/services/cache/useCardsBySearchTerm";
import useCardsBySet from "@/services/cache/useCardsBySet";
import { useRouter } from "next/router";
import { handleClientScriptLoad } from "next/script";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Pagination, Row } from "react-bootstrap";

export default function CardSearch({ ...props }) {
  // const [cards, setCards] = useState([]);
  const [page, setPage] = useState({ num: 1, pageCards: []});
  // const [pages, setPages] = useState([1]);
  const router = useRouter();
  const { search, set } = router.query;
  const cardsFromSearchTerm = useCardsBySearchTerm(search);
  const cardsBySet = useCardsBySet(set);
  const cards = (!!set & set !== "") ? cardsBySet.data : cardsFromSearchTerm.data;
  // console.log(cards?.length);
  const PER_PAGE = 25;
  const lastPage = Math.ceil(cards?.length / PER_PAGE);
  let pages = [];
  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

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
    pageCards = cards?.slice(first, last);
    setPage({num, pageCards});
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if(!cardsBySet.isLoading && !cardsFromSearchTerm.isLoading) {
      setPage({
        num: 1,
        pageCards: cards?.slice(0, PER_PAGE)
      });
    }
  }, [cardsBySet.isLoading, cardsFromSearchTerm.isLoading, cards]);

  return (<div className="CardSearch">
    <Container>
      {!search && !set ? <>
        <Row className="my-3">
          <Col>
            <Card className="shadow">
              <Card.Body style={{}}>
                <p>Search for a card by its name on the search bar below.</p>
                <Form onSubmit={() => {}}>
                  <Row>
                    <Col lg={10} md={10} sm={10} xs={10}>
                      <Form.Control type="text" placeholder="Search" />
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Button type="submit" variant="primary">Search</Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <Card className="shadow">
              <Card.Body style={{}}>
                <p>Or browse cards by set:</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </> : <>
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
      </>}
    </Container>
  </div>);
}