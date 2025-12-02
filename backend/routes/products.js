import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getRelatedProducts,
  getProductsByCategory,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/auth.js";
import { uploadMultiple } from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/:id", getProduct);
router.get("/:id/related", getRelatedProducts);
router.get("/category/:categorySlug", getProductsByCategory);

// Protected routes (Admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  uploadMultiple("images", 5),
  createProduct
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadMultiple("images", 5),
  updateProduct
);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
