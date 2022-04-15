import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_URL } from "./config"

export function AddEditProduct(props) {
  const mode = props.mode;
  const token = props.token;
  let params = useParams();
  let id = params?.id || null;
  const [formFields, setFormFields] = useState({name: "", prodType: "sealed", description: "", cardSet: "", price: 0, stock: 0});
  const image = useRef(null);
  const [currentImage, setCurrentImage] = useState();
  const [formErrors, setFormErrors] = useState({name: "", prodType: "", description: "", cardSet: "", price: "", stock: "", image: ""});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageModal, setImagetModal] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [cardSets, setCardSets] = useState([]);
  const navigate = useNavigate();

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
    setFormFields((formData) => {
      return {...formData, [name]: value};
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // if (image.current.files.length > 0) {
    //   console.log(`Selected file - ${image.current.files[0].name}`);
    // }
    try {
      let requestString = `${SERVER_URL}/api/products`;
      if (mode === "edit" && id) {
        requestString += `/${id}`;
      }
      let method = (mode === "add")?"POST":"PUT";
      let body = new FormData(e.target);
      let response = await fetch(requestString, { 
        method,
        body,
        headers: { 
          'Authorization': `JWT ${token}`
        } 
      });
      let json = await response.json();
      if (json.success) {
        navigate('/Products');
      } else {
        setIsSubmitted(false);
        setSubmissionError(json.message);
      }
    } catch (err) {
      console.log(err);
      setSubmissionError(err);
      setIsSubmitted(false);
    }
  };

  const goBack = useCallback(() => {
    navigate('/Products');
  }, [navigate]);

  useEffect(() => {
    const getSets = async () => {
      let requestString = "https://api.scryfall.com/sets/";
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      let setsData = data.data;
      setCardSets(setsData.filter((set) => set.set_type !== "alchemy" && set.set_type !== "promo" && set.set_type !== "token" && set.set_type !== "memorabilia"));
    }

    const getProduct = async (id) => {
      let requestString = `${SERVER_URL}/api/products/${id}`;
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      if (!data.product) {
        goBack();
        return;
      }
      setFormFields({...data.product});
      setCurrentImage(data.product.image);
    }

    try {
      if (mode === "edit") {
        if (!id) {
          goBack();
          return;
        }
        getProduct(id);
      }
      getSets();
    } catch (err) {
      console.error(err);
    }
  }, [id, mode, goBack]);

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
              <Form.Control type="text" list="sets" name="cardSet" value={formFields.cardSet} onChange={handleChange} isInvalid={formErrors.cardSet !== ""} />
              <datalist id="sets">
                {cardSets.length > 0 && cardSets.map((set, i) => {
                  return (<option key={i} value={set.name} />);
                })}
                <option value="Accessories" />
              </datalist>
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
              {mode === "edit" && 
                <Button size="sm" className="my-1" onClick={handleShow}>View current image</Button>
              }
            </Form.Group>
            <div className="d-flex mx-auto" style={{width: "fit-content"}}>
              <Button variant="primary" type="submit" className="d-block mx-3" disabled={isSubmitted}>Save</Button>
              <Button variant="secondary" className="d-block mx-3" disabled={isSubmitted} onClick={goBack}>Cancel</Button>
            </div>
            {submissionError !== "" && <Alert variant="danger" className="mt-3">{submissionError}</Alert>}
          </Form>
        </Container>
      </Card>
    </Container>

    <Modal show={imageModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Current Image</Modal.Title>
      </Modal.Header>
      <Modal.Body><img src={`${SERVER_URL}/img/${currentImage}`} className="w-100" alt="current" /></Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  </div>);
}