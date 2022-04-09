import { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "./config"

export function Login(props) {
  const [formFields, setFormFields] = useState({email: "", password: "", keeplogged: false})
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    let name = e.target.name;
    let value;
    if (e.target.type === 'checkbox') {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }
    setFormFields((formFields) => {
      return {...formFields, [name] : value}
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
      } else {
        setIsSubmitted(false);
        setLoginError(json.message);
      }
    } catch (err) {
      setIsSubmitted(false);
      console.error(err);
    }
  }

  return (
    <div className="Login">
      <Card className="my-4 mx-auto" style={{maxWidth: '540px'}}>
        <Card.Header>
          <h1 className="cardHeader">Login</h1>
        </Card.Header>
        <Container className="p-3">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" value={formFields.email} onChange={handleChange} placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formFields.passport} onChange={handleChange} placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" name="keeplogged" value="true" label="Keep me logged in" checked={formFields.keeplogged} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="d-block mx-auto" disabled={isSubmitted}>
              Submit
            </Button>
            {loginError !== "" && <Alert variant="danger" className="mt-3">{loginError}</Alert>}
          </Form>
        </Container>
      </Card>
    </div>
  );
}