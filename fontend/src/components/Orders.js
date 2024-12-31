import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem('userId');
  // const { buyerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/buyer/${userId}`);
      setOrders(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    }finally {
      setLoading(false);
  };
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;
  console.log(orders)
  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2>My Orders</h2>
      </div>
      {orders.length === 0 ? (
        <div className="no-orders">
          <h3>No Orders Yet</h3>
          <p>When you place orders, they will appear here</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
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
          ))}
        </div>
      )}
    </div>
  );
};
}

export default Orders;