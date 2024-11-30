import useUserOrders from "@/services/cache/useUserOrders";
import { selectToken } from "@/services/store/tokenSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Modal, Spinner, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import OrderDetails from "./OrderDetails";
import PaginatedNavigation from "../PaginatedNavigation";

export default function Orders({ ...props }) {
  const router = useRouter();
  const { orderId, page } = router.query;
  const pageNum = page ? Number(page) : 1;
  const pageSize = 10;
  const token = useSelector(selectToken);
  const orders = useUserOrders(token, { pageNum, pageSize });

  const closeModal = () => {
    router.push({ 
      pathname: router.pathname, 
      query: (() => {
        delete router.query.orderId
        return router.query;
      })() 
    });
  }

  return (<div className="Orders" {...props}>
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

      <PaginatedNavigation totalCount={orders.data?.count} pageSize={pageSize} />

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