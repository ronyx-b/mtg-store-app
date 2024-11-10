import useUserOrders from "@/services/cache/useUserOrders";
import useUserProfile from "@/services/cache/useUserProfile";
import { selectToken } from "@/services/store/tokenSlice";
import Link from "next/link";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function Profile({ ...props }) {
  const token = useSelector(selectToken);
  const accountInfo = useUserProfile(token);
  const currentAddress = accountInfo.data?.address?.find((thisAddress) => thisAddress._id === accountInfo.data?.defaultAddress);
  const userOrders = useUserOrders(token);

  return (<div className="Profile">
    <Card className="shadow" {...props}>
      <Card.Body>
        {accountInfo.isLoading || userOrders.isLoading ? <>
          <Spinner animation="border" role="status" style={{ display: "block", margin: "5rem auto" }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </> : <>
          <Row>
            <Col><h2>Welcome!</h2></Col>
          </Row>

          <Form noValidate onSubmit={(e) => {e.preventDefault();}}>
            <Form.Group className="mb-3" controlId="formProfile.name">
              <Form.Label>Full Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                disabled
                value={accountInfo.data?.name}
                onChange={null}
                onBlur={null}
                isInvalid={null}
              />
              {/* <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback> */}
            </Form.Group>

            <Row>
              <Form.Group as={Col} md="6" controlId="formProfile.email">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  disabled
                  value={accountInfo.data?.email}
                  onChange={null}
                  onBlur={null}
                  isInvalid={null}
                />
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="formProfile.phone">
                <Form.Label>Phone:</Form.Label>
                <Form.Control
                  type="phone"
                  name="phone"
                  disabled
                  value={accountInfo.data?.phone}
                  onChange={null}
                  onBlur={null}
                  isInvalid={null}
                />
              </Form.Group>
            </Row>

          </Form>

          <Row className="mt-3">
            <Col>
              <h3>Default Shipping Address</h3>
            </Col>
          </Row>
          <Row>
            <Col>                
              <p>{currentAddress?.street}, {currentAddress?.city}, {currentAddress?.province}, {currentAddress?.postal}</p>
            </Col>
            <Col style={{textAlign: "right"}}>
              <Link href={`/account?view=address`}>Update</Link>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <h3>Your most recent order</h3>
            </Col>
          </Row>

          <Row className="mt-3">

            {userOrders.data?.orders?.length === 0 ? <>
              <Col>
                <p>You have no orders yet.</p>
              </Col>
            </> : <>
              <Col># {userOrders.data?.orders?.[0]?.number}</Col>
              <Col>{(new Date(userOrders.data?.orders?.[0]?.date)).toDateString()}</Col>
              <Col style={{textAlign: "right"}}>{userOrders.data?.orders?.[0]?.products?.reduce((total, product) => (total + product.qty), 0)} items</Col>
              <Col style={{textAlign: "right"}}>${userOrders.data?.orders?.[0]?.products?.reduce((total, product) => total + (product.qty * product.price), 0)}</Col>
            </>}
          </Row>
        </>}
      </Card.Body>
    </Card>
  </div>);
}