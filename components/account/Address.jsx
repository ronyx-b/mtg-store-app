import UsersApiService from "@/services/apis/usersApiService";
import useUserProfile from "@/services/cache/useUserProfile";
import { selectToken } from "@/services/store/tokenSlice";
import { Formik, useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import * as Yup from "yup";

export default function Address({ ...props }) {
  const router = useRouter();
  const token = useSelector(selectToken);
  const accountInfo = useUserProfile(token);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [submissionError, setSubmissionError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: accountInfo.data?.name,
      street: "",
      city: "",
      province: "",
      postal: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required().max(50),
      street: Yup.string().required().max(50),
      city: Yup.string().required().max(20),
      province: Yup.string().required().max(20),
      postal: Yup.string().required().max(10),
    }),
    onSubmit: async (values) => {
      try {
        let response;
        if (editAddressId !== null) {
          response = await UsersApiService.editAddress(token, { ...values, _id: editAddressId });
        } else {
          response = await UsersApiService.addAddress(token, values);
        }
        if (response.status !== 200 || response.status !== 201) {
          throw response.data.message;
        }
        console.log("Submitted:", values);
        setEditAddressId(null);
        setShowAddressModal(false);
      } catch (err) {
        setSubmissionError(err);
        console.log(`Error: ${err}`);
      }
    },
  });

  const handleModalClose = () => {
    if (!formik.isSubmitting) {
      setShowAddressModal(false);
      setEditAddressId(null);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await UsersApiService.deleteAddress(token, { addressId });
      if (response.status === 200) {
        alert(response.data.message);
      }
    }
    catch (err) {
      console.log(`Error: ${err}`);
    }
  }

  useEffect(() => {
    if (editAddressId !== null) {
      (async () => {
        await formik.setValues({
          ...accountInfo.data?.address.find(
            (thisAddress) => thisAddress._id == editAddressId
          ),
        });
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editAddressId]);

  return (
    <div className="Address">
      <Row xs={1} md={1} lg={1} xl={1}>
        <Col>
          <Button onClick={() => {setShowAddressModal(true)}}>
            <i class="bi bi-plus-lg" /> Add new Address
          </Button>
        </Col>
      </Row>
      <Row xs={1} md={2} lg={3} xl={3} style={{ marginTop: "1rem" }}>
        {accountInfo.isLoading ? (
          <>
            <Spinner
              animation="border"
              role="status"
              style={{ display: "block", margin: "5rem auto" }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </>
        ) : (
          <>
            {accountInfo.data.address.map((thisAddress, i) => (
              <Col key={i}>
                <Card className="shadow">
                  <Card.Body>
                    <Row>
                      <p>
                        {thisAddress.name}
                        <br />
                        {thisAddress.street}
                        <br />
                        {thisAddress.city}, {thisAddress.province}, {thisAddress.postal}
                      </p>
                    </Row>
                    <Row>
                      <Col>
                        <Button
                          onClick={() => {
                            setEditAddressId(thisAddress._id);
                            setShowAddressModal(true);
                          }}
                        >
                          <i className="bi bi-pencil" /> Edit
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          onClick={() => {
                            handleDeleteAddress(thisAddress._id);
                          }}
                        >
                          <i className="bi bi-trash3" /> Delete
                        </Button>
                      </Col>
                      <Col>Make default / Is default</Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}

            <Modal
              size="lg"
              show={showAddressModal}
              onHide={handleModalClose}
            >
              <Form noValidate onSubmit={formik.handleSubmit}>
                <Modal.Header>
                  <Modal.Title>{editAddressId ? "Edit" : "Add"} Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group className="mb-3" controlId="formRegister.name">
                    <Form.Label>Full Name:</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      {...formik.getFieldProps("name")}
                      isInvalid={formik.touched.name && formik.errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formRegister.street">
                    <Form.Label>Street:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Street name, number, Apt/Suite, ..."
                      name="street"
                      {...formik.getFieldProps("street")}
                      isInvalid={formik.touched.street && formik.errors.street}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.street}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="formRegister.city">
                      <Form.Label>City:</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        {...formik.getFieldProps("city")}
                        isInvalid={formik.touched.city && formik.errors.city}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="formRegister.province"
                    >
                      <Form.Label>Province:</Form.Label>
                      <Form.Control
                        type="text"
                        name="province"
                        {...formik.getFieldProps("province")}
                        isInvalid={formik.touched.province && formik.errors.province}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.province}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="formRegister.postal">
                      <Form.Label>Postal Code:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="A1A 2B2"
                        name="postal"
                        {...formik.getFieldProps("postal")}
                        isInvalid={formik.touched.postal && formik.errors.postal}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.postal}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    type="reset"
                    onClick={handleModalClose}
                    disabled={formik.isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    Submit
                  </Button>
                  {submissionError !== "" && (
                    <Alert variant="danger" className="mt-3">
                      {submissionError}
                    </Alert>
                  )}
                </Modal.Footer>
              </Form>
            </Modal>
          </>
        )}
      </Row>
    </div>
  );
}
