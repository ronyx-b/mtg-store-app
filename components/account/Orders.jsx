import useUserOrders from "@/services/cache/useUserOrders";
import { selectToken } from "@/services/store/tokenSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Modal, Pagination, Spinner, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import OrderDetails from "./OrderDetails";

export default function Orders({ ...props }) {
  const router = useRouter();
  const { orderId, page } = router.query;
  const pageNum = page ? Number(page) : 1;
  const pageSize = 10;
  const token = useSelector(selectToken);
  const orders = useUserOrders(token, { pageNum, pageSize });
  const totalPages = orders.data ? Math.ceil(orders.data.count / pageSize) : 1;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const closeModal = () => {
    router.push({ 
      pathname: router.pathname, 
      query: (() => {
        delete router.query.orderId
        return router.query;
      })() 
    });
  }

  return (<div className="Orders">
    {orders.isLoading ? <>
      <Spinner animation="border" role="status" style={{ display: "block", margin: "5rem auto" }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </> : <>
      <Table striped>
        <thead>
          <tr>
            <th className="text-center">Order #</th>
            <th className="text-center">Date</th>
            <th className="text-center">Delivery Address</th>
            <th className="text-center"># of Items</th>
            <th className="text-center">Order total</th>
          </tr>
        </thead>
        <tbody>
          {orders.data?.orders?.map((order) => 
          <tr key={order._id}>
            <td><Link href={{ pathname: router.pathname, query: { ...router.query, orderId: order._id } }}>{order.number}</Link></td>
            <td className="text-center">{(new Date(order.date)).toDateString()}</td>
            <td className="text-center">{`${order.address.street}, ${order.address.city}, ${order.address.province}, ${order.address.postal}`}</td>
            <td className="text-center">{order.products?.reduce((total, product) => (total + product.qty), 0)}</td>
            <td style={{ textAlign: "right" }}>{order.products?.reduce((total, product) => total + (product.qty * product.price), 0).toFixed(2)} $</td>
          </tr>
          )}
        </tbody>
      </Table>

      <div className="d-block mx-auto" style={{width: "fit-content"}}>
        <Pagination>
          <Pagination.Prev 
            onClick={() => { 
              router.push({ pathname: router.pathname, query: { ...router.query, page: pageNum - 1 } }) 
            }} 
            disabled={pageNum === 1} 
          />  
          {pages.map((thisPage, i) => {
            if (pages.length > 7) {
              if (thisPage < pageNum - 1 && thisPage > 1) {
                if (pageNum > 4) {
                  if (thisPage === 2) {
                    return (<Pagination.Ellipsis key={i} />);
                  } else if (!(pageNum > pages.length - 4 && thisPage > pages.length - 5)) {
                    return null;
                  }
                } 
              } else if (thisPage > pageNum + 1 && thisPage < pages.length) {
                if (pageNum < pages.length - 3) {
                  if (thisPage === pages.length - 1) {
                    return (<Pagination.Ellipsis key={i} />);
                  } else if (!(pageNum < 5 && thisPage < 6)) {
                    return null;
                  }
                } 
              }
            }
            return (
              <Pagination.Item 
                key={i} 
                active={thisPage === pageNum} 
                onClick={() => { 
                  router.push({ pathname: router.pathname, query: { ...router.query, page: thisPage } }) 
                }}
              >
                {thisPage}
              </Pagination.Item>
            );
          })}
          <Pagination.Next 
            onClick={() => { 
              router.push({ pathname: router.pathname, query: { ...router.query, page: pageNum + 1 } }) 
            }} 
            disabled={pageNum === totalPages}
          />
        </Pagination>
      </div>

      <Modal 
        size="lg" 
        show={orderId && orderId !== ""}
        onHide={closeModal}
      >
        <Modal.Header>
          <Modal.Title>Order #{orderId && orderId !== "" && orders.data.orders.find((order) => order._id === orderId)?.number} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OrderDetails />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>}
  </div>);
}