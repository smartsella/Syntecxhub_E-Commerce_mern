import api from "./api";

const adminService = {
  // Product Management
  createProduct: (productData) => api.post("/admin/products", productData),

  updateProduct: (productId, productData) =>
    api.put(`/admin/products/${productId}`, productData),

  deleteProduct: (productId) => api.delete(`/admin/products/${productId}`),

  // Order Management
  getAllOrders: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/admin/orders?${queryParams}`);
  },

  updateOrderStatus: (orderId, status) =>
    api.put(`/admin/orders/${orderId}`, { status }),

  // Dashboard Stats
  getDashboardStats: () => api.get("/admin/dashboard/stats"),
};

export default adminService;
