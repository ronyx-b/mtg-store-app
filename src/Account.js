import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "./config"

export function Account(props) {
  const [accountInfo, setAccountInfo] = useState();
  const navigate = useNavigate();
  let token = props.token;
  let decodedToken = props.decodedToken;

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
      <p>Account Info: {accountInfo}</p>
      <p>Welcome {decodedToken.email}</p>
    </div>
  );
}