import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Container, Row } from 'react-bootstrap';
import shoppingCart from "./shoppingCart";
import { useEffect, useState } from "react";

export function CardDetails(props) {
  const setCart = props.setCart;
  const setCartQty = props.setCartQty;
  let params = useParams();
  let id = params?.id || null;
  const [card, setCard] = useState();

  useEffect(() => {
    const getCardData = async (id) => {
      let requestString = `https://api.scryfall.com/cards/${id}`;
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      setCard(data);
    }

    try {
      getCardData(id);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  return (<div className="CardDetails">
    <Container>
      {card && <div className="m-3">
        <Row>
          <Col className="col-lg-auto">
            <Row><img src={card.image_uris?(card.image_uris.normal):(card.card_faces[0].image_uris.normal)} style={{maxWidth: "250px"}} alt={card.name} loading="lazy" /></Row>
            {card.card_faces && <Row>
              <img src={card.card_faces[1].image_uris.normal} style={{maxWidth: "250px"}} alt={card.name} loading="lazy" />
            </Row>}
          </Col>
          <Col>
            <Row>
              <Col><h3>{card.name}</h3></Col>
              <Col className="col-lg-auto"><h3>{card.card_faces ? card.card_faces[0].mana_cost : card.mana_cost}</h3></Col>
            </Row>
            <Row><h5>{card.type_line}</h5></Row>
            <Row>{card.card_faces?
            (<>
              {card.card_faces[0].oracle_text.split("\n").map((line) => <p className="mb-1">{line}</p>)}
              <hr />
              {card.card_faces[1].oracle_text.split("\n").map((line) => <p className="mb-1">{line}</p>)}
            </>)
            :
            (card.oracle_text.split("\n").map((line) => <p className="mb-1">{line}</p>))           
            }</Row>
          </Col>
        </Row>
      </div>}
    </Container>
  </div>);
}