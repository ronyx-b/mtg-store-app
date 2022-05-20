import { Button, Card, Container, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "./config"
import { selectDecodedToken, selectToken } from "./app/tokenSlice";

export function Dashboard() {
  const token = useSelector(selectToken);
  const decodedToken = useSelector(selectDecodedToken);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let requestString = `${SERVER_URL}/api/user/isAdmin`;
    try {
      let response = await fetch(requestString, { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}` 
        } 
      });
      if (response.status === 403) {
        console.log("Access denied");
      } else {
        let json = await response.json();
        console.log(json.isAdmin);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (<div className="Dashboard">
    <Container>
      <Card className="my-3">
        <Card.Header>
          <h1 className="cardHeader">Admin Dashboard</h1>
        </Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item className="highlightHover" onClick={() => navigate("/AddProduct")}><i className="bi bi-tag me-2"></i> Add New Product</ListGroup.Item>
          <ListGroup.Item className="highlightHover" onClick={() => navigate("/AddProduct")}><i className="bi bi-toggles me-2"></i> Edit Product</ListGroup.Item>
          <ListGroup.Item className="highlightHover" onClick={() => navigate("/AddFeaturedSet")}><i className="bi bi-list-stars me-2"></i> Add Featured Set</ListGroup.Item>
          <ListGroup.Item className="highlightHover" onClick={handleSubmit}>Check if admin</ListGroup.Item>
        </ListGroup>
        {/* <Card.Body>
          <p>{decodedToken.email}</p>
          <p>{decodedToken.exp}</p>
          <p><Link to="/AddProduct">Add New Product</Link></p>
          <p><Link to="/AddFeaturedSet">Add Featured Set</Link></p>
          <Button onClick={handleSubmit}>Are You Admin</Button>
        </Card.Body> */}
        <Card.Footer className="text-center">logged as {decodedToken.email}{decodedToken.exp && <>"(session expires {decodedToken.exp})"</>}</Card.Footer>
      </Card>
    </Container>
  </div>);
}