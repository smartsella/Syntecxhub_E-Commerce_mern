import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get("/", getCart);
router.post("/items", addToCart);
router.put("/items/:itemId", updateCartItem);
router.delete("/items/:itemId", removeCartItem);
router.delete("/", clearCart);
router.post("/coupon", applyCoupon);
router.delete("/coupon", removeCoupon);

export default router;
