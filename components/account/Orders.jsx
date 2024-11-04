import useUserOrders from "@/services/cache/useUserOrders";
import { selectToken } from "@/services/store/tokenSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Modal, Spinner, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import OrderDetails from "./OrderDetails";

export default function Orders({ ...props }) {
  const router = useRouter();
  const { orderId } = router.query;
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const token = useSelector(selectToken);
  const orders = useUserOrders(token, pagination);

  return (<div className="Orders">
    {orders.isLoading ? <>
      <Spinner animation="border" role="status" style={{ display: "block", margin: "5rem auto" }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </> : <>
      <Table striped>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Date</th>
            <th>Delivery Address</th>
            <th># of Items</th>
            <th>Order total</th>
          </tr>
        </thead>
        <tbody>
          {orders.data?.map((order) => 
          <tr key={order._id}>
            <td><Link href={`/account?view=orders&orderId=${order._id}`}>{order.number}</Link></td>
            <td>{(new Date(order.date)).toDateString()}</td>
            <td>{`${order.address.street}, ${order.address.city}, ${order.address.province}, ${order.address.postal}`}</td>
            <td>{order.products?.reduce((total, product) => (total + product.qty), 0)}</td>
            <td style={{ textAlign: "right" }}>{order.products?.reduce((total, product) => total + (product.qty * product.price), 0).toFixed(2)} $</td>
          </tr>
          )}
        </tbody>
      </Table>

      <Modal 
        size="lg" 
        show={orderId && orderId !== ""}
        onHide={() => {
          router.push("/account?view=orders");
        }}
      >
        <Modal.Header>
          <Modal.Title>Order #{orderId && orderId !== "" && orders.data.find((order) => order._id === orderId)?.number} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OrderDetails />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {router.push("/account?view=orders")}}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>}
  </div>);
}