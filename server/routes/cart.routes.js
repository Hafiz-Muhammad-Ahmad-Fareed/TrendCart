import { Router } from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import requireClerkAuth from "../middlewares/clerk_auth.middleware.js";

const router = Router();

router.use(requireClerkAuth);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update-quantity", updateQuantity);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
