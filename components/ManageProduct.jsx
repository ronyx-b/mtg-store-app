import { SERVER_URL } from "@/config";
import useProductDetails from "@/services/cache/useProductDetails";
import { selectToken } from "@/services/store/tokenSlice";
import { Formik } from "formik";
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react";
import { Card, Col, Container, Form, Image, Row, Alert, Button, Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as Yup from "yup";

/**
 * Component to manage products, either ADD or EDIT a product
 * @param {{ action: ("add"|"edit"), id: string, ...props: Object }} props 
 * @returns
 */
export default function ManageProduct({ action = "add", id = null,  ...props }) {
  const router = useRouter();
  const productDetails = useProductDetails(id);
  const initialProductData = productDetails?.data?.productDetails;
  const image = useRef(null);
  const [currentImage, setCurrentImage] = useState(initialProductData?.image);

  const initialValues = {
    name: initialProductData?.name || "", 
    prodType: initialProductData?.prodType || "sealed", 
    description: initialProductData?.description || "", 
    cardSet: initialProductData?.cardSet || "", 
    // image: image || null,
    price: initialProductData?.price || 0, 
    stock: initialProductData?.stock || 0,
  }

  const schema = Yup.object().shape({
    name: Yup.string().required().max(100),
    prodType: Yup.string().required().oneOf(["sealed", "accessory"]),
    description: Yup.string().required().max(500),
    cardSet: Yup.string().required()
  });


  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [cardSets, setCardSets] = useState([]);
  const token = useSelector(selectToken);

  const handleClose = () => setImageModal(false);
  const handleShow = () => setImageModal(true);

  // const handleChange = (e) => {
  //   let name = e.target.name;
  //   let value = e.target.value;
  //   let type = e.target.type;
  //   if (type === "number") {
  //     value = parseFloat(value);
  //     if (isNaN(value)) {
  //       value = 0;
  //     }
  //   }
  //   setFormFields((formData) => {
  //     return {...formData, [name]: value};
  //   });
  // };

  const handleSubmit = async (values = initialValues, { setSubmitting }) => {
    // setSubmitting(true);
    // setIsSubmitted(true);
    // if (image.current.files.length > 0) {
    //   console.log(`Selected file - ${image.current.files[0].name}`);
    // }
    try {
      let requestString = `${SERVER_URL}/api/products`;
      if (action === "edit" && id) {
        requestString += `/${id}`;
      }
      let method = (action === "add")?"POST":"PUT";
      let body = new FormData();
      console.log(values);
      for (let field in values) {
        console.log(`Add "${field}" to formData`);
        body.append(field, values[field]);
        console.log(body.get(field));
      }
      body.append("image", image);
      console.log(body.get("image"));
      if (values?.attachments && values?.attachments?.length && values.attachments.length > 0) {
        for (let i = 0; i <= values.attachments.length; i++) {
          body.append(`attachments[${i}]`, values.attachments[i])
        }
      }

      console.log(body);

      // let response = await fetch(requestString, { 
      //   method,
      //   body,
      //   headers: { 
      //     'Authorization': `JWT ${token}`
      //   } 
      // });
      // let json = await response.json();
      // if (json.success) {
      //   router.push('/products');
      // } else {
      //   // setIsSubmitted(false);
      //   setSubmissionError(json.message);
      // }

    } catch (err) {
      console.log(err);
      setSubmissionError(err);
      // setIsSubmitted(false);
    }
  };

  const goBack = useCallback(() => {
    if (action === "edit") {
      router.push('/products');
    } else {
      router.push('/dashboard');
    }
  }, [router, action]);

  useEffect(() => {
    const getSets = async () => {
      let requestString = "https://api.scryfall.com/sets/";
      let response = await fetch(requestString, { method: 'GET'});
      let data = await response.json();
      let setsData = data.data;
      setCardSets(setsData.filter((set) => set.set_type !== "alchemy" && set.set_type !== "promo" && set.set_type !== "token" && set.set_type !== "memorabilia"));
    }

    // const getProduct = async (id) => {
    //   let requestString = `${SERVER_URL}/api/products/${id}`;
    //   let response = await fetch(requestString, { method: 'GET'});
    //   let data = await response.json();
    //   if (!data.product) {
    //     goBack();
    //     return;
    //   }
    //   setFormFields({...data.product});
    //   setCurrentImage(data.product.image);
    // }

    try {
      if (action === "edit") {
        if (!id) {
          goBack();
          return;
        }
        // getProduct(id);
      }
      getSets();
    } catch (err) {
      console.error(err);
    }
  }, [id, action, goBack]);


  return (<div className="ManageProduct" {...props}>
    <Container>
      {action === "edit" && productDetails.isLoading ? <>
        <Spinner animation="border" role="status" style={{ display: "block", margin: "5rem auto" }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </> : <>
        <Card className="m-4">
          <Card.Header>
            <h1 className="cardHeader">{(action === "add")?"Add New":"Edit"} Product</h1>
          </Card.Header>
          <Container className="p-3">
            <Formik 
              initialValues={initialValues}
              validationSchema={schema}
              validateOnBlur={true}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isValid ,isSubmitting }) => (
                <Form noValidate id="formProduct" onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formProduct.name">
                    <Form.Label>Product Name:</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name" 
                      value={values.name} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      isInvalid={touched.name && errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formProduct.type">
                    <Form.Label>Product Type:</Form.Label>
                    <Form.Select 
                      name="prodType" 
                      value={values.prodType} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      isInvalid={touched.prodType && errors.prodType}
                    >
                      <option value="sealed">Sealed</option> {/* selected={values.prodType === "sealed"} */}
                      <option value="accessory">Accessory</option> {/* selected={values.prodType === "accessory"} */}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.prodType}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formProduct.cardSet">
                    <Form.Label>Card Set:</Form.Label>
                    <Form.Control 
                      type="text" 
                      list="sets" 
                      name="cardSet" 
                      value={values.cardSet} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      isInvalid={touched.cardSet && errors.cardSet}
                    />
                    <datalist id="sets">
                      {cardSets.length > 0 && cardSets.map((set, i) => (
                        <option key={i} value={set.name} />  
                      ))}
                      <option value="Accessories" />
                    </datalist>
                    <Form.Control.Feedback type="invalid">
                      {errors.cardSet}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formProduct.description">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      name="description" 
                      value={values.description} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      isInvalid={touched.description && errors.description}
                      rows={4} 
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="formProduct.price">
                      <Form.Label>Price:</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="price" 
                        value={values.price} 
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        isInvalid={touched.price && errors.price} 
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.price}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="formProduct.stock">
                      <Form.Label>Stock:</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="stock" 
                        value={values.stock} 
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        isInvalid={touched.stock && errors.stock} 
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.stock}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Form.Group className="mb-3" controlId="formProduct.image">
                    <Form.Label>Image:</Form.Label>
                    <Form.Control type="file" name="image" ref={image} accept="image/*" />
                    <Form.Control.Feedback type="invalid">
                      {errors.image}
                    </Form.Control.Feedback>
                    {action === "edit" && 
                      <Button size="sm" className="my-1" onClick={handleShow}>View current image</Button>
                    }
                  </Form.Group>
                  <div className="d-flex mx-auto" style={{width: "fit-content"}}>
                    <Button variant="primary" type="submit" className="d-block mx-3" disabled={!isValid || isSubmitting}>Save</Button>
                    <Button variant="secondary" className="d-block mx-3" disabled={isSubmitting} onClick={goBack}>Cancel</Button>
                  </div>
                  {submissionError !== "" && <Alert variant="danger" className="mt-3">{submissionError}</Alert>}
                </Form>
              )}
            </Formik>
          </Container>
        </Card>
      </>}
    </Container>

    <Modal show={imageModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Current Image</Modal.Title>
      </Modal.Header>
      <Modal.Body><Image src={`${SERVER_URL}/img/${currentImage}`} className="w-100" alt="current" /></Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  </div>)
}