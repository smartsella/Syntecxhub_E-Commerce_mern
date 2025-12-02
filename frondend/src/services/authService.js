import api from "./api";

const authService = {
  register: (userData) => api.post("/auth/register", userData),

  verifyOTP: (email, otp) => api.post("/auth/verify-otp", { email, otp }),

  login: (email, password) => api.post("/auth/login", { email, password }),

  logout: () => api.get("/auth/logout"),

  getMe: () => api.get("/auth/me"),

  updateProfile: (userData) => api.put("/auth/update-profile", userData),

  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),

  resetPassword: (token, password) =>
    api.put("/auth/reset-password", { token, password }),
};

export default authService;
