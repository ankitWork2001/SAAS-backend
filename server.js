import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import commonRoutes from "./routes/commonRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();


// Middleware Setup
app.use(helmet()); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
  // Database Connection
  await connectDB();
  console.log("Database connected successfully");
} catch (error) {
  console.error("Database connection failed:", error);
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", commonRoutes);
app.use("/ap/user",userRoutes);
app.use("/api/admin",adminRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
