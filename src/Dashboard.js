import { Button, Card, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SERVER_URL } from "./config"
import { selectDecodedToken, selectToken } from "./app/tokenSlice";

export function Dashboard() {
  const token = useSelector(selectToken);
  const decodedToken = useSelector(selectDecodedToken);

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
        <Card.Body>
          <p>{decodedToken.email}</p>
          <p>{decodedToken.exp}</p>
          <p><Link to="/AddProduct">Add New Product</Link></p>
          <p><Link to="/AddFeaturedSet">Add Featured Set</Link></p>
          <Button onClick={handleSubmit}>Are You Admin</Button>
        </Card.Body>
      </Card>
    </Container>
  </div>);
}