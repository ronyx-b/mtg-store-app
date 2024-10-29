import useUserOrders from "@/services/cache/useUserOrders";
import useUserProfile from "@/services/cache/useUserProfile";
import { selectDecodedToken, selectToken } from "@/services/store/tokenSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Card, Container, Nav, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function Account({ ...props }) {
  const router = useRouter();
  const token = useSelector(selectToken);
  const accountInfo = useUserProfile(token);
  const userOrders = useUserOrders(token);
  const currentAddress = accountInfo.data?.address?.[accountInfo.data?.defaultAddress];
  const decodedToken = useSelector(selectDecodedToken);

  const userAccountSections = [
    {
      title: "Profile",
      handler: () => {},
    },
    {
      title: "Address Book",
      handler: () => console.log(accountInfo.data?.address),
    },
    {
      title: "Order History",
      handler: () => console.log(userOrders.data),
    },
    {
      title: "Change Password",
      handler: () => {console.log("coming soon")},
    },
  ];

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  return (
    <div className="Account">
      <Container>
        {accountInfo.isLoading || userOrders.isLoading ? <>
          <Spinner animation="border" role="status" style={{ display: "block", margin: "5rem auto" }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </> : <>
          <Card className="my-3">
            <Card.Header>
              <h1 className="cardHeader">My Account</h1>
            </Card.Header>
            <Card.Body>

            <Nav variant="tabs" defaultActiveKey="link-0">
              {userAccountSections.map((section, i) => (
                <Nav.Item key={i}>
                  <Nav.Link as={Link} href="#" eventKey="link-0" onClick={section.handler}>{section.title}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

              <p>Welcome {accountInfo.data?.email}</p>
              <div className="border border-secondary rounded">
                <h3>Default Shipping Address</h3>
                <p>{currentAddress?.street}, {currentAddress?.city}, {currentAddress?.province}, {currentAddress?.postal}</p>
                <p></p>
              </div>
            </Card.Body>
          </Card>
        </>}
      </Container>
    </div>
  );
}