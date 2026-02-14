import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import moodRoutes from "./routes/mood.routes.js";
import authRoutes from "./routes/auth.routes.js";
import journalRoutes from "./routes/journal.routes.js";
import exportRoutes from "./routes/export.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/mood", moodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/export", exportRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Mindwell API Running 🚀");
});

export default app;
