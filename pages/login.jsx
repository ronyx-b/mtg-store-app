import UsersApiService from "@/services/apis/usersApiService";
import { setToken } from "@/services/store/tokenSlice";
import { Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

export default function Login({ ...props }) {
  const [loginError, setLoginError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const initialValues = {
    email: "", 
    password: "", 
    keepLogged: false,
  };

  const schema = Yup.object().shape({
    email: Yup.string().email().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "email format invalid"),
    password: Yup.string().required().max(50),
  });

  /** @type {React.FormEventHandler} */
  const handleSubmit = async (values = initialValues, { setSubmitting }) => {
    console.log(values);

    try {      
      const response = await UsersApiService.loginUser(values);
      if (!!response?.data?.token && response.data.token !== "") {
        dispatch(setToken(response.data.token));
        router.push('/account');
      } else {
        setSubmitting(false);
        console.log(response);      }
    } catch (error) {
      setSubmitting(false);
      setLoginError(error.response.data.error);
      console.log(error.response.data.error);
    }
  };

  return (<div className="Login">
    <Card className="my-4 mx-auto" style={{maxWidth: '540px'}}>
      <Card.Header>
        <h1 className="cardHeader">Login</h1>
      </Card.Header>
      <Container className="p-3">
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          validateOnBlur={true}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isValid ,isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email"
                  placeholder="Enter email" 
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.email && errors.email}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  name="password" 
                  placeholder="Password" 
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.password && errors.password}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check 
                  type="checkbox" 
                  name="keepLogged" 
                  value={true} 
                  label="Keep me logged in" 
                  checked={values.keepLogged}
                  onChange={handleChange} 
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="d-block mx-auto" disabled={!isValid || isSubmitting}>
                Submit
              </Button>
              {loginError !== "" && <Alert variant="danger" className="mt-3">{loginError}</Alert>}
            </Form>
          )}
        </Formik>
      </Container>
    </Card>
  </div>);
}