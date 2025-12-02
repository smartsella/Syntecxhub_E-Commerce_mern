import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  // Initialize user from token
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      toast.success(
        "Registration successful! Please check your email for OTP."
      );

      // Store email for OTP verification
      localStorage.setItem("pendingVerification", userData.email);

      navigate("/verify-otp");
      return { success: true, data: response };
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return { success: false, error: error.response?.data };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await authService.verifyOTP(email, otp);
      const { token: authToken, user: userData } = response;

      localStorage.setItem("token", authToken);
      localStorage.removeItem("pendingVerification");
      setToken(authToken);
      setUser(userData);

      toast.success("Account verified successfully! Welcome to ShopNow! 🎉");
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      return { success: false, error: error.response?.data };
    }
  };

  const login = async (email, password) => {
    try {
      const { token: authToken, user: userData } = await authService.login(
        email,
        password
      );

      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(userData);

      toast.success(`Welcome back, ${userData.name}! 👋`);
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false, error: error.response?.data };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      toast.success("Profile updated successfully! ✅");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      return { success: false, error: error.response?.data };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    register,
    verifyOTP,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
