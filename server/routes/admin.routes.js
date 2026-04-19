import { Router } from "express";
import requireClerkAuth from "../middlewares/clerk_auth.middleware.js";
import requireAdmin from "../middlewares/admin.middleware.js";
import parseMultipartForm from "../middlewares/multipart_form.middleware.js";
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getCategories,
  getDashboardStats,
  getProducts,
  getUsers,
  updateCategory,
  updateProduct,
  updateUserRole,
  deleteUser,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(requireClerkAuth, requireAdmin);

router.get("/dashboard", getDashboardStats);

router.get("/categories", getCategories);
router.post("/categories", parseMultipartForm, createCategory);
router.put("/categories/:id", parseMultipartForm, updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/products", getProducts);
router.post("/products", parseMultipartForm, createProduct);
router.put("/products/:id", parseMultipartForm, updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
