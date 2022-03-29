import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "./config"
import { 
  validateFName, 
  validateLName, 
  validateAddress, 
  validateCity, 
  validatePostal,
  checkNullEmail, 
  validateEmail, 
  checkNullPassword, 
  validatePassword, 
  validatePasswordConfirm 
} from "./formValidation";

export function Register() {
  const [formFields, setFormFields] = useState({ firstName: "", lastName: "", address: "", city: "", postal: "", email: "", password: "", password2: "" });
  const [formErrors, setFormErrors] = useState({ isValid: true, firstName: "", lastName: "", email: "", address: "", city: "", postal: "", password: "", passwordConfirm: "" }); 
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
      firstName: "", 
      lastName: "", 
      email: "", 
      address: "", 
      city: "", 
      postal: "", 
      password: "", 
      passwordConfirm: ""
    };
    errors.firstName += validateFName(formData.firstName);
    errors.lastName += validateLName(formData.lastName);
    errors.email += checkNullEmail(formData.email);
    errors.email += validateEmail(formData.email);
    errors.address += validateAddress(formData.address);
    errors.city += validateCity(formData.city);
    errors.postal += validatePostal(formData.postal);
    errors.password += checkNullPassword(formData.password);
    errors.password += validatePassword(formData.password);
    errors.passwordConfirm += validatePasswordConfirm(formData.password, formData.password2);
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
    <Card style={{ margin: '20px' }}>
      
      <Card.Header>
        <h1 className="cardHeader">Register new user</h1>
      </Card.Header>
      <Container style={{ padding: '10px' }}>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="formRegister.firstName">
              <Form.Label>First Name:</Form.Label>
              <Form.Control type="text" name="firstName" value={formFields.firstName} onChange={handleChange} isInvalid={formErrors.firstName !== ""} />
              <Form.Control.Feedback type="invalid">
                {formErrors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formRegister.lastName">
              <Form.Label>Last Name:</Form.Label>
              <Form.Control type="text" name="lastName" value={formFields.lastName} onChange={handleChange} isInvalid={formErrors.lastName !== ""} />
              <Form.Control.Feedback type="invalid">
                {formErrors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" controlId="formRegister.address">
            <Form.Label>Address:</Form.Label>    
            <Form.Control type="text" placeholder="Street name, number, Apt/Suite, ..." name="address" value={formFields.address} onChange={handleChange} isInvalid={formErrors.address !== ""} />
            <Form.Control.Feedback type="invalid">
              {formErrors.address}
            </Form.Control.Feedback>
          </Form.Group>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="formRegister.city">
              <Form.Label>City:</Form.Label>
              <Form.Control type="text" name="city" value={formFields.city} onChange={handleChange} isInvalid={formErrors.city !== ""} />
              <Form.Control.Feedback type="invalid">
                {formErrors.city}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formRegister.postal">
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
          <Button variant="primary" type="submit" style={{ display: 'block', margin: 'auto' }} disabled={isSubmitted}>
            Submit
          </Button>
          {submissionError !== "" && <Alert variant="danger" className="mt-3">{submissionError}</Alert>}
        </Form>
      </Container>
    </Card>
  </div>);
}