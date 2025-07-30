import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = async (req, res, next) => {
  try {
    let token; // Declare token here

    // 1. Check for token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Extract the token part after "Bearer "
      token = authHeader.split(" ")[1];
    } else if (req.cookies.token) {
      // 2. Check for token in cookies (if not found in header)
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey" // Use your actual secret
    );

    // Find user by ID from token payload
    const user = await User.findById(decoded.id).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;

    next(); // Continue to next middleware/route
  } catch (error) {
    console.error("Auth Error:", error.message);
    // More specific error messages can be helpful during development
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(401).json({ message: "Authentication failed" });
  }
};
