import { Router } from "express";
import {
  getProductsByCategorySlug,
  getPublicCategories,
  getProductBySlug,
  getSimilarProducts,
} from "../controllers/catalog.controller.js";

const router = Router();

router.get("/categories", getPublicCategories);
router.get("/categories/:slug/products", getProductsByCategorySlug);
router.get("/products/:slug", getProductBySlug);
router.get("/products/:slug/similar", getSimilarProducts);

export default router;
