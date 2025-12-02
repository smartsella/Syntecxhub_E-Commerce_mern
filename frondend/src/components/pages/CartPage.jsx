import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatCurrency } from "../../utils/formatters.js";
// import EmptyState from "../common/";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleQuantityChange = (productId, change) => {
    const item = cartItems.find((item) => item._id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity >= 1) {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setApplyingCoupon(true);
    // TODO: Implement coupon API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setApplyingCoupon(false);
    setCouponCode("");
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const discount = 0; // TODO: Calculate from coupon
  const total = subtotal + shipping + tax - discount;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <EmptyState
          icon={<ShoppingBag className="h-16 w-16" />}
          title="Your cart is empty"
          description="Add some products to your cart and they will appear here"
          action={
            <Link to="/shop" className="btn-amber">
              Start Shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-gray-600 mb-8">
          You have {getCartCount()} item{getCartCount() !== 1 ? "s" : ""} in
          your cart
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-amber-100 bg-amber-50">
                <div className="col-span-5 font-semibold text-gray-700">
                  Product
                </div>
                <div className="col-span-2 font-semibold text-gray-700">
                  Price
                </div>
                <div className="col-span-3 font-semibold text-gray-700">
                  Quantity
                </div>
                <div className="col-span-2 font-semibold text-gray-700">
                  Total
                </div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-amber-100">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-6">
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                      {/* Product Info */}
                      <div className="md:col-span-5">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              SKU: {item.sku || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="md:col-span-2">
                        <div className="text-lg font-bold text-amber-600">
                          {formatCurrency(item.price)}
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, -1)}
                            className="w-8 h-8 rounded-full border border-amber-200 flex items-center justify-center hover:bg-amber-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item._id, 1)}
                            className="w-8 h-8 rounded-full border border-amber-200 flex items-center justify-center hover:bg-amber-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Total & Actions */}
                      <div className="md:col-span-2 flex items-center justify-between w-full">
                        <div className="text-lg font-bold">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Actions */}
              <div className="p-6 border-t border-amber-100 bg-amber-50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <Link to="/shop" className="btn-amber-outline">
                    Continue Shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-amber-100 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Have a coupon code?
              </h3>
              <div className="flex">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-grow px-4 py-3 border border-amber-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon || !couponCode.trim()}
                  className="btn-amber rounded-l-none"
                >
                  {applyingCoupon ? "Applying..." : "Apply"}
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Popular codes:{" "}
                <span className="font-mono bg-amber-100 px-2 py-1 rounded">
                  WELCOME10
                </span>{" "}
                <span className="font-mono bg-amber-100 px-2 py-1 rounded">
                  SAVE20
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? "FREE" : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-semibold">{formatCurrency(tax)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-amber-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-amber-600">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() =>
                    navigate(isAuthenticated ? "/checkout" : "/login")
                  }
                  className="w-full btn-amber py-4 text-lg font-semibold mb-4"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5 inline" />
                </button>

                {/* Security Info */}
                <div className="text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Shield className="h-4 w-4" />
                    <span>Secure checkout</span>
                  </div>
                  <p>Your payment information is encrypted and secure</p>
                </div>
              </div>

              {/* Order Notes */}
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-amber-100 p-6">
                <h3 className="font-semibold mb-3">Add Order Notes</h3>
                <textarea
                  placeholder="Special instructions for your order..."
                  className="w-full h-32 px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
