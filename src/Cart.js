import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { CartItem } from "./CartItem";
import shoppingCart from "./shoppingCart";

export function Cart(props) {
  const cart = props.cart;
  const setCart = props.setCart;
  const setCartQty = props.setCartQty;
  const [cards, setCards] = useState([]);
  const [cartTotal, setCartTotal] = useState();
  const [emptyCartModal, setEmptyCartModal] = useState(false);

  const handleClose = () => setEmptyCartModal(false);
  const handleShow = () => setEmptyCartModal(true);

  const emptyCart = () => {
    setCart(shoppingCart.emptyCart());
    setCartQty(shoppingCart.getCartQty());
    handleClose();
  };

  const adjustCart = (item, qty) => {
    setCart(shoppingCart.adjustCart(item, qty));
    setCartQty(shoppingCart.getCartQty());
  };

  useEffect(() => {
    const getCardsData = async () => {
      let requestString = `https://api.scryfall.com/cards/collection`;
      let identifiers = cart.filter((item) => (item.type === "single")).map((item) => ({id: item.id}));
      if (identifiers.length === 0) {
        setCards([]);
        return [];
      }
      let cardList = { identifiers };
      let requestOptions = { 
        method: 'POST', 
        body: JSON.stringify(cardList), 
        headers: { 'Content-Type': 'application/json'}
      };
      let response = await fetch(requestString, requestOptions);
      let data = await response.json();
      setCards(data.data);
      return data.data;
    };

    const getSealedData = async () => {
      return ([]);
    };

    const getAccessoriesData = async () => {
      return ([]);
    };

    const calculateCartTotal = (data) => { 
      let cards = data.cards;
      let total = cart.reduce((total, item) => { 
        let price = 0;
        switch(item.type) {
          case "single":
            price = cards ? parseFloat(cards.find((card) => (card.id === item.id))?.prices.usd) : 0;
            break;
          case "sealed":
            break;
          case "accessory":
            break;
          default:
            price = 0;
            break;
        }
        return total += (price * item.qty); 
      }, 0)
      setCartTotal(total.toFixed(2));
    };

    const loadCartData = async () => {
      let data = {};
      data.cards = await getCardsData();
      data.sealed = await getSealedData();
      data.accessories = await getAccessoriesData();
      calculateCartTotal(data);
    }

    try {
      loadCartData().then(() => {
        console.log("cart loaded");
      });
    } catch (err) {
      console.error(err);
    }
  }, [cart]);

  return (<div className="Cart">
    <Card className="m-4">
      <Card.Header>
        <h1 className="cardHeader">Shopping Cart</h1>
      </Card.Header>
      <Container className="p-3">
      {(cart && cart.length > 0)?
        <>
        {shoppingCart.getCart().filter((item) => (item.type === "single")).map((item, i) => 
          <CartItem key={i} item={item} card={cards.find((card) => (card.id === item.id))} adjustCart={adjustCart} />
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
