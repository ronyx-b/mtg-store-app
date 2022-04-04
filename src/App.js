import React, { useEffect, useState } from 'react';
import { Button, Container, Nav, Navbar, Form, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { DecklistProcessor } from './DecklistProcessor';
import { CardSearch } from './CardSearch';
import { Home } from './Home';
import { Login } from './Login';
import { NotFound } from './NotFound';
import { Products } from './Products';
import { Register } from './Register';
import { Account } from './Account';
import { Dashboard } from './Dashboard';
import { useToken } from './useToken';
import shoppingCart from './shoppingCart'
import { Cart } from './Cart';


function App() {
  const [searchString, setSearchString] = useState('');
  const {token, setToken} = useToken();
  const decodedToken = (token)?jwt_decode(token):null;
  const navigate = useNavigate();
  const logout = () => {
    setToken();
    navigate('/');
  }

  useEffect(() => {
    if (decodedToken?.exp) {
      let tokenExpires = decodedToken.exp * 1000;
      let now = (new Date()).valueOf();
      if (tokenExpires < now) {
        setToken();
      }
    }
  },[decodedToken?.exp, setToken]);
  
  const handleSubmit = function(e) {
    e.preventDefault();
    navigate(`/CardSearch?search=${searchString}`);
    setSearchString('');
  }

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" sticky="top" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>MTG Store</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/Products"><Nav.Link>Products</Nav.Link></LinkContainer>
              <LinkContainer to="/CardSearch"><Nav.Link>CardSearch</Nav.Link></LinkContainer>
              <LinkContainer to="/Decklist"><Nav.Link>Buy Decklist</Nav.Link></LinkContainer>
              {!token && <LinkContainer to="/Register"><Nav.Link>Register</Nav.Link></LinkContainer>}
              {!token && <LinkContainer to="/Login"><Nav.Link>Login</Nav.Link></LinkContainer>}
              {token && <LinkContainer to="/Account"><Nav.Link>Account</Nav.Link></LinkContainer>}
              {decodedToken?.isAdmin && <LinkContainer to="/Dashboard"><Nav.Link>Dashboard</Nav.Link></LinkContainer>}
              <LinkContainer to="/Cart"><Nav.Link>Shopping Cart</Nav.Link></LinkContainer>
              {token && <Nav.Link onClick={logout}>Log out</Nav.Link>}
            </Nav>
            <Form className="d-flex" onSubmit={handleSubmit}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                value={searchString}
                onChange={(e) => {setSearchString(e.target.value)}}
                aria-label="Search"
              />
              <Button type="submit" variant="primary">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Products" element={<Products />} />
              <Route path="/CardSearch" element={<CardSearch shoppingCart={shoppingCart} />} />
              <Route path="/Register" element={(token)?<Navigate to="/Account" />:<Register />} />
              <Route path="/Login" element={(token)?<Navigate to="/Account" />:<Login setToken={setToken} />} />
              <Route path="/Account" element={(token)?<Account token={token} decodedToken={decodedToken} />: <Navigate to="/Login" />} />
              <Route path="/Dashboard" element={(decodedToken?.isAdmin)?<Dashboard token={token} decodedToken={decodedToken} />: <Navigate to="/" />} />
              <Route path="/Cart" element={<Cart shoppingCart={shoppingCart} />} />
              <Route path="/Decklist" element={<DecklistProcessor />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
