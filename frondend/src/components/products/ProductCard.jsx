import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const ProtectCart = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While checking token
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold text-amber-600">
        Loading your cart...
      </div>
    );
  }

  // If NOT logged in → show product/cart empty state + login button
  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        {/* Ecommerce / cart-related image */}
        <img
          src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80"
          alt="Shopping cart illustration"
          className="w-64 h-64 object-cover rounded-2xl shadow-lg mb-6"
        />

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your cart is waiting
        </h2>

        <p className="text-gray-600 mb-6 max-w-sm">
          Login to view your saved products and continue to secure checkout.
        </p>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-6 py-3 bg-amber-600 text-white rounded-lg shadow hover:bg-amber-700 transition"
          >
            Login to continue
          </Link>

          <Link
            to="/products"
            className="px-6 py-3 border border-amber-600 text-amber-700 rounded-lg hover:bg-amber-50 transition"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  // If logged in → allow access
  return children;
};

export default ProtectCart;
