import { Col, Image, Row } from "react-bootstrap";
import Link from "next/link";
import AddAdjustCartButtons from "../AddAdjustCartButtons";

export default function CartCardItem({item, card}) {

  return (<div className="CartItem">
    <Row className="m-1 p-2 border-bottom">
      {card && <>
        <Col xs={5} md="auto">
          <Link href={`/cards/${card.id}`} style={{ color: "#000000", textDecoration: "none"}}>
            <Image src={card.image_uris?(card.image_uris.normal):(card.card_faces[0].image_uris.normal)} width="100" alt={card.name} loading="lazy" />
          </Link>
        </Col>
        <Col xs={7} md>
          <Row><Link href={`/cards/${card.id}`} style={{ color: "#000000", textDecoration: "none", fontWeight: "bold"}}>{card.name}</Link></Row>
          <Row><span className="mx-1">{card.set_name}</span></Row>
        </Col>
        <Col xs={3} md="auto"><div className="text-right" style={{width: "4em"}}>{card.prices.usd && <>{card.prices.usd}$</>}</div></Col>
        <Col xs={3} md="auto"><div className="text-right" style={{width: "5em"}}>{card.prices.usd && <>{(parseFloat(card.prices.usd) * item.qty).toFixed(2)}$</>}</div></Col>
        <Col xs={6} md="auto">
          {(card.prices.usd) ?
            <AddAdjustCartButtons item={item} showRemove={true} />
          :
            <>Out of Stock</>
          }
        </Col>
      </>}
    </Row>
  </div>);
}
