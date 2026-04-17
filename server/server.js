import "dotenv/config";
import path from "path";
import express from "express";
import connectDB from "./config/db.config.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

connectDB()
  .then(async () => {
    app.on("error", (error) => {
      console.log("Error: ", error.message);
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
