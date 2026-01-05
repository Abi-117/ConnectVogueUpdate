import express from "express";
import upload from "../middleware/upload.js";
import {
  vendorCreateProduct,
  approveProduct,
  getProducts,
  getProductsByCategory,
  getProductById,
  getApprovedProducts,
  getProductsByVendor,
  rejectProduct,
} from "../controllers/product.controller.js";

import { authMiddleware } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";
import { vendorOnly } from "../middleware/vendorOnly.js";

const router = express.Router();

// Vendor
router.post(
  "/vendor",
  authMiddleware,
  vendorOnly,
  upload.single("image"),
  vendorCreateProduct
);

router.get("/vendor", authMiddleware, vendorOnly, getProductsByVendor);

// Admin
router.put("/approve/:id", authMiddleware, adminOnly, approveProduct);
router.put("/reject/:id", authMiddleware, adminOnly, rejectProduct);
router.get("/", authMiddleware, adminOnly, getProducts);

// Public
router.get("/public", getApprovedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);

export default router;
