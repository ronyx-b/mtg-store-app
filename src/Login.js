import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "./config"

export function Login(props) {
  const [formFields, setFormFields] = useState({email: "", password: ""})
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormFields((formFields) => {
      return {...formFields, [e.target.name] : e.target.value}
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setLoginError('');
    try {      
      let requestString = `${SERVER_URL}/api/user/login`;
      let response = await fetch(requestString, { 
        method: 'POST',
        body: JSON.stringify(formFields),
        headers: { 'Content-Type': 'application/json'} 
      });
      let json = await response.json();
      if (json.token) {
        props.setToken(json.token);
        navigate('/Account');
        // localStorage.setItem('token', json.token);
        // console.log(localStorage.getItem('token'));
      } else {
        setIsSubmitted(false);
        setLoginError(json.message);
      }
    } catch (err) {
      setIsSubmitted(false);
      console.error(err);
    }
  }

  return (<div className="Login">
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" name="email" value={formFields.email} onChange={handleChange} placeholder="Enter email" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" value={formFields.passport} onChange={handleChange} placeholder="Password" />
      </Form.Group>
      {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group> */}
      <Button variant="primary" type="submit" disabled={isSubmitted}>
        Submit
      </Button>
      {loginError !== "" && <Alert variant="danger" className="mt-3">{loginError}</Alert>}
    </Form>
  </div>);
}