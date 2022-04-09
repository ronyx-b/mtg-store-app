import { useState } from "react";
import { Button, Form } from "react-bootstrap";

export function DecklistProcessor() {
  const [text, setText] = useState();
  const handleSubmit = function(e) {
    e.preventDefault();
    let list = text.split(/\n/m);
    console.log(list);
  }
  return (<div className="Register">
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="decklistForm.decklist">
        <Form.Label>Paste your decklist here:</Form.Label>
        <Form.Control as="textarea" rows={10} onChange={(e) => {setText(e.target.value)}} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  </div>);
}