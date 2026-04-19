import { Router } from "express";
import {
  createCheckoutSession,
  getUserOrders,
} from "../controllers/order.controller.js";
import requireClerkAuth from "../middlewares/clerk_auth.middleware.js";

const router = Router();

router.use(requireClerkAuth);

router.post("/checkout-session", createCheckoutSession);
router.get("/my-orders", getUserOrders);

export default router;
