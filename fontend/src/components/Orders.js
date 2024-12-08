import React, { useState, useEffect } from "react";
import { getOrders } from "../api/orderApi";

function Orders({ type }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders(type).then(setOrders);
  }, [type]);

  return (
    <div>
      <h3>{type === "seller" ? "Seller Orders" : "Buyer Orders"}</h3>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            Order #{order._id} - ${order.amount} - {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
