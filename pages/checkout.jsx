import { PROD_TYPES } from "@/config";
import useCardsFromCollection from "@/services/cache/useCardsFromCollection";
import useProductsFromCollection from "@/services/cache/useProductsFromCollection";
import useUserProfile from "@/services/cache/useUserProfile";
import { selectCart } from "@/services/store/cartSlice";
import { selectToken } from "@/services/store/tokenSlice";
import { Cloudinary } from "@cloudinary/url-gen";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row, Spinner, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

export default function Checkout({ ...props }) {
  const router = useRouter();
  const cart = useSelector(selectCart);
  const token = useSelector(selectToken);
  const userProfile = useUserProfile(token);
  const identifiers = cart.filter((item) => (item.type === "single")).map((item) => ({id: item.id}));
  const cards = useCardsFromCollection({ identifiers });
  const productIdList = cart.filter((item) => (item.type === "sealed")).map((item) => item.id);
  const sealed = useProductsFromCollection({ productIdList });
  const [cartTotal, setCartTotal] = useState();
  const [orderProducts, setOrderProducts] = useState();
  const [shippingAddressId, setShippingAddressId] = useState(userProfile.data?.defaultAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    }
  });

  /** @type {import("react").FormEventHandler} */
  const checkout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if(!token) {
      console.log("You must be logged in");
      setIsSubmitting(false);
      return;
    }

    /* ********** TODO: implement choose address at checkout ********** */
    let address = shippingAddressId ? 
      userProfile.data?.address.find((thisAddress) => thisAddress._id === shippingAddressId) : 
      userProfile.data?.address?.[userProfile.data?.defaultAddress];
    let order = {
      date: new Date(),
      address,
      products: orderProducts
    }
    // console.log(order);
    const response = await UsersApiService.checkoutOrder(order, token);

    if (response.status === 201 || response.data?.success) {
      dispatch(emptyCart());
      router.push(`/account?view=orders`);
    } else {
      console.log(response.data?.message);
      setIsSubmitting(false);
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

  return (<div className="Checkout">
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
            <Table striped>
              <tbody>
                {orderProducts?.map((item, i) => 
                  <tr key={i}>
                    <td>
                      <Image 
                        src={(() => {
                          switch (item.prodType) {
                            case PROD_TYPES.SINGLE:
                              let card = cards.data.find((card) => card.id === item.prod_id);
                              return card.image_uris ? card.image_uris.normal : card.card_faces[0].image_uris.normal;
                            case PROD_TYPES.SEALED:
                              return cld.image(sealed.data.find((product) => product._id === item.prod_id).image).toURL();
                            default:
                              return "";
                          }
                        })()} 
                        width="100" 
                        alt={item.name} 
                        loading="lazy" 
                      />
                    </td>
                    <td>
                      <p><strong>{item.name}</strong></p>
                      <p>{item.cardSet}</p>
                    </td>
                    <td>
                      {item.qty}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {item.price} $
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {(item.price * item.qty).toFixed(2)} $
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <Row className="m-1 p-2 border-bottom">
              <Col><h3>Cart Total</h3></Col>
              <Col className="col-lg-auto">{cartTotal}$</Col>
            </Row>
            <div className="d-flex justify-content-around">
              <Button variant="secondary" onClick={() => {router.push("/cart")}}>Go back to Your Cart</Button>
              <Button variant="primary" onClick={checkout} disabled={isSubmitting}>Complete your Order</Button>
            </div>
          </Card.Body>
        </Card>
      </>}
    </Container>
  </div>);
}