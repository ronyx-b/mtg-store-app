import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, Nav, Navbar, Form, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { DecklistProcessor } from './DecklistProcessor';
import { CardSearch } from './CardSearch';
import { Home } from './Home';
import { Login } from './Login';
import { NotFound } from './NotFound';
import { Products } from './Products';
import { Register } from './Register';
import { Account } from './Account';
import { Dashboard } from './Dashboard';
import { Cart } from './Cart';
import { AddEditProduct } from './AddEditProduct';
import { CardDetails } from './CardDetails';
import { ProductDetails } from './ProductDetails';
import { AddFeaturedSet } from './AddFeaturedSet';
import { useSelector, useDispatch } from 'react-redux';
import { removeToken, selectToken, selectDecodedToken } from './app/tokenSlice'
import { selectCartQty } from './app/cartSlice';

function App() {
  const [searchString, setSearchString] = useState('');
  const cartQty = useSelector(selectCartQty);
  const token = useSelector(selectToken);
  const decodedToken = useSelector(selectDecodedToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const logout = useCallback(() => {
    dispatch(removeToken());
    navigate('/');
  }, [dispatch, navigate]);

  useEffect(() => {
    if (decodedToken?.exp) {
      let tokenExpires = decodedToken.exp * 1000;
      let now = (new Date()).valueOf();
      if (tokenExpires < now) {
        logout();
      }
    }
  },[decodedToken?.exp, logout]);
  
  const handleSubmit = function(e) {
    e.preventDefault();
    navigate(`/CardSearch?search=${searchString}`);
    setSearchString('');
  }

  return (<>
    <header>
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
              <LinkContainer to="/Cart">
                <Nav.Link>
                  Cart 
                  <div className="position-relative d-inline-block">
                    <i className="bi bi-cart3"></i>
                    <div className="position-absolute rounded-circle bg-primary" style={{top: "-3px", right: "-5px", zIndex: "1", fontSize: "10px", width: "14px", height: "14px", textAlign: "center"}}>{cartQty}</div>
                  </div>
                </Nav.Link>
              </LinkContainer>
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
    </header>
    <main style={{ minHeight: "70vh" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Products" element={<Products />} >
          <Route path="/Products/:set" element={<Products />} />
        </Route>
        <Route path="/ProductDetails/:id" element={<ProductDetails />} />
        <Route path="/CardSearch" element={<CardSearch />} />
        <Route path="/CardDetails/:id" element={<CardDetails />} />
        <Route path="/Register" element={(token)?<Navigate to="/Account" />:<Register />} />
        <Route path="/Login" element={(token)?<Navigate to="/Account" />:<Login />} />
        <Route path="/Account" element={(token)?<Account />: <Navigate to="/Login" />} />
        <Route path="/Dashboard" element={(decodedToken?.isAdmin)?<Dashboard />: <Navigate to="/" />} />
        <Route path="/AddProduct" element={(decodedToken?.isAdmin)?<AddEditProduct mode="add" />: <Navigate to="/" />} />
        <Route path="/EditProduct/:id" element={(decodedToken?.isAdmin)?<AddEditProduct mode="edit" />: <Navigate to="/" />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Decklist" element={<DecklistProcessor />} />
        <Route path="/AddFeaturedSet" element={<AddFeaturedSet />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <footer className="bg-dark text-center text-lg-start text-white p-4">
      <Container>
        <Row className="d-flex flex-row justify-content-center">
          <div id="disclaimer" style={{color: "#999999", fontSize: "0.8em"}}>
            <p>This site is made solely for demonstration purposes and is not intended to actually sell any product or service.</p>
            <p>Portions of the site are unofficial Fan Content permitted under the Wizards of the Coast Fan Content Policy. The literal and graphical information presented on this site about Magic: The Gathering, including card images, the mana symbols, and Oracle text, is copyright Wizards of the Coast, LLC, a subsidiary of Hasbro, Inc. The site is not produced by, endorsed by, supported by, or affiliated with Wizards of the Coast.</p>
            <p>Card information is provided by Scryfall, LLC. Prices and promotional offers represent daily estimates and/or market values provided by their affiliates. Absolutely no guarantee is made for any price information. See stores for final prices and details.</p>
            <p>All other content &copy;{(new Date()).getFullYear()} Rony Boscan.</p>
          </div>
        </Row>
        <Row>
          <ul className="list-unstyled d-flex flex-row justify-content-center" style={{ fontSize: "1.5em" }}>
            <li>
              <a className="text-white px-3" href="https://github.com/ronyx-b">
                <i className="bi bi-github"></i>
              </a>
            </li>
            <li>
              <a className="text-white px-3" href="https://www.linkedin.com/in/ronyboscan/">
                <i className="bi bi-linkedin"></i>
              </a>
            </li>
            <li>
              <a className="text-white px-3" href="https://twitter.com/ronyx">
                <i className="bi bi-twitter"></i>
              </a>
            </li>
            <li>
              <a className="text-white px-3" href="https://portfolio-ronyx-b.vercel.app/">
                {/* <i className="bi bi-briefcase-fill"></i> */}
                <i className="bi bi-file-earmark-code-fill"></i>
              </a>
            </li>
          </ul>
        </Row>
      </Container>
    </footer>
  </>);
}

export default App;
