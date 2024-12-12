import React, { useState, useEffect } from "react";
// import Gigs from "./Gigs";
import Profile from "./Profile";
import Header from './Header';
import GigManagement from "./GigManagement";
import account from '../images/account-icon.svg'
// import './Dashboard.css'

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const email = localStorage.getItem('userEmail')

  useEffect(() => {
    // Fetch user data from API
    fetch(`/api/auth/user/${email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetch result:", data); // Log the fetched data
        setUser(data);
        setIsSeller(data.role === "Seller" || data.role === "Both");
        setIsBuyer(data.role === "Buyer" || data.role === "Both");
      });
  }, []);

  return (
    <div>
      <Header />
      <h1>Welcome, {user?.name}</h1>
      {isSeller && (
        // <div className="user-container">
        //   <div className="user-info-container">
        //   <div>
        //       <img src={user.profilePicture || account} alt="Profile-pic" width={"100px"} height={"100px"}/>
        //       <p>{user.name}</p>
        //   </div>
        //   <div>
        //     {user.country ? (<p>Located in {user.country}</p>):("")}
        //     <p>Joined in December 2024</p>
        //   </div>
        //   <div>
        //     {user.language ? (<p>{user.language} - Conversational</p>): ('')}
            
        //   </div>
        //   </div>
          
        //   <Gigs/>
        
        // </div>
        <Profile />
      )}
      {isBuyer && (
        <div>
          <GigManagement />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
