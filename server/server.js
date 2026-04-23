import "dotenv/config";
import path from "path";
import express from "express";
import connectDB from "./config/db.config.js";
import app from "./app.js";
import seedAdmin from "./utils/seedAdmin.js";

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
    await seedAdmin();
    app.on("error", (error) => {});

    app.listen(PORT, () => {});
  })
  .catch((error) => {});
