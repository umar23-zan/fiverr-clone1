import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import Header from './Header';
import GigManagement from "./GigManagement";
import account from '../images/account-icon.svg';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(true); // State for loading indicator
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/auth/user/${email}`);
        
        if (!response.ok) {
          // Handle HTTP errors
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user data");
        }

        const data = await response.json();
        console.log("Fetch result:", data); // Log the fetched data

        setUser(data);
        setIsSeller(data.role === "Seller" || data.role === "Both");
        setIsBuyer(data.role === "Buyer" || data.role === "Both");
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading once the request is complete
      }
    };

    fetchUserData();
  }, [email]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if the API call fails
  }

  return (
    <div>
      <Header />
      <h1>Welcome, {user?.name || "Guest"}</h1>
      {isSeller && <Profile />}
      {isBuyer && <GigManagement />}
    </div>
  );
}

export default Dashboard;
