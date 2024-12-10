import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
// import Header from './components/Header';
import Dashboard from "./components/Dashboard";
import Messaging from "./components/Messaging";
import GigManagement from "./components/GigManagement";
import Orders from "./components/Orders";
import Login from './components/Login'
import Signup from './components/Signup'
import ResetPassword from './components/ResetPassword'
import ForgotPassword from './components/ForgotPassword'
import ChatApp from "./components/ChatApp";
import Gigs from './components/Gigs'

function App() {
  return (
    <div className="App">
      
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/messages" element={<Messaging />} />
          <Route path="/chatapp" element={<ChatApp />} />
          <Route path="gig" element={<GigManagement />} />
          <Route path="gigs" element={<Gigs />} />
          <Route path="orders" element={<Orders />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgetpassword" element={<ForgotPassword />} />
          <Route path="resetPassword" element={<ResetPassword />} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;
