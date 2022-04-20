import { useParams } from "react-router-dom";
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import shoppingCart from "./shoppingCart";
import { useEffect, useState } from "react";

export function CardDetails({setCart, setCartQty}) {
  // const setCart = props.setCart;
  // const setCartQty = props.setCartQty;
  let params = useParams();
  let id = params?.id || null;
  const [card, setCard] = useState();
  const [symbols, setSymbols] = useState();
  const [qty, setQty] = useState(shoppingCart.getItemQty(id));

  const showSymbols = (symbolCode) => {
    let symbolCodeArr = symbolCode.split("}{");
    symbolCodeArr[0] = symbolCodeArr[0].replace("{", "");
    symbolCodeArr[symbolCodeArr.length - 1] = symbolCodeArr[symbolCodeArr.length - 1].replace("}", "");
    let symbolsImg = [];
    symbolCodeArr.forEach((symbol, i) => {
      symbolsImg.push(<img key={i} src={symbols[symbol]} style={{ display: "inline", width: "1em"}} alt={symbol} />);
    });
    return symbolsImg;
  }

  const addSymbolsToText = (text) => {
    let first = 0;
    let last = 0;
    let parsedtext = [];
    let textBefore = "";
    let symbol;
    while (first !== -1) {
      first = text.indexOf("{");
      last = text.indexOf("}", first);
      if (first >= 0) {
        textBefore = text.substring(0, first);
        symbol = showSymbols(text.substring(first, last + 1));
        text = text.substring(last + 1);
        parsedtext.push(textBefore, symbol);
      }
    }
    parsedtext.push(text);
    return parsedtext;
  };

  const handleChange = (e) => {
    let value = parseInt(e.target.value)
    if (isNaN(value) || value < 0) {
      setQty(0);
    } else if (value > 20) {
      setQty(20);
    } else {
      setQty(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCart(shoppingCart.addOrRemoveToCart({id: card.id, type: "single", name: card.name}, qty));
    setCartQty(shoppingCart.getCartQty());
    setQty(1);
  };

  useEffect(() => {
    const getCardData = async (id) => {
      let requestString = `https://api.scryfall.com/cards/${id}`;
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      setCard(data);
      return data;
    }

    const getSymbols = async () => {
      let requestString = 'https://api.scryfall.com/symbology';
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      let symbolsObj = {};
      data.data.forEach((symbol) => { 
        let index = symbol.symbol.slice(1, -1);
        symbolsObj[index] = symbol.svg_uri;
      });
      setSymbols(symbolsObj);
    };

    try {
      getSymbols();
      getCardData(id);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  return (<div className="CardDetails">
    <Container>
      {card && <div className="m-3">
        <Row>
          <Col xs={{span: 12, order: "last"}} md={{span: "auto", order: "first"}}>
            <Row><img src={card.image_uris?(card.image_uris.normal):(card.card_faces[0].image_uris.normal)} style={{maxWidth: "250px", margin: "auto"}} alt={card.name} loading="lazy" /></Row>
            {card.card_faces && card.card_faces[1].image_uris && <Row>
              <img src={card.card_faces[1].image_uris.normal} style={{maxWidth: "250px", margin: "auto"}} alt={card.name} loading="lazy" />
            </Row>}
          </Col>
          <Col>
            <Row>
              <Col><h3>{card.name}</h3></Col>
              <Col md="auto">
                <h3>
                  {symbols && addSymbolsToText(card.mana_cost ? card.mana_cost : ((card.card_faces[1].mana_cost)? `${card.card_faces[0].mana_cost} // ${card.card_faces[1].mana_cost}` : card.card_faces[0].mana_cost ))}
                </h3>
              </Col>
            </Row>
            <Row><h4>{card.set_name}</h4></Row>
            <Row><h5>{card.type_line}</h5></Row>
            <Row style={{ minHeight: "50%" }}>{card.card_faces?
            (<>
              {card.card_faces[0].oracle_text.split("\n").map((line, i) => <p key={i} className="mb-1">{symbols && addSymbolsToText(line)}</p>)}
              <hr />
              {card.card_faces[1].oracle_text.split("\n").map((line, i) => <p key={i} className="mb-1">{symbols && addSymbolsToText(line)}</p>)}
            </>)
            :
            (card.oracle_text.split("\n").map((line, i) => <p key={i} className="mb-1">{symbols && addSymbolsToText(line)}</p>))           
            }
            </Row>
            <Row className="mb-3">
            {(card.prices.usd)?
              <>
                <Col xs className="fw-bold">
                  {card.prices.usd}$
                </Col>
                <Col xs="auto">
                  <Form onSubmit={handleSubmit}>
                    <div className="d-flex flex-nowrap">
                      <Form.Control type="number" size="sm" style={{width: "50px"}} name="qty" value={qty} onChange={handleChange} />
                      <Button type="submit" size="sm">Add</Button>
                    </div>
                  </Form>
                </Col>
              </>
              :<>Out of Stock</>}
            </Row>
          </Col>
        </Row>
      </div>}
    </Container>
  </div>);
}