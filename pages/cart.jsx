import CartCardItem from "@/components/Cart/CartCardItem";
import CartProductItem from "@/components/Cart/CartProductItem";
import { SERVER_URL } from "@/config";
import { selectCart } from "@/services/store/cartSlice";
import { selectDecodedToken, selectToken } from "@/services/store/tokenSlice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

export default function Cart({ ...props }) {
  const router = useRouter();
  const cart = useSelector(selectCart);
  const token = useSelector(selectToken);
  const decodedToken = useSelector(selectDecodedToken);
  const [cards, setCards] = useState([]);
  const [sealed, setSealed] = useState([]);
  const [cartTotal, setCartTotal] = useState();
  const [orderProducts, setOrderProducts] = useState();
  const [emptyCartModal, setEmptyCartModal] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const handleClose = () => setEmptyCartModal(false);
  const handleShow = () => setEmptyCartModal(true);

  const emptyShoppingCart = () => {
    dispatch(emptyCart());
    handleClose();
  };

  const getAccountAddress = async () => {
    let requestString = `${SERVER_URL}/api/user`;
    try {
      let response = await fetch(requestString, { 
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}` 
        } 
      });
      if (response.status >= 400) {
        router.push('/login');
      } else {
        let json = await response.json();
        return (json.user.address[json.user.defaultAddress]);
      }
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  const checkout = async () => {
    if(!token) {
      console.log("You must be logged in");
      return;
    }

    let address = await getAccountAddress()

    let order = {
      user_id : decodedToken._id,
      date: new Date(),
      address,
      products: orderProducts
    }

    console.log(order);

    let requestString = `${SERVER_URL}/api/checkout`;
    let requestOptions = { 
      method: 'POST', 
      body: JSON.stringify(order), 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}` 
      }
    };
    let response = await fetch(requestString, requestOptions);
    let json = await response.json();
    console.log(json.message);
    if (json.success) {
      dispatch(emptyCart());
    }
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

    const getOrderProducts = (data) => {
      let {cards, sealed, accessories} = data;
      let products = cart.map(item => {
        let product = {
          prodType: item.type,
          prod_id: item.id,
          name: item.name,
          cardSet: "",
          qty: item.qty,
          price: 0
        }
        switch(item.type) {
          case "single":
            product.price = cards ? parseFloat(cards.find((card) => (card.id === item.id))?.prices.usd) : 0;
            product.cardSet = cards ? cards.find((card) => (card.id === item.id))?.set_name : "";
            break;
          case "sealed":
            product.price = sealed ? parseFloat(sealed.find((prod) => (prod._id === item.id))?.price) : 0;
            product.cardSet= sealed ? sealed.find((prod) => (prod._id === item.id))?.cardSet : "";
            break;
          case "accessory":
            break;
          default:
            product.price = 0;
            break;
        }
        return product;
      });
      setOrderProducts(products);
      return products;
    };

    const calculateCartTotal = (products) => { 
      let total = products.reduce((total, item) => { 
        return total += (item.price * item.qty); 
      }, 0)
      setCartTotal(total.toFixed(2));
    };

    const loadCartData = async () => {
      let data = {};
      data.cards = await getCardsData();
      data.sealed = await getSealedData();
      data.accessories = await getAccessoriesData();
      calculateCartTotal(getOrderProducts(data));
    }

    try {
      loadCartData().then(() => {
        console.log("cart loaded");
        setIsLoading(false);
      });
    } catch (err) {
      console.error(err);
    }
  }, [cart]);

  return (
    <div className="Cart" {...props}>
      <Container className="Cart">
        {isLoading ? <>
          <Spinner animation="border" role="status" style={{ display: "block", margin: "5rem auto" }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </> : <>
          <Card className="my-3">
            <Card.Header>
              <h1 className="cardHeader">Shopping Cart</h1>
            </Card.Header>
            <Card.Body>
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
                <Button variant="primary" onClick={checkout}>Checkout</Button>
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
            </Card.Body>
          </Card>
        </>}
      </Container>
    </div>
  );
}