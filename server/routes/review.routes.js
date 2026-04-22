import express from "express";
import {
  createReview,
  getProductReviews,
  checkCanReview,
} from "../controllers/review.controller.js";

const router = express.Router();

// Public routes
router.get("/product/:productId", getProductReviews);

// Protected routes
router.post("/", createReview);
router.get("/check-can-review/:productId", checkCanReview);

export default router;
