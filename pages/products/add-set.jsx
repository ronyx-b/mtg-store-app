import SetsApiService from "@/services/apis/setsApiService";
import useAllCardSets from "@/services/cache/useAllCardSets";
import useAllFeaturedSets from "@/services/cache/useAllFeaturedSets";
import { selectToken } from "@/services/store/tokenSlice";
import useAdminAccess from "@/services/useAdminAccess";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

/** @typedef {import("@/scryfall-api-types").CardSet} CardSet */
/** @typedef {import("@/types").FeaturedSet} FeaturedSet */

export default function AddFeaturedSet({ ...props }) {
  /** @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]} */
  const [unlistedCardSets, setUnlistedCardSets] = useState([]);
  /** @type {[FeaturedSet, React.Dispatch<React.SetStateAction<FeaturedSet>>]} */
  const [formFields, setFormFields] = useState({name: "", code: "", released_at: "", scryfall_id: "", featured: false});
  const [submissionError, setSubmissionError ] = useState("");
  const [isSubmitted, setIsSubmitted ] = useState(false);
  const hero = useRef(null);
  const token = useSelector(selectToken);
  const router = useRouter();
  const { isAdmin, isAdminAccessLoading } = useAdminAccess();
  const featuredSets = useAllFeaturedSets();
  const allSetsList = useAllCardSets();

  const goBack = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const setCardSet = (e) => {
    let scryfall_id = e.target.value;
    let set = unlistedCardSets.find((set) => set.id === scryfall_id);
    setFormFields((formData) => {
      return {...formData, scryfall_id, name: set.name, code: set.code, released_at: set.released_at};
    });
  };

  /** @type {import("react").FormEventHandler} */
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormFields((formData) => {
      return {...formData, [name]: value};
    });
  };

  /** @type {import("react").FormEventHandler} */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      let data = new FormData(e.target);
      const response = await SetsApiService.addFeaturedSet(data, token)
      if (response.status === 201 || response.data?.success) {
        router.push('/products');
      } else {
        setIsSubmitted(false);
        setSubmissionError(response.data?.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (featuredSets.data && allSetsList.data) {
      let setsData = [ ...allSetsList.data ];
      setsData = setsData.filter((set) => !featuredSets.data.some((featSet) => featSet.name === set.name));
      setUnlistedCardSets(setsData);
    }
  }, [featuredSets.data, allSetsList.data]);

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
              <input type="hidden" name="released_at" value={formFields.released_at} />
              <Row>
                <Col xs>
                  <Form.Group className="mb-3" controlId="formSets.name">
                    <Form.Label>Set Name:</Form.Label>
                    <Form.Select
                      name="scryfall_id"
                      value={formFields.scryfall_id}
                      onChange={setCardSet}
                    >
                      {allSetsList.isLoading || featuredSets.isLoading && <>
                        <option disabled={true}>Loading...</option>
                      </>}
                      {unlistedCardSets.length > 0 &&
                        unlistedCardSets.map((set) => {
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
