import Link from "next/link";
import { Col, Image, Row } from "react-bootstrap";
import AddAdjustCartButtons from "../AddAdjustCartButtons";

export default function CardSearchRow({ card, ...props }) {
  const item = {
    id: card.id, 
    name: card.name,
    type: "single", 
  };

  return (<div className="CardSearRow">
    <Row className="m-1 p-2 border-bottom">
      <Col xs={5} sm="auto">
        <Link href={`/cards/${card.id}`} style={{ color: "#000000", textDecoration: "none"}}>
          <Image src={card.image_uris?(card.image_uris.normal):(card.card_faces[0].image_uris.normal)} height="150" alt={card.name} loading="lazy" />
        </Link>
      </Col>
      <Col xs={7} sm>
        <Row><Link href={`/cards/${card.id}`} style={{ color: "#000000", textDecoration: "none", fontWeight: "bold"}}>{card.name}</Link></Row>
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