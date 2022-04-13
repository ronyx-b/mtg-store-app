import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SERVER_URL } from "./config"

export function Dashboard(props) {
  let token = props.token;
  let decodedToken = props.decodedToken;

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

  return (
    <div className="Dashboard">
      <Container>
        <h1>Admin Dashboard</h1>
        <p>{decodedToken?.email}</p>
        <p>{decodedToken.exp}</p>
        <p><Link to="/AddProduct">Add New Product</Link></p>
        <Button onClick={handleSubmit}>Are You Admin</Button>
      </Container>
    </div>
  );
}