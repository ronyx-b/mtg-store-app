import { useRef, useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { SERVER_URL } from "./config"

/*
let productSchema = new Schema({
  "name": String,
  "prodType": {
    "type": String,
    "default": "sealed"
  },
  "description": String,
  "cardSet": String,
  "price": Number,
  "stock": Number,
  "image": String
});
let Product;
*/

export function AddEditProduct(props) {
  const mode = props.mode;
  let token = props.token;
  const [formFields, setFormFields] = useState({name: "", prodType: "sealed", description: "", cardSet: "", price: 0, stock: 0});
  const image = useRef(null);
  const [formErrors, setFormErrors] = useState({name: "", prodType: "", description: "", cardSet: "", price: "", stock: "", image: ""});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageModal, setImagetModal] = useState(false);

  const handleClose = () => setImagetModal(false);
  const handleShow = () => setImagetModal(true);

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    let type = e.target.type;
    if (type === "number") {
      value = parseFloat(value);
      if (isNaN(value)) {
        value = 0;
      }
    }
    console.log(`${name}: ${value}`)
    // if (e.target.type === "select-one") {
    //   console.log(e.target.options);
    // }
    console.log(typeof value);
    setFormFields((formData) => {
      return {...formData, [name]: value};
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsSubmitted(true);
    console.log(formFields);
    console.log(e.target)
    if (image.current.files.length > 0) {
      console.log(`Selected file - ${image.current.files[0].name}`);
    }

    try {
      let requestString = `${SERVER_URL}/api/products`;
      let method = (mode === "add")?"POST":"PUT";
      let body = new FormData();
      for (let field in formFields) {
        console.log(`${field}: ${formFields[field]}`);

        body.append(field, formFields[field]);
      }
      body.set("text", "hello")
      console.log(JSON.stringify(body));
      let response = await fetch(requestString, { 
        method,
        body,
        headers: { 
          'Authorization': `JWT ${token}`
        } 
      });
      let json = await response.json();
      console.log(json);
    } catch (err) {
      console.log(err);
      setIsSubmitted(false);
    }
  };

  return (<div className="AddEditProduct">
    <Container>
      <Card className="m-4">
        <Card.Header>
          <h1 className="cardHeader">{(mode === "add")?"Add New":"Edit"} Product</h1>
        </Card.Header>
        <Container className="p-3">
          <Form noValidate id="formProduct" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formProduct.name">
              <Form.Label>Product Name:</Form.Label>
              <Form.Control type="text" name="name" value={formFields.name} onChange={handleChange} isInvalid={formErrors.name !== ""} />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProduct.type">
              <Form.Label>Product Type:</Form.Label>
              <Form.Select name="prodType" value={formFields.prodType} onChange={handleChange} isInvalid={formErrors.prodType !== ""}>
                <option value="sealed">Sealed</option> {/* selected={formFields.prodType === "sealed"} */}
                <option value="accessory">Accessory</option> {/* selected={formFields.prodType === "accessory"} */}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formErrors.prodType}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProduct.cardSet">
              <Form.Label>Card Set:</Form.Label>
              <Form.Control type="text" name="cardSet" value={formFields.cardSet} onChange={handleChange} isInvalid={formErrors.cardSet !== ""} />
              <Form.Control.Feedback type="invalid">
                {formErrors.cardSet}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProduct.description">
              <Form.Label>Description:</Form.Label>
              <Form.Control as="textarea" name="description" value={formFields.description} onChange={handleChange} isInvalid={formErrors.description !== ""} rows={4} />
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="formProduct.price">
                <Form.Label>Price:</Form.Label>
                <Form.Control type="number" name="price" value={formFields.price} onChange={handleChange} isInvalid={formErrors.price !== ""} />
                <Form.Control.Feedback type="invalid">
                  {formErrors.price}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="formProduct.stock">
                <Form.Label>Stock:</Form.Label>
                <Form.Control type="number" name="stock" value={formFields.stock} onChange={handleChange} isInvalid={formErrors.stock !== ""} />
                <Form.Control.Feedback type="invalid">
                  {formErrors.stock}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formProduct.image">
              <Form.Label>Image:</Form.Label>
              <Form.Control type="file" name="image" ref={image} accept="image/*" />
              <Form.Control.Feedback type="invalid">
                {formErrors.image}
              </Form.Control.Feedback>
              <Button size="sm" className="my-1" onClick={handleShow}>View current image</Button>
            </Form.Group>
            <Button variant="primary" type="submit" className="d-block mx-auto" disabled={isSubmitted}>Submit</Button>
          </Form>
        </Container>
      </Card>
    </Container>

    <Modal show={imageModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Current Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>Show current image here on edit mode</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  </div>);
}