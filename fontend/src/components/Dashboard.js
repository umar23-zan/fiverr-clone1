import React, { useState, useEffect } from "react";
import GigManagement from "./GigManagement";
import Orders from "./Orders";
// import Favorites from "./Favorites";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);

  useEffect(() => {
    // Fetch user data from API
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setIsSeller(data.role === "Seller" || data.role === "Both");
        setIsBuyer(data.role === "Buyer" || data.role === "Both");
      });
  }, []);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      {isSeller && (
        <div>
          <h2>Seller Dashboard</h2>
          <GigManagement />
          <Orders type="seller" />
        </div>
      )}
      {isBuyer && (
        <div>
          <h2>Buyer Dashboard</h2>
          <Orders type="buyer" />
          {/* <Favorites /> */}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
