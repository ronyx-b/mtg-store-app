import { useState } from "react";

export function useToken() {
  const getToken = () => {
    return localStorage.getItem('token');
  }

  const [token, setToken] = useState(getToken());
  
  const saveToken = (token) => {
    if (!token) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', token);
    }
    setToken(token);
  }

  return {
    setToken: saveToken,
    token
  };
}