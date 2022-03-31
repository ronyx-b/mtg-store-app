import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "./config"
import { 
  validateName,  
  validatePostal,
  validateEmail, 
  validatePassword, 
  validatePasswordConfirm, 
  validateMinMaxLength
} from "./formValidation";

export function Register() {
  const [formFields, setFormFields] = useState({ name: "", street: "", city: "", province: "", postal: "", email: "", password: "", password2: "" });
  const [formErrors, setFormErrors] = useState({ isValid: true, name: "", email: "", street: "", city: "", province: "", postal: "", password: "", passwordConfirm: "" }); 
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormFields((formFields) => {
      return {...formFields, [e.target.name] : e.target.value}
    });
  }

  const validateRegisterForm = (formData) => {
    let errors = {
      isValid: true, 
      name: "", 
      email: "", 
      street: "", 
      city: "", 
      province: "",
      postal: "", 
      password: "", 
      passwordConfirm: ""
    };
    errors.name = validateMinMaxLength(formData.name, 'Name', errors.name, 2, 50)
    errors.name = validateName(formData.name, errors.name);
    errors.email = validateMinMaxLength(formData.email, 'Email', errors.email, 2, 50);
    errors.email = validateEmail(formData.email, errors.email);
    errors.street = validateMinMaxLength(formData.street, 'Street', errors.street, 2, 50);
    errors.city = validateMinMaxLength(formData.city, 'City', errors.city, 2, 50);
    errors.province = validateMinMaxLength(formData.province, 'Province', errors.province, 2, 50);
    errors.postal = validatePostal(formData.postal, errors.postal);
    errors.password = validateMinMaxLength(formData.password, 'Password', errors.password, 6, 50);
    errors.password = validatePassword(formData.password, errors.password);
    errors.passwordConfirm = validatePasswordConfirm(formData.password, formData.password2, errors.password);
    for (let error in errors) {
      if (error !== "isValid" && errors[error] !== "" ) {
        errors.isValid = false;
        break;
      }
    }
    return errors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setSubmissionError("");
    let errors = validateRegisterForm(formFields);
    setFormErrors(errors);
    if (!errors.isValid) {
      setIsSubmitted(false);
    } else {
      try {
        let requestString = `${SERVER_URL}/api/users`;
        let response = await fetch(requestString, { 
          method: 'POST',
          body: JSON.stringify(formFields),
          headers: { 'Content-Type': 'application/json'} 
        });
        let json = await response.json();
        if (json.success) {
          navigate('/Login');
        } else {
          setIsSubmitted(false);
          setSubmissionError(json.message);
        }
      } catch (err) {
        setIsSubmitted(false);
        setSubmissionError(err);
      }
    }
  }

  return (<div className="Register">
    <Card className="m-4">
      <Card.Header>
        <h1 className="cardHeader">Register new user</h1>
      </Card.Header>
      <Container className="p-3">
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formRegister.name">
            <Form.Label>Full Name:</Form.Label>
            <Form.Control type="text" name="name" value={formFields.name} onChange={handleChange} isInvalid={formErrors.name !== ""} />
            <Form.Control.Feedback type="invalid">
              {formErrors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRegister.street">
            <Form.Label>Street:</Form.Label>    
            <Form.Control type="text" placeholder="Street name, number, Apt/Suite, ..." name="street" value={formFields.street} onChange={handleChange} isInvalid={formErrors.street !== ""} />
            <Form.Control.Feedback type="invalid">
              {formErrors.street}
            </Form.Control.Feedback>
          </Form.Group>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="formRegister.city">
              <Form.Label>City:</Form.Label>
              <Form.Control type="text" name="city" value={formFields.city} onChange={handleChange} isInvalid={formErrors.city !== ""} />
              <Form.Control.Feedback type="invalid">
                {formErrors.city}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="formRegister.province">
              <Form.Label>Province:</Form.Label>
              <Form.Control type="text" name="province" value={formFields.province} onChange={handleChange} isInvalid={formErrors.province !== ""} />
              <Form.Control.Feedback type="invalid">
                {formErrors.province}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="formRegister.postal">
              <Form.Label>Postal Code:</Form.Label>
              <Form.Control type="text" placeholder="A1A 2B2" name="postal" value={formFields.postal} onChange={handleChange} isInvalid={formErrors.postal !== ""} />
              <Form.Control.Feedback type="invalid">
                {formErrors.postal}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <h2 className="subHeaders">Login information</h2>
          <Form.Group className="mb-3" controlId="formRegister.email">
            <Form.Label>Email address:</Form.Label>
            <Form.Control type="email" placeholder="some@email.com" name="email" value={formFields.email} onChange={handleChange} isInvalid={formErrors.email !== ""} />
            <Form.Control.Feedback type="invalid">
              {formErrors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRegister.password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name="password" value={formFields.password} onChange={handleChange} isInvalid={formErrors.password !== ""} />
            <Form.Control.Feedback type="invalid">
              {formErrors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRegister.password2">
            <Form.Label>Repeat Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name="password2" value={formFields.password2} onChange={handleChange} isInvalid={formErrors.passwordConfirm !== ""} />
            <Form.Control.Feedback type="invalid">
              {formErrors.passwordConfirm}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Your password must match exactly
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" className="d-block mx-auto" disabled={isSubmitted}>
            Submit
          </Button>
          {submissionError !== "" && <Alert variant="danger" className="mt-3">{submissionError}</Alert>}
        </Form>
      </Container>
    </Card>
  </div>);
}