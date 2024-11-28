import ProductsApiService from "@/services/apis/productsApiService";
import useAllCardSets from "@/services/cache/useAllCardSets";
import useProductDetails from "@/services/cache/useProductDetails";
import { selectToken } from "@/services/store/tokenSlice";
import useAdminAccess from "@/services/useAdminAccess";
import { Cloudinary } from "@cloudinary/url-gen";
import { Formik } from "formik";
import { useRouter } from "next/router"
import React, { useRef, useState } from "react";
import { Card, Col, Container, Form, Image, Row, Alert, Button, Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as Yup from "yup";

/**
 * Component to manage products, either ADD or EDIT a product
 * @param {{ action: ("add"|"edit"), id: string, ...props: Object }} props 
 * @returns {JSX.Element}
 */
export default function ManageProduct({ action = "add", id = null, ...props }) {
  const { isAdmin, isAdminAccessLoading } = useAdminAccess();
  const router = useRouter();
  const productDetails = useProductDetails(id);
  const initialProductData = productDetails?.data?.productDetails;
  /** @type {React.RefObject<HTMLInputElement>} */
  const image = useRef(null);
  const [imageModal, setImageModal] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const cardSets = useAllCardSets();
  const token = useSelector(selectToken);

  const handleClose = () => setImageModal(false);
  const handleShow = () => setImageModal(true);

  const ACTIONS = {
    ADD: "add",
    EDIT: "edit",
  }

  /** @type {import("@/types").Product} */
  const initialValues = {
    name: initialProductData?.name || "", 
    prodType: initialProductData?.prodType || "sealed", 
    description: initialProductData?.description || "", 
    cardSet: initialProductData?.cardSet || "", 
    price: initialProductData?.price || 0, 
    stock: initialProductData?.stock || 0,
  }

  const schema = Yup.object().shape({
    name: Yup.string().required().max(100),
    prodType: Yup.string().required().oneOf(["sealed", "accessory"]),
    description: Yup.string().required().max(500),
    cardSet: Yup.string().required()
  });

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    }
  });

  /**
   * @async
   * @param {import("@/types").Product} values 
   * @param {import("formik").FormikHelpers} formikHelpers 
   * @returns {Promise<void>}
   */
  const handleSubmit = async (values = initialValues, { setSubmitting }) => {
    try {
      let body = new FormData();
      for (let field in values) {
        body.append(field, values[field]);
      }
      body.append("image", image?.current?.files?.[0]);
      if (image.current?.files?.[0] !== undefined && action === ACTIONS.EDIT) {
        body.append("previousImage", initialProductData?.image);
      }

      const response = action === ACTIONS.ADD ? 
        await ProductsApiService.addNewProduct(body, token) :
        await ProductsApiService.editProduct(id, body, token);

      if (response.data.success || response.status === 201) {
        router.push('/products');
      } else {
        setSubmissionError(response.data?.message);
      }
    } catch (err) {
      console.log(err);
      setSubmissionError(err);
    }
  };

  return (<div className="ManageProduct" {...props}>
    <Container>
      {cardSets.isLoading || (action === ACTIONS.EDIT && productDetails.isLoading) ? <>
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
                      list="card-sets-datalist" 
                      name="cardSet" 
                      value={values.cardSet} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      isInvalid={touched.cardSet && errors.cardSet}
                    />
                    <datalist id="card-sets-datalist">
                      {cardSets.data && cardSets.data?.length > 0 && cardSets.data?.map((set, i) => (
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
                    <Button variant="secondary" className="d-block mx-3" disabled={isSubmitting} onClick={() => {router.push("/products")}}>Cancel</Button>
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
      <Modal.Body><Image src={cld.image(initialProductData?.image).toURL()} className="w-100" alt="current" loading="lazy" /></Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  </div>)
}