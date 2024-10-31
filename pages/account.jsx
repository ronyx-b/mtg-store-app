import Profile from "@/components/account/Profile";
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
  const { view } = router.query;
  const token = useSelector(selectToken);
  const accountInfo = useUserProfile(token);
  const userOrders = useUserOrders(token);
  const currentAddress = accountInfo.data?.address?.[accountInfo.data?.defaultAddress];
  const decodedToken = useSelector(selectDecodedToken);

  const userAccountSections = [
    {
      title: "Profile",
      query: "profile",
      component: <Profile />,
    },
    {
      title: "Address Book",
      query: "address",
      component: <>Address</>,
    },
    {
      title: "Order History",
      query: "orders",
      component: <>Orders</>,
    },
    {
      title: "Change Password",
      query: "password",
      component: <>Password</>,
    },
  ];

  const SectionProvider = () => userAccountSections.find((section) => section.query === view)?.component || userAccountSections[0].component;

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  return (
    <div className="Account" {...props}>
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

            <Nav variant="tabs" defaultActiveKey="profile" activeKey={view} className="mb-3">
              {userAccountSections.map((section, i) => (
                <Nav.Item key={i}>
                  <Nav.Link 
                    as={Link} 
                    href={`/account?view=${section.query}`} 
                    eventKey={section.query} 
                  >
                    {section.title}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            <SectionProvider />

            </Card.Body>
          </Card>
        </>}
      </Container>
    </div>
  );
}