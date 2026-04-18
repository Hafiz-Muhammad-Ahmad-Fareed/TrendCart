import { Router } from "express";
import {
  getProductsByCategorySlug,
  getPublicCategories,
} from "../controllers/catalog.controller.js";

const router = Router();

router.get("/categories", getPublicCategories);
router.get("/categories/:slug/products", getProductsByCategorySlug);

export default router;
