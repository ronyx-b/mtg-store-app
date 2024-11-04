import CartCardItem from "@/components/Cart/CartCardItem";
import CartProductItem from "@/components/Cart/CartProductItem";
import UsersApiService from "@/services/apis/usersApiService";
import useCardsFromCollection from "@/services/cache/useCardsFromCollection";
import useProductsFromCollection from "@/services/cache/useProductsFromCollection";
import useUserProfile from "@/services/cache/useUserProfile";
import { emptyCart, selectCart } from "@/services/store/cartSlice";
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
  const identifiers = cart.filter((item) => (item.type === "single")).map((item) => ({id: item.id}));
  const cards = useCardsFromCollection({ identifiers });
  const productIdList = cart.filter((item) => (item.type === "sealed")).map((item) => item.id);
  const sealed = useProductsFromCollection({ productIdList });
  const [cartTotal, setCartTotal] = useState();
  const [orderProducts, setOrderProducts] = useState();
  const [emptyCartModal, setEmptyCartModal] = useState(false);
  const dispatch = useDispatch();
  const userProfile = useUserProfile(token);

  const handleClose = () => setEmptyCartModal(false);
  const handleShow = () => setEmptyCartModal(true);

  const emptyShoppingCart = () => {
    dispatch(emptyCart());
    handleClose();
  };

  const checkout = async () => {
    if(!token) {
      console.log("You must be logged in");
      return;
    }

    let address = userProfile.data?.address?.[userProfile.data?.defaultAddress];
    let order = {
      date: new Date(),
      address,
      products: orderProducts
    }
    console.log(order);
    const response = await UsersApiService.checkoutOrder(order, token);

    if (response.status === 201 || response.data?.success) {
      dispatch(emptyCart());
      router.push(`/account?view=orders`);
    }
    /* ********** TODO: implement error message handling for checkout error ********** */
  };

  useEffect(() => {
    if (cards.data && sealed.data) {
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
            product.price = parseFloat(cards.data?.find((card) => (card.id === item.id))?.prices.usd);
            product.cardSet = cards.data?.find((card) => (card.id === item.id))?.set_name;
            break;
          case "sealed":
            product.price = parseFloat(sealed.data?.find((prod) => (prod._id === item.id))?.price);
            product.cardSet = sealed.data?.find((prod) => (prod._id === item.id))?.cardSet;
            break;
          case "accessory":
            /* ********** TODO: implement accessory product type support ********** */
            break;
          default:
            product.price = 0;
            break;
        }
        return product;
      });
      setOrderProducts(products);
      let total = products.reduce((total, item) => { 
        return total += (item.price * item.qty); 
      }, 0)
      setCartTotal(total.toFixed(2));
    }

  }, [cart, cards.data, sealed.data]);

  return (
    <div className="Cart" {...props}>
      <Container className="Cart">
        {cards.isLoading || sealed.isLoading || userProfile.isLoading ? <>
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
                <CartProductItem key={item.id} item={item} product={sealed.data?.find((product) => (product._id === item.id))} />
              )}
              {cart.filter((item) => (item.type === "single")).map((item) => 
                <CartCardItem key={item.id} item={item} card={cards.data?.find((card) => (card.id === item.id))} />
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