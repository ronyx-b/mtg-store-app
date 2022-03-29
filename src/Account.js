import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import { SERVER_URL } from "./config"

export function Account(props) {
  const [accountInfo, setAccountInfo] = useState();
  const navigate = useNavigate();
  const token = props.token;
  const tokenObj = jwt_decode(token);

  const getAccountInfo = async () => {
    let requestString = `${SERVER_URL}/api/user/account`;
    try {
      let response = await fetch(requestString, { 
        method: 'GET',
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
        console.log(tokenObj.email);
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
      Account Info: {accountInfo}
    </div>
  );
}