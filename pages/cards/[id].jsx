import AddAdjustCartButtons from "@/components/AddAdjustCartButtons";
import useCardById from "@/services/cache/useCardById";
import useCardSymbols from "@/services/cache/useCardSymbols";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";

export default function CardDetails({ ...props }) {
  const router = useRouter();
  const { id } = router.query;
  // const [symbols, setSymbols] = useState();
  const [isTransformed, setIsTransformed] = useState(false);
  const frontImage = useRef(null);
  const card = useCardById(id);
  const item = {
    id: card.data?.id, 
    type: "single", 
    name: card.data?.name
  };
  const symbolsData = useCardSymbols();
  let symbols = {};
  symbolsData.data?.forEach((symbol) => { 
    let index = symbol.symbol.slice(1, -1);
    symbols[index] = symbol.svg_uri;
  });

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
      symbolsImg.push(<Image key={i} src={symbols[symbol]} style={{ display: "inline", width: "1em"}} alt={symbol} />);
    });
    return symbolsImg;
  }

  const addSymbolsToText = (text) => {
    let first = 0;
    let last = 0;
    let parsedText = [];
    let textBefore = "";
    let symbol;
    while (first !== -1) {
      first = text.indexOf("{");
      last = text.indexOf("}", first);
      if (first >= 0) {
        textBefore = text.substring(0, first);
        symbol = showSymbols(text.substring(first, last + 1));
        text = text.substring(last + 1);
        parsedText.push(textBefore, symbol);
      }
    }
    parsedText.push(text);
    return parsedText;
  };

  return (<div className="CardDetails">
    <Container>
      {card.data && <div className="m-3">
        <Row>
          <Col xs={{span: 12, order: "last"}} md={{span: 3, order: "first"}}>
            <Row style={{position: "relative"}}>
              <Image className="w-100" style={{transition: "all 1s linear", position: "relative", ...(isTransformed? isBackFace : isFrontFace)}} src={card.data?.image_uris?(card.data?.image_uris?.normal):(card.data?.card_faces[0]?.image_uris?.normal)} alt={card.data?.name} loading="lazy" ref={frontImage} />
              {card.data?.card_faces && card.data?.card_faces[1].image_uris && <>
                <Image className="w-100" style={{transition: "all 1s linear", position: "absolute", ...(isTransformed? isFrontFace : isBackFace)}} src={card.data?.card_faces[1]?.image_uris?.normal} alt={card.data?.name} loading="lazy" />
              </>
              }  
            </Row>
            {card.data?.card_faces && card.data?.card_faces[1].image_uris && 
            <Row className="p-3">
              <Button style={{width: "fit-content", margin: "auto"}} onClick={transformCard}>Transform <i className="bi bi-arrow-repeat"></i></Button>
            </Row>}
          </Col>
          <Col>
            <Row>
              <Col><h3>{card.data?.name}</h3></Col>
              <Col md="auto">
                <h3>
                  {symbolsData.data && addSymbolsToText(card.data?.mana_cost !== undefined ? card.data?.mana_cost : ((card.data?.card_faces[1].mana_cost)? `${card.data?.card_faces[0].mana_cost} // ${card.data?.card_faces[1].mana_cost}` : card.data?.card_faces[0].mana_cost ))}
                </h3>
              </Col>
            </Row>
            <Row><h4><Link href={`/cards?set=${card.data?.set}`} style={{color: "inherit", textDecoration: "none", fontWeight: "bold"}}>{card.data?.set_name}</Link></h4></Row>
            <Row><h5>{card.data?.type_line}</h5></Row>
            <Row style={{}/* { minHeight: "50%" } */}>{card.data?.card_faces?
            (<>
              {card.data?.card_faces[0].oracle_text.split("\n").map((line, i) => <p key={i} className="mb-1">{symbolsData.data && addSymbolsToText(line)}</p>)}
              <hr />
              {card.data?.card_faces[1].oracle_text.split("\n").map((line, i) => <p key={i} className="mb-1">{symbolsData.data && addSymbolsToText(line)}</p>)}
            </>)
            :
            (card.data?.oracle_text.split("\n").map((line, i) => <p key={i} className="mb-1">{symbolsData.data && addSymbolsToText(line)}</p>))           
            }
            </Row>
            <Row className="mb-3">
            {(card.data?.prices.usd)?
              <>
                <Col xs className="fw-bold">
                  {card.data?.prices.usd}$
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
  </div>);
}