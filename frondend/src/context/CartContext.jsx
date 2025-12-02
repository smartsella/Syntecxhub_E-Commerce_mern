import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage or API
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const cart = await cartService.getCart();
          setCartItems(cart.items || []);
        } catch (error) {
          console.error("Failed to load cart:", error);
          loadFromLocalStorage();
        } finally {
          setLoading(false);
        }
      } else {
        loadFromLocalStorage();
      }
    };
    loadCart();
  }, [isAuthenticated]);

  const loadFromLocalStorage = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const saveToLocalStorage = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const newItem = {
        _id: product._id,
        product: product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.images?.[0]?.url || "/placeholder.jpg",
        quantity,
        stock: product.stock,
      };

      let updatedItems;

      if (isAuthenticated) {
        const response = await cartService.addToCart(product._id, quantity);
        updatedItems = response.items;
      } else {
        const existingIndex = cartItems.findIndex(
          (item) => item.product === product._id
        );

        if (existingIndex > -1) {
          updatedItems = [...cartItems];
          const newQuantity = updatedItems[existingIndex].quantity + quantity;

          if (newQuantity > product.stock) {
            toast.error(`Only ${product.stock} items available in stock`);
            return { success: false };
          }

          updatedItems[existingIndex].quantity = newQuantity;
        } else {
          updatedItems = [...cartItems, newItem];
        }

        saveToLocalStorage(updatedItems);
      }

      setCartItems(updatedItems);
      toast.success(`🎉 ${product.name} added to cart!`);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
      return { success: false };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      let updatedItems;

      if (isAuthenticated) {
        await cartService.removeFromCart(productId);
        updatedItems = cartItems.filter((item) => item.product !== productId);
      } else {
        updatedItems = cartItems.filter((item) => item.product !== productId);
        saveToLocalStorage(updatedItems);
      }

      setCartItems(updatedItems);
      toast.success("Item removed from cart 🗑️");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
      return { success: false };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      return removeFromCart(productId);
    }

    try {
      let updatedItems;

      if (isAuthenticated) {
        const response = await cartService.updateQuantity(productId, quantity);
        updatedItems = response.items;
      } else {
        updatedItems = cartItems.map((item) =>
          item.product === productId ? { ...item, quantity } : item
        );
        saveToLocalStorage(updatedItems);
      }

      setCartItems(updatedItems);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartService.clearCart();
      } else {
        localStorage.removeItem("cart");
      }

      setCartItems([]);
      toast.success("Cart cleared successfully ✨");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear cart");
      return { success: false };
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => item.product === productId);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
