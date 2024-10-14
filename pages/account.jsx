import { SERVER_URL } from "@/config";
import useIsAdmin from "@/services/cache/useIsAdmin";
import { selectDecodedToken, selectToken } from "@/services/store/tokenSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card, Container, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function Account({ ...props }) {
  const router = useRouter();
  const token = useSelector(selectToken);
  const isAdmin = useIsAdmin(token);
  const [accountInfo, setAccountInfo] = useState();
  const [currentAddress, setCurrentAddress] = useState();
  const [userOrders, setUserOrders] = useState();
  const decodedToken = useSelector(selectDecodedToken);

  useEffect(() => {
    const getAccountInfo = async () => {
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
          router.push('/Login');
        } else {
          let json = await response.json();
          setAccountInfo(json.user);
          console.log(json.message);
          return (json.user);
        }
      } catch (err) {
        console.log(err);
      }
    }

    const getOrders = async (user_id) => {
      let requestString = `${SERVER_URL}/api/user/orders`;
      try {
        let response = await fetch(requestString, { 
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}` 
          } 
        });
        if (response.status >= 400) {
          router.push('/Login');
        } else {
          let json = await response.json();
          setUserOrders(json.orders);
          return (json.orders);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getAccountInfo().then((accountInfo) => {
      setCurrentAddress(accountInfo.address[accountInfo.defaultAddress]);
      getOrders(accountInfo._id)
    });;
  }, [router, token]);

  return (
    <div className="Account">
      {accountInfo && 
      <Container>
        <Card className="my-3">
          <Card.Header>
            <h1 className="cardHeader">My Account</h1>
          </Card.Header>
          <Card.Body>

          <Nav variant="tabs" defaultActiveKey="link-0">
            <Nav.Item>
              <Nav.Link as={Link} href="#" eventKey="link-0">Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} href="#" eventKey="link-1">Address Book</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} href="#" eventKey="link-2" onClick={() => console.log(userOrders)}>
                Order History
              </Nav.Link>
            </Nav.Item>
          </Nav>

            <p>Welcome {decodedToken.email}</p>
            <div className="border border-secondary rounded">
              <h3>Default Shipping Address</h3>
              <p>{currentAddress?.street}, {currentAddress?.city}, {currentAddress?.province}, {currentAddress?.postal}</p>
              <p></p>
            </div>
          </Card.Body>
        </Card>
      </Container>}
    </div>
  );
}