import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/common/Layout";

// Public Pages
import HomePage from "./components/pages/HomePage.jsx";
import ShopPage from "./components/pages/ProductPage.jsx";
import ProductPage from "./components/pages/ProductPage.jsx";
import LoginPage from "./components/pages/LoginPage.jsx";
import RegisterPage from "./components/pages/RegisterPage.jsx";
import OTPVerificationPage from "./components/pages/OTPVerificationPage.jsx";
import CartPage from "./components/pages/CartPage.jsx";

// Protected Pages
import CheckoutPage from "./components/pages/CheckoutPage.jsx";
import DashboardPage from "./components/pages/DashboardPage.jsx";

// Admin Pages
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AdminProducts from "./components/admin/AdminProducts.jsx";
import AdminOrders from "./components/admin/AdminOrders.jsx";

// Protected Routes Components
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<OTPVerificationPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Protected Routes */}
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
          </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
