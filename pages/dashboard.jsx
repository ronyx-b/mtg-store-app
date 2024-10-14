import useIsAdmin from "@/services/cache/useIsAdmin";
import { selectDecodedToken } from "@/services/store/tokenSlice";
import useAdminAccess from "@/services/useAdminAccess";
import { useRouter } from "next/router";
import { Card, Container, ListGroup, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function Dashboard({ ...props }) {
  const router = useRouter();
  const decodedToken = useSelector(selectDecodedToken);
  const { isAdmin, isAdminAccessLoading } = useAdminAccess();

  return (<div className="Dashboard" { ...props }>
    {isAdminAccessLoading ? <>
      <Spinner animation="border" role="status" style={{ display: "block", margin: "5rem auto" }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </> : <>
      {isAdmin && <>
        <Container>
          <Card className="my-3">
            <Card.Header>
              <h1 className="cardHeader">Admin Dashboard</h1>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="highlightHover" onClick={() => router.push("/products/add")}><i className="bi bi-tag me-2"></i> Add New Product</ListGroup.Item>
              <ListGroup.Item className="highlightHover" onClick={() => router.push("/products")}><i className="bi bi-toggles me-2"></i> Edit Product</ListGroup.Item>
              <ListGroup.Item className="highlightHover" onClick={() => router.push("/products/add-set")}><i className="bi bi-list-stars me-2"></i> Add Featured Set</ListGroup.Item>
            </ListGroup>
            <Card.Footer className="text-center">
              logged as {decodedToken.email}{decodedToken.exp && <>{` (session expires ${(new Date(decodedToken.exp * 1000)).toLocaleString()})`}</>}
            </Card.Footer>
          </Card>
        </Container>
      </>}
    </>}
  </div>);
}