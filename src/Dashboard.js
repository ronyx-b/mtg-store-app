import React from "react";

export function Dashboard(props) {
  let token = props.token;
  let decodedToken = props.decodedToken;

  return (
    <div className="Dashboard">
      <h1>Admin Dashboard</h1>
      <p>{decodedToken?.email}</p>
      {decodedToken.exp}
    </div>
  );
}