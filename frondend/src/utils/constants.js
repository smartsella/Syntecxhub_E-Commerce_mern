export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const CATEGORIES = [
  { id: 1, name: "Electronics", slug: "electronics", icon: "💻" },
  { id: 2, name: "Fashion", slug: "fashion", icon: "👕" },
  { id: 3, name: "Home & Garden", slug: "home", icon: "🏠" },
  { id: 4, name: "Sports", slug: "sports", icon: "⚽" },
  { id: 5, name: "Books", slug: "books", icon: "📚" },
  { id: 6, name: "Beauty", slug: "beauty", icon: "💄" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "rating", label: "Highest Rated" },
];

export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const ORDER_STATUS_COLORS = {
  pending: "badge-warning",
  processing: "badge-info",
  shipped: "badge-primary",
  delivered: "badge-success",
  cancelled: "badge-error",
};

export const PAYMENT_METHODS = [
  { value: "credit_card", label: "Credit Card", icon: "💳" },
  { value: "paypal", label: "PayPal", icon: "💰" },
  { value: "cash_on_delivery", label: "Cash on Delivery", icon: "💵" },
];
