import { useParams } from "react-router-dom";
import { Col, Container, Row, Button } from 'react-bootstrap';
import { useEffect, useRef, useState } from "react";
import { AddAdjustCartButtons } from "./AddAdjustCartButtons";

export function CardDetails() {
  let params = useParams();
  let id = params?.id || null;
  const [card, setCard] = useState();
  const [symbols, setSymbols] = useState();
  const [item, setItem] = useState({});
  // const [imageModal, setImagetModal] = useState(false);
  const [isTransformed, setIsTransformed] = useState(false);
  const frontImage = useRef(null);

  // const handleClose = () => setImagetModal(false);
  // const handleShow = () => setImagetModal(true);

  const transformCard = () => {
    setIsTransformed(isTransformed => !isTransformed);
  };

  const isFrontFace = {
    transform: "rotateY(0deg)",
    zIndex: "1000"
  };

  const isBackFace = {
    transform: "rotateY(180deg)",
    zIndex: "-1000"
  };

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
      getCardData(id).then((card) => {
        setItem({id: card.id, type: "single", name: card.name});
      });
    } catch (err) {
      console.log(err);
    }

    console.log(frontImage.current?.width);
  }, [id]);

  return (<div className="CardDetails">
    <Container>
      {card && <div className="m-3">
        <Row>
          <Col xs={{span: 12, order: "last"}} md={{span: 3, order: "first"}}>
            <Row style={{position: "relative"}}>
              <img className="w-100" style={{transition: "all 1s linear", position: "relative", ...(isTransformed? isBackFace : isFrontFace)}} src={card.image_uris?(card.image_uris.normal):(card.card_faces[0].image_uris.normal)} alt={card.name} loading="lazy" ref={frontImage} />
              {card.card_faces && card.card_faces[1].image_uris && <>
                <img className="w-100" style={{transition: "all 1s linear", position: "absolute", ...(isTransformed? isFrontFace : isBackFace)}} src={card.card_faces[1].image_uris.normal} alt={card.name} loading="lazy" />
              </>
              }  
            </Row>
            {card.card_faces && card.card_faces[1].image_uris && 
            <Row className="p-3">
              <Button style={{width: "fit-content", margin: "auto"}} onClick={transformCard}>Transform <i className="bi bi-arrow-repeat"></i></Button>
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
            <Row style={{}/* { minHeight: "50%" } */}>{card.card_faces?
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
                  <AddAdjustCartButtons item={item} />
                </Col>
              </>
              :<>Out of Stock</>}
            </Row>
          </Col>
        </Row>
      </div>}
    </Container>

    {/* <Modal show={imageModal} onHide={handleClose}>
      <Modal.Body>
        {card && 
        <Col>
        <Carousel>
          <Carousel.Item>
            <img src={card.image_uris?(card.image_uris.normal):(card.card_faces[0].image_uris.normal)} className="w-100" alt={card.name} loading="lazy" />
          </Carousel.Item>
          {card.card_faces && card.card_faces[1].image_uris &&
          <Carousel.Item>
            <img src={card.card_faces[1].image_uris.normal} className="w-100" alt={card.name} loading="lazy" />
          </Carousel.Item>} 
        </Carousel>

        </Col>
        }
      </Modal.Body>
    </Modal> */}
  </div>);
}