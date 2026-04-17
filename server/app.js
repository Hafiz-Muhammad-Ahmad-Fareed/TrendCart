import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import requestLogger from "./middlewares/request_logger.middleware.js";
import errorHandlerMiddleware from "./middlewares/error_handler.middleware.js";
import logger from "./config/winston.config.js";
import webhookRoutes from "./routes/webhook.routes.js";

const app = express();

app.use(requestLogger);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookRoutes,
);

app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    next();
  },
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(clerkMiddleware());
app.use(errorHandlerMiddleware(logger));

// Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running." });
});

export default app;
