import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CartCardItem } from "./CartCardItem";
import { CartProductItem } from "./CartProductItem";
import { SERVER_URL } from "./config";
import { emptyCart, selectCart } from "./features/cart/cartSlice";
// import shoppingCart from "./shoppingCart";

export function Cart() {
  const cart = useSelector(selectCart);
  const [cards, setCards] = useState([]);
  const [sealed, setSealed] = useState([]);
  const [cartTotal, setCartTotal] = useState();
  const [emptyCartModal, setEmptyCartModal] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setEmptyCartModal(false);
  const handleShow = () => setEmptyCartModal(true);

  const emptyShoppingCart = () => {
    dispatch(emptyCart());
    handleClose();
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
      let requestString = `${SERVER_URL}/api/products/collection`;
      let products = cart.filter((item) => (item.type === "sealed")).map((item) => item.id);
      if (products.length === 0) {
        setSealed([]);
        return ([]);
      }
      let requestOptions = { 
        method: 'POST', 
        body: JSON.stringify({ products }), 
        headers: { 'Content-Type': 'application/json'}
      };
      let response = await fetch(requestString, requestOptions);
      let data = await response.json();
      // console.log(data.products);
      setSealed(data.products);
      return (data.products);
    };

    const getAccessoriesData = async () => {
      return ([]);
    };

    const calculateCartTotal = (data) => { 
      let cards = data.cards;
      let sealed = data.sealed;
      let total = cart.reduce((total, item) => { 
        let price = 0;
        switch(item.type) {
          case "single":
            price = cards ? parseFloat(cards.find((card) => (card.id === item.id))?.prices.usd) : 0;
            break;
          case "sealed":
            price = sealed ? parseFloat(sealed.find((product) => (product._id === item.id))?.price) : 0;
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
        {cart.filter((item) => (item.type === "sealed")).map((item) => 
          <CartProductItem key={item.id} item={item} product={sealed.find((product) => (product._id === item.id))} />
        )}
        {cart.filter((item) => (item.type === "single")).map((item) => 
          <CartCardItem key={item.id} item={item} card={cards.find((card) => (card.id === item.id))} />
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
            <Button variant="primary" onClick={emptyShoppingCart}>
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
