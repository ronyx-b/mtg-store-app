import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "./config"
import { selectDecodedToken, selectToken } from './app/tokenSlice'

export function Account() {
  const [accountInfo, setAccountInfo] = useState();
  const [currentAddress, setCurrentAddress] = useState();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const decodedToken = useSelector(selectDecodedToken);

  useEffect(() => {
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
        if (response.status >= 400) {
          navigate('/Login');
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

    getAccountInfo().then((accountInfo) => {
      setCurrentAddress(accountInfo.address[accountInfo.defaultAddress])
    });;
  }, [navigate, token]);

  return (
    <div className="Account">
      {accountInfo && <>
        <Card className="m-4">
          <Card.Header>
            <h1 className="cardHeader">My Account</h1>
          </Card.Header>
          <Card.Body>
            <p>Welcome {decodedToken.email}</p>
            <div className="border border-secondary rounded">
              <h3>Default Shipping Address</h3>
              <p>{currentAddress?.street}, {currentAddress?.city}, {currentAddress?.province}, {currentAddress?.postal}</p>
              <p></p>
            </div>
          </Card.Body>
        </Card>
      </>}
    </div>
  );
}