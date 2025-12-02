import api from "./api";

const productService = {
  // Get all products with filters
  getProducts: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/products?${queryParams}`);
  },

  // Get single product
  getProduct: (id) => api.get(`/products/${id}`),

  // Get featured products
  getFeaturedProducts: (limit = 8) =>
    api.get(`/products/featured?limit=${limit}`),

  // Get new arrivals
  getNewArrivals: (limit = 8) =>
    api.get(`/products/new-arrivals?limit=${limit}`),

  // Get products by category
  getProductsByCategory: (categorySlug) =>
    api.get(`/products/category/${categorySlug}`),

  // Get related products
  getRelatedProducts: (productId) => api.get(`/products/${productId}/related`),

  // Search products
  searchProducts: (query) => api.get(`/products/search?q=${query}`),

  // Get categories
  getCategories: () => api.get("/categories"),

  // Get brands
  getBrands: () => api.get("/products/brands"),
};

export default productService;
