import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import requestLogger from "./middlewares/request_logger.middleware.js";
import errorHandlerMiddleware from "./middlewares/error_handler.middleware.js";
import logger from "./config/winston.config.js";
import clerkRoutes from "./routes/clerk.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import catalogRoutes from "./routes/catalog.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { handleWebhook } from "./controllers/order.controller.js";

const app = express();

app.use(requestLogger);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use(
  "/api/clerk/webhook",
  express.raw({ type: "application/json" }),
  clerkRoutes,
);

app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook,
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running." });
});
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", catalogRoutes);
app.use(errorHandlerMiddleware(logger));

export default app;
