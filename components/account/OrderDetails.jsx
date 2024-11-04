import { PROD_TYPES } from "@/config";
import useCardsFromCollection from "@/services/cache/useCardsFromCollection";
import useOrderDetails from "@/services/cache/useOrderDetails";
import useProductsFromCollection from "@/services/cache/useProductsFromCollection";
import { selectToken } from "@/services/store/tokenSlice";
import { Cloudinary } from "@cloudinary/url-gen";
import { useRouter } from "next/router";
import { Image, Spinner, Table } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function OrderDetails({ ...props }) {
  const router = useRouter();
  const { orderId } = router.query;
  const token = useSelector(selectToken);
  const order = useOrderDetails(orderId, token);
  const cardsCollectionIds = order.data?.products ? order.data.products.filter((item) => item.prodType === PROD_TYPES.SINGLE).map((item) => ({ id: item.prod_id })) : [];
  const cards = useCardsFromCollection({ identifiers: cardsCollectionIds });
  const productsCollectionIds = order.data?.products ? order.data.products.filter((item) => item.prodType === PROD_TYPES.SEALED).map((item) => (item.prod_id)) : [];
  const products = useProductsFromCollection({ productIdList: productsCollectionIds });

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    }
  });
  
  return (<div className="OrderDetails">
    {order.isLoading || cards.isLoading || products.isLoading ? <>
      <Spinner animation="border" role="status" style={{ display: "block", margin: "5rem auto" }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </> : <>
      <Table borderless>
        <tbody>
          <tr>
            <th>Date:</th>
            <td>{(new Date(order.data.date)).toDateString()}</td>
          </tr>
          <tr>
            <th>Shipping Address:</th>
            <td>{`${order.data.address.street}, ${order.data.address.city}, ${order.data.address.province}, ${order.data.address.postal}`}</td>
          </tr>
          <tr>
            <th>Order Total:</th>
            <td>{order.data.products?.reduce((total, product) => total + (product.qty * product.price), 0).toFixed(2)} $</td>
          </tr>
        </tbody>
      </Table>
      <Table striped>
        <tbody>
          {order.data.products.map((item, i) => 
            <tr key={i}>
              <td>
                <Image 
                  src={(() => {
                    switch (item.prodType) {
                      case PROD_TYPES.SINGLE:
                        let card = cards.data.find((card) => card.id === item.prod_id);
                        return card.image_uris ? card.image_uris.normal : card.card_faces[0].image_uris.normal;
                      case PROD_TYPES.SEALED:
                        return cld.image(products.data.find((product) => product._id === item.prod_id).image).toURL();
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
                {item.price * item.qty} $
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>}
  </div>);
}