import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "./config"
import { selectDecodedToken, selectToken } from './features/token/tokenSlice'

export function Account() {
  const [accountInfo, setAccountInfo] = useState();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const decodedToken = useSelector(selectDecodedToken);

  const getAccountInfo = async () => {
    let requestString = `${SERVER_URL}/api/user/account`;
    try {
      let response = await fetch(requestString, { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}` 
        } 
      });
      if (response.status === 401) {
        navigate('/Login');
      } else {
        let json = await response.json();
        setAccountInfo(json.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAccountInfo();
  });

  return (
    <div className="Account">
      <Container>
        <p>Account Info: {accountInfo}</p>
        <p>Welcome {decodedToken.email}</p>
      </Container>
    </div>
  );
}