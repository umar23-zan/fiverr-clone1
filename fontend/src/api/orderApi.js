export const getOrders = async (type) => {
  const url = type === "seller" ? "/api/orders/freelancer/123" : "/api/orders/buyer/456";
  const res = await fetch(url);
  return res.json();
};
