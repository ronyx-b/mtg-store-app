import UsersApiService from "@/services/apis/usersApiService";
import { Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, } from "react-bootstrap";
import * as Yup from "yup";

export default function Register({ ...props }) {
  const [submissionError, setSubmissionError] = useState("");
  const router = useRouter();

  const initialValues = {
    name: "",
    street: "",
    city: "",
    province: "",
    postal: "",
    email: "",
    password: "",
    password2: "",
  };

  const schema = Yup.object().shape({
    name: Yup.string().required().max(50),
    street: Yup.string().required().max(50),
    city: Yup.string().required().max(20),
    province: Yup.string().required().max(20),
    postal: Yup.string().required().max(10),
    email: Yup.string().email().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "email format invalid"),
    password: Yup.string().required().max(50),
    password2: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required')
  });

  /** @type {React.FormEventHandler} */
  const handleSubmit = async (values = initialValues, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const response = await UsersApiService.registerUser(values);
      // console.log(response);
      router.push("/login");
    }
    catch (error) {
      setSubmissionError(error.response.data.error);
      console.log(error.response.data.error);
    }
  };

  return (
    <div className="Register">
      <Container className="p-3">
        <Card className="m-4">
          <Card.Header>
            <h1 className="cardHeader">Register new user</h1>
          </Card.Header>
          <Card.Body className="p-4">
            <Formik
              initialValues={initialValues}
              validationSchema={schema}
              validateOnBlur={true}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isValid ,isSubmitting }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formRegister.name">
                    <Form.Label>Full Name:</Form.Label>
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
                  <Form.Group className="mb-3" controlId="formRegister.street">
                    <Form.Label>Street:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Street name, number, Apt/Suite, ..."
                      name="street"
                      value={values.street}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.street && errors.street}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.street}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="formRegister.city">
                      <Form.Label>City:</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.city && errors.city}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
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
                        value={values.province}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.province && errors.province}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.province}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="formRegister.postal">
                      <Form.Label>Postal Code:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="A1A 2B2"
                        name="postal"
                        value={values.postal}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.postal && errors.postal}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.postal}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <h2 className="subHeaders">Login information</h2>
                  <Form.Group className="mb-3" controlId="formRegister.email">
                    <Form.Label>Email address:</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="some@email.com"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.email && errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="formRegister.password"
                  >
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.password && errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="formRegister.password2"
                  >
                    <Form.Label>Repeat Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password2"
                      value={values.password2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.password2 && errors.password2}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password2}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Your password must match exactly
                    </Form.Text>
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="d-block mx-auto"
                    disabled={!isValid || isSubmitting}
                  >
                    Submit
                  </Button>
                  {submissionError !== "" && (
                    <Alert variant="danger" className="mt-3">
                      {submissionError}
                    </Alert>
                  )}
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
