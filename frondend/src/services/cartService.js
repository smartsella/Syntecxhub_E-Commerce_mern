import api from "./api";

const cartService = {
  getCart: () => api.get("/cart"),

  addToCart: (productId, quantity, options = {}) =>
    api.post("/cart/items", { productId, quantity, ...options }),

  updateQuantity: (itemId, quantity) =>
    api.put(`/cart/items/${itemId}`, { quantity }),

  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),

  clearCart: () => api.delete("/cart"),

  applyCoupon: (couponCode) => api.post("/cart/coupon", { code: couponCode }),

  removeCoupon: () => api.delete("/cart/coupon"),
};

export default cartService;
