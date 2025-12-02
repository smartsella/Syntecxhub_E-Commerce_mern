import api from "./api";

const orderService = {
  createOrder: (orderData) => api.post("/orders", orderData),

  getOrders: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/orders?${queryParams}`);
  },

  getOrder: (orderId) => api.get(`/orders/${orderId}`),

  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),
};

export default orderService;
