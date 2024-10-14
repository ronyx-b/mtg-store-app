import { SERVER_URL } from "@/config";
import { selectToken } from "@/services/store/tokenSlice";
import useAdminAccess from "@/services/useAdminAccess";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function AddFeaturedSet({ ...props }) {
  const [cardSets, setCardSets] = useState([]);
  const [formFields, setFormFields] = useState({name: "", code: "", released_at: "", scryfall_id: "", featured: false});
  const [submissionError, setSubmissionError ] = useState("");
  const [isSubmitted, setIsSubmitted ] = useState(false);
  const hero = useRef(null);
  const token = useSelector(selectToken);
  const router = useRouter();
  const { isAdmin, isAdminAccessLoading } = useAdminAccess();

  const goBack = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const setCardSet = (e) => {
    let scryfall_id = e.target.value;
    let set = cardSets.find((set) => set.id === scryfall_id);
    setFormFields((formData) => {
      return {...formData, scryfall_id, name: set.name, code: set.code, released_at: set.released_at};
    });
  };

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    let type = e.target.type;
    if (type === 'checkbox') {
      value = e.target.checked;
    }
    setFormFields((formData) => {
      return {...formData, [name]: value};
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log(formFields);
    try {
      let requestString = `${SERVER_URL}/api/sets`;
      let body = new FormData(e.target);  
      let response = await fetch(requestString, { 
        method: 'POST',
        body,
        headers: { 
          'Authorization': `JWT ${token}` 
        } 
      });
      let json = await response.json();
      console.log(json.message);
      if (json.success) {
        router.push('/Products');
      } else {
        setIsSubmitted(false);
        setSubmissionError(json.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const getFeaturedSets = async () => {
      let requestString = `${SERVER_URL}/api/sets`;
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      let featuredSets = data.featuredSetList.sort((first, second) => {
        let dateFirst = new Date(first.released_at);
        let dateSecond = new Date(second.released_at);
        return dateSecond - dateFirst;
      });
      return featuredSets;
    }

    const getSets = async (featuredSets) => {
      let requestString = "https://api.scryfall.com/sets/";
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      let setsData = data.data;
      setsData = setsData.filter((set) => set.set_type !== "alchemy" && set.set_type !== "promo" && set.set_type !== "token" && set.set_type !== "memorabilia");
      setsData = setsData.filter((set) => !featuredSets.some((featSet) => featSet.name === set.name));
      setCardSets(setsData);
    }

    try {
      getFeaturedSets().then((featuredSets) => {
        getSets(featuredSets);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="AddFeaturedSet" {...props}>
      <Container>
        <Card className="m-4">
          <Card.Header>
            <h1 className="cardHeader">Add a Featured Set</h1>
          </Card.Header>
          <Container className="p-3">
            <Form id="formSets" onSubmit={handleSubmit}>
              <input type="hidden" name="name" value={formFields.name} />
              <input type="hidden" name="code" value={formFields.code} />
              <input
                type="hidden"
                name="released_at"
                value={formFields.released_at}
              />
              <Row>
                {/* <Col md={4}>
                <Form.Group className="mb-3" controlId="formSets.code">
                  <Form.Label>Set Code:</Form.Label>
                  <Form.Control type="text" name="code" value={formFields.code} disabled />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.code}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formSets.releasedAt">
                  <Form.Label>Date Released:</Form.Label>
                  <Form.Control type="date" name="released_at" value={formFields.released_at} disabled />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.released_at}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col> */}
                <Col xs>
                  <Form.Group className="mb-3" controlId="formSets.name">
                    <Form.Label>Set Name:</Form.Label>
                    <Form.Select
                      name="scryfall_id"
                      value={formFields.scryfall_id}
                      onChange={setCardSet}
                    >
                      {cardSets.length > 0 &&
                        cardSets.map((set) => {
                          return (
                            <option key={set.id} value={set.id}>
                              {set.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} sm="auto">
                  <Form.Group className="mb-3" controlId="formSets.featured">
                    <Form.Label>Featured:</Form.Label>
                    <Form.Check
                      type="checkbox"
                      name="featured"
                      value="true"
                      label="Set is featured"
                      checked={formFields.featured}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* <Form.Group className="mb-3" controlId="formSets.hero">
              <Form.Label>Hero:</Form.Label>
              <Form.Control type="text" name="hero" value={formFields.hero} onChange={handleChange} />
            </Form.Group> */}
              <Form.Group className="mb-3" controlId="formSets.hero">
                <Form.Label>Hero:</Form.Label>
                <Form.Control
                  type="file"
                  name="hero"
                  ref={hero}
                  accept="image/*"
                  required
                />
                {/* {mode === "edit" && 
                <Button size="sm" className="my-1" onClick={handleShow}>View current image</Button>
              } */}
              </Form.Group>
              <div className="d-flex mx-auto" style={{ width: "fit-content" }}>
                <Button
                  variant="primary"
                  type="submit"
                  className="d-block mx-3"
                  disabled={isSubmitted}
                >
                  Save
                </Button>
                <Button
                  variant="secondary"
                  className="d-block mx-3"
                  disabled={isSubmitted}
                  onClick={goBack}
                >
                  Cancel
                </Button>
              </div>
              {submissionError !== "" && (
                <Alert variant="danger" className="mt-3">
                  {submissionError}
                </Alert>
              )}
            </Form>
          </Container>
        </Card>
      </Container>
    </div>
  );
}
