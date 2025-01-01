import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header'
import HeaderBuy from './HeaderBuy';
import './Orders.css'

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem('userId');
  const userRole=localStorage.getItem('userRole')
  const { freelancerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      if(userRole === 'Buyer'){
        const response = await axios.get(`/api/orders/buyer/${userId}`);
      setOrders(response.data);
      console.log(response.data)
      }else{
        const response = await axios.get(`/api/orders/freelancer/${freelancerId}`);
      setOrders(response.data);
      console.log(response.data)
      }
      
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    }finally {
      setLoading(false);
    }
  };
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;
  console.log(orders)

  const NoOrderMessage = ({userRole}) =>(
    <div className="no-orders">
    <h3>No Orders Yet</h3>
    <p>
      {userRole === 'Buyer'
        ? 'When you place orders, they will appear here.'
        : 'When a Buyer places an order, it will appear here.'}
    </p>
  </div>
  );

  const OrderCard = ({order}) => (
    
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">
                  Order #{order._id.slice(-6)}
                </span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="order-details">
                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span className={`order-status status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Amount</span>
                  <span className="amount">${order.amount}</span>
                </div>
              </div>
            </div>   
  )

  return (
    <div>
      {userRole==="Buyer" ? (<Header/>): (<HeaderBuy />)}
    <div className="orders-page">
      
      <div className="orders-header">
        <h2>My Orders</h2>
      </div>
      
      {orders.length === 0 ? (
        <NoOrderMessage userRole={userRole} />
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
    </div>
  );
};


export default Orders;