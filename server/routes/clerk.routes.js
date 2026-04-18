import { Router } from "express";
import { clerkUserManagement } from "../controllers/clerk.controller.js";

const router = Router();

router.post("/", clerkUserManagement);

export default router;
