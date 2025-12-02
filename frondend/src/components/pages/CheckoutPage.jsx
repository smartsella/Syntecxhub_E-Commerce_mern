import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, Shield, Lock } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatters.js";
import orderService from "../../services/orderService.js";
import { PAYMENT_METHODS } from "../../utils/constants.js";

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
      return;
    }

    // Pre-fill user info if available
    if (user) {
      setShippingInfo((prev) => ({
        ...prev,
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user, cartItems, navigate]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));

    if (sameAsBilling) {
      setBillingInfo((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));

    if (errors[`billing_${name}`]) {
      setErrors((prev) => ({ ...prev, [`billing_${name}`]: "" }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate shipping info
    if (!shippingInfo.firstName) newErrors.firstName = "First name is required";
    if (!shippingInfo.lastName) newErrors.lastName = "Last name is required";
    if (!shippingInfo.email) newErrors.email = "Email is required";
    if (!shippingInfo.phone) newErrors.phone = "Phone is required";
    if (!shippingInfo.address) newErrors.address = "Address is required";
    if (!shippingInfo.city) newErrors.city = "City is required";
    if (!shippingInfo.state) newErrors.state = "State is required";
    if (!shippingInfo.zipCode) newErrors.zipCode = "ZIP code is required";

    // Validate billing info if different
    if (!sameAsBilling) {
      if (!billingInfo.firstName)
        newErrors.billing_firstName = "First name is required";
      if (!billingInfo.lastName)
        newErrors.billing_lastName = "Last name is required";
      if (!billingInfo.address)
        newErrors.billing_address = "Address is required";
      if (!billingInfo.city) newErrors.billing_city = "City is required";
      if (!billingInfo.state) newErrors.billing_state = "State is required";
      if (!billingInfo.zipCode)
        newErrors.billing_zipCode = "ZIP code is required";
    }

    // Validate payment info
    if (paymentMethod === "credit_card") {
      if (!paymentInfo.cardNumber)
        newErrors.cardNumber = "Card number is required";
      else if (paymentInfo.cardNumber.replace(/\s/g, "").length !== 16) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }

      if (!paymentInfo.cardName)
        newErrors.cardName = "Name on card is required";
      if (!paymentInfo.expiryMonth)
        newErrors.expiryMonth = "Expiry month is required";
      if (!paymentInfo.expiryYear)
        newErrors.expiryYear = "Expiry year is required";
      if (!paymentInfo.cvv) newErrors.cvv = "CVV is required";
      else if (paymentInfo.cvv.length !== 3)
        newErrors.cvv = "CVV must be 3 digits";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingInfo: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
        billingInfo: sameAsBilling
          ? null
          : {
              firstName: billingInfo.firstName,
              lastName: billingInfo.lastName,
              address: billingInfo.address,
              city: billingInfo.city,
              state: billingInfo.state,
              zipCode: billingInfo.zipCode,
              country: billingInfo.country,
            },
        paymentMethod,
        paymentInfo:
          paymentMethod === "credit_card"
            ? {
                cardNumber: paymentInfo.cardNumber.replace(/\s/g, ""),
                cardName: paymentInfo.cardName,
                expiry: `${paymentInfo.expiryMonth}/${paymentInfo.expiryYear}`,
                cvv: paymentInfo.cvv,
              }
            : null,
      };

      const order = await orderService.createOrder(orderData);

      // Clear cart on successful order
      await clearCart();

      // Redirect to order confirmation
      navigate(`/order-confirmation/${order._id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      setErrors({ general: "Failed to create order. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600 mb-8">Complete your purchase</p>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
                <div className="flex items-center mb-6">
                  <Truck className="h-6 w-6 text-amber-600 mr-3" />
                  <h2 className="text-xl font-bold">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                      className={`input-amber ${
                        errors.firstName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                      className={`input-amber ${
                        errors.lastName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      className={`input-amber ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className={`input-amber ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className={`input-amber ${
                        errors.address ? "border-red-500" : ""
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      className={`input-amber ${
                        errors.city ? "border-red-500" : ""
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      className={`input-amber ${
                        errors.state ? "border-red-500" : ""
                      }`}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      className={`input-amber ${
                        errors.zipCode ? "border-red-500" : ""
                      }`}
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      className="input-amber"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <CreditCard className="h-6 w-6 text-amber-600 mr-3" />
                    <h2 className="text-xl font-bold">Billing Information</h2>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className="h-4 w-4 text-amber-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Same as shipping
                    </span>
                  </label>
                </div>

                {!sameAsBilling && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={billingInfo.firstName}
                        onChange={handleBillingChange}
                        className={`input-amber ${
                          errors.billing_firstName ? "border-red-500" : ""
                        }`}
                      />
                      {errors.billing_firstName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.billing_firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={billingInfo.lastName}
                        onChange={handleBillingChange}
                        className={`input-amber ${
                          errors.billing_lastName ? "border-red-500" : ""
                        }`}
                      />
                      {errors.billing_lastName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.billing_lastName}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={billingInfo.address}
                        onChange={handleBillingChange}
                        className={`input-amber ${
                          errors.billing_address ? "border-red-500" : ""
                        }`}
                      />
                      {errors.billing_address && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.billing_address}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={billingInfo.city}
                        onChange={handleBillingChange}
                        className={`input-amber ${
                          errors.billing_city ? "border-red-500" : ""
                        }`}
                      />
                      {errors.billing_city && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.billing_city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={billingInfo.state}
                        onChange={handleBillingChange}
                        className={`input-amber ${
                          errors.billing_state ? "border-red-500" : ""
                        }`}
                      />
                      {errors.billing_state && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.billing_state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={billingInfo.zipCode}
                        onChange={handleBillingChange}
                        className={`input-amber ${
                          errors.billing_zipCode ? "border-red-500" : ""
                        }`}
                      />
                      {errors.billing_zipCode && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.billing_zipCode}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={billingInfo.country}
                        onChange={handleBillingChange}
                        className="input-amber"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="h-6 w-6 text-amber-600 mr-3" />
                  <h2 className="text-xl font-bold">Payment Method</h2>
                </div>

                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.value}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          paymentMethod === method.value
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:border-amber-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex flex-col items-center text-center">
                          <span className="text-2xl mb-2">{method.icon}</span>
                          <span className="font-medium">{method.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {paymentMethod === "credit_card" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        maxLength="19"
                        placeholder="1234 5678 9012 3456"
                        className={`input-amber ${
                          errors.cardNumber ? "border-red-500" : ""
                        }`}
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        placeholder="JOHN DOE"
                        className={`input-amber ${
                          errors.cardName ? "border-red-500" : ""
                        }`}
                      />
                      {errors.cardName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.cardName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Month *
                      </label>
                      <select
                        name="expiryMonth"
                        value={paymentInfo.expiryMonth}
                        onChange={handlePaymentChange}
                        className={`input-amber ${
                          errors.expiryMonth ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option
                            key={i + 1}
                            value={String(i + 1).padStart(2, "0")}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                      {errors.expiryMonth && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.expiryMonth}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Year *
                      </label>
                      <select
                        name="expiryYear"
                        value={paymentInfo.expiryYear}
                        onChange={handlePaymentChange}
                        className={`input-amber ${
                          errors.expiryYear ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                      {errors.expiryYear && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.expiryYear}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        maxLength="3"
                        placeholder="123"
                        className={`input-amber ${
                          errors.cvv ? "border-red-500" : ""
                        }`}
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.cvv}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-gray-600">
                        Your payment is secured with SSL encryption
                      </span>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="text-center py-8">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                      <p className="text-gray-700 mb-4">
                        You will be redirected to PayPal to complete your
                        payment
                      </p>
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                      >
                        Continue with PayPal
                      </button>
                    </div>
                  </div>
                )}

                {paymentMethod === "cash_on_delivery" && (
                  <div className="text-center py-8">
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                      <p className="text-gray-700">
                        Pay with cash when your order is delivered
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-6 mb-6">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  {/* Order Items */}
                  <div className="mb-6">
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {cartItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center space-x-4"
                        >
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={item.image || "/placeholder.jpg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium text-sm line-clamp-1">
                              {item.name}
                            </h4>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-gray-500 text-sm">
                                Qty: {item.quantity}
                              </span>
                              <span className="font-semibold">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 border-t border-amber-200 pt-4">
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
                      <span className="font-semibold">
                        {formatCurrency(tax)}
                      </span>
                    </div>
                    <div className="border-t border-amber-200 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-amber-600">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Place Order */}
                <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
                  <div className="mb-6">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        required
                        className="h-4 w-4 text-amber-600 rounded mt-1 mr-3"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="text-amber-600 hover:text-amber-500"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-amber-600 hover:text-amber-500"
                        >
                          Privacy Policy
                        </a>
                        . I understand that my order is subject to verification
                        and approval.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-amber py-4 text-lg font-semibold"
                  >
                    {loading ? (
                      "Processing..."
                    ) : (
                      <>
                        <Lock className="inline h-5 w-5 mr-2" />
                        Place Order
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    You won't be charged until the order is confirmed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
