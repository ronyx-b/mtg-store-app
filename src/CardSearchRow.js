import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AddAdjustCartButtons } from "./AddAdjustCartButtons";

export function CardSearchRow({card}) {
  const item = {id: card.id, type: "single", name: card.name}

  return (<div className="CardSearRow">
    <Row className="m-1 p-2 border-bottom">
      <Col xs={5} sm="auto">
        <Link to={`/CardDetails/${card.id}`} style={{ color: "#000000", textDecoration: "none"}}>
          <img src={card.image_uris?(card.image_uris.normal):(card.card_faces[0].image_uris.normal)} height="150" alt={card.name} loading="lazy" />
        </Link>
      </Col>
      <Col xs={7} sm>
        <Row><Link to={`/CardDetails/${card.id}`} style={{ color: "#000000", textDecoration: "none", fontWeight: "bold"}}>{card.name}</Link></Row>
        <Row><span className="mx-1">{card.set_name}</span></Row>
      </Col>
      <Col xs={5} sm="auto" className="fw-bold">{card.prices.usd && <>{card.prices.usd}$</>}</Col>
      <Col xs={7} sm="auto">
        {(card.prices.usd)?
        <AddAdjustCartButtons item={item} />
        :
        <>Out of Stock</>
        }
      </Col>
    </Row>
  </div>);
}