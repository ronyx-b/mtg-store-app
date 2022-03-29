import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export function NotFound() {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    setTimeout(() => { setRedirect(true) }, 3000);
  }, []);

  return (<>{redirect? <Navigate to="/" /> : <span>Page not found... redirecting you to the home page...</span> }</>);
}