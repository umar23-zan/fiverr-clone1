import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from './components/LandingPage'
import Dashboard from "./components/Dashboard";
// import Messaging from "./components/Messaging";
import GigManagement from "./components/GigManagement";
import Login from './components/Login';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import ChatApp from "./components/ChatApp";
// import Gigs from './components/Gigs';
import Profile from "./components/Profile";
import GidDetail from "./components/GidDetail";
import SearchResults from "./components/SearchResults";
import LandingPageResults from './components/LandingPageResults';
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import PaymentGateway from "./components/PaymentGateway";
import Orders from "./components/Orders";
import OrderDetails from "./components/OrderDetails"
import OrderReview from "./components/OrderReview";
import DeliveryPage from "./components/DeliveryPage";
import OrderDetailsSeller from "./components/OrderDetailsSeller";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landingsearchResults" element={<LandingPageResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgetpassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <Messaging />
              </ProtectedRoute>
            } 
          /> */}
          <Route 
            path="/chatapp" 
            element={
              <ProtectedRoute>
                <ChatApp />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/gig" 
            element={
              <ProtectedRoute>
                <GigManagement />
              </ProtectedRoute>
            } 
          />
          {/* <Route 
            path="/gigs" 
            element={
              <ProtectedRoute>
                <Gigs />
              </ProtectedRoute>
            } 
          /> */}
          <Route 
            path="/gigdetail/:id" 
            element={
              <ProtectedRoute>
                <GidDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/paymentGateway" 
            element={
              <ProtectedRoute>
                <PaymentGateway />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders/buyer/:buyerId"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders/freelancer/:freelancerId"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ordersdetails/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ordersdetailsSeller/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetailsSeller />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orderreview"
            element={
              <ProtectedRoute>
                <OrderReview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/deliverypage"
            element={
              <ProtectedRoute>
                <DeliveryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/searchResults" 
            element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
