import React, { useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { CartItem } from "./CartItem";
import shoppingCart from "./shoppingCart";

export function Cart(props) {
  const [cart, setCart] = useState(shoppingCart.getCart());
  const [cartTotal, setCartTotal] = useState(0);
  const [emptyCartModal, setEmptyCartModal] = useState(false);

  const handleClose = () => setEmptyCartModal(false);
  const handleShow = () => setEmptyCartModal(true);

  const emptyCart = () => {
    setCart(shoppingCart.emptyCart());
    handleClose();
  };

  const addToCartTotal = (add) => {
    setCartTotal((total) => total + add)
  };

  const adjustCart = (item, qty) => {
    setCart(shoppingCart.adjustCart(item, qty));
  };

  return (<div className="Cart">
    <Card className="m-4">
      <Card.Header>
        <h1 className="cardHeader">Shopping Cart</h1>
      </Card.Header>
      <Container className="p-3">
      {(cart && cart.length > 0)?
        <>
        {shoppingCart.getCart().map((item, i) => 
          <CartItem key={i} item={item} index={i} adjustCart={adjustCart} addToTotal={addToCartTotal} />
        )}
        <Row className="m-1 p-2 border-bottom">
          <Col><h3>Cart Total</h3></Col>
          <Col className="col-lg-auto">{cartTotal}$</Col>
        </Row>
        <div className="d-flex justify-content-around">
          <Button variant="primary">Checkout</Button>
          <Button variant="secondary" onClick={handleShow}>Empty Your Cart</Button>
        </div>
        
        <Modal show={emptyCartModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Empty Shopping Cart</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to empty your shopping cart?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={emptyCart}>
              Empty Cart
            </Button>
          </Modal.Footer>
        </Modal>
        </>
        :<div className="text-center">Your shopping cart is empty</div>
      }
      </Container>
    </Card>
  </div>);
}
