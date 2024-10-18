import { Cloudinary } from "@cloudinary/url-gen";
import { CldImage } from "next-cloudinary";
import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";

export default function Decklist({ ...props }) {
  const [text, setText] = useState();

  /** @param {Event} e */
  const handleSubmit = (e) => {
    e.preventDefault();
    let list = text.split(/\n/m);
    console.log(list);
  }

  // Create a Cloudinary instance and set your cloud name.
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    }
  });
  const myImg = cld.image("strixhaven-school-of-mages-set-booster-box-98228_zobyef")

  return (<div className="DecklistProcessor">
    <Container>
      <Card className="my-3">
        <Card.Header>
          <h1 className="cardHeader">Decklist Processor</h1>
        </Card.Header>
        {/* <Card.Img src={myImg.toURL()} /> */}
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="decklistForm.decklist">
              <Form.Label>Paste your decklist here:</Form.Label>
              <Form.Control as="textarea" rows={10} onChange={(e) => {setText(e.target.value)}} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      {/* <CldImage
        src="strixhaven-school-of-mages-set-booster-box-98228_zobyef"
        width="500"
        height="500"
        crop={{
          type: "auto",
          source: true
        }}
      /> */}
    </Container>
  </div>);
}