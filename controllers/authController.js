import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";
import { requestEmailOTP, verifyEmailOTP as verifyOTPUtil } from "../utils/requestEmail.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const JWT_EXPIRES_IN = "7d";
const DEFAULT_IMAGE_URL = "https://designimages.appypie.com/profilepicture/profilepicture-2-portrait-head.jpg";

// JWT token generator
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// ---------------- REGISTER ----------------
export const register = async (req, res) => {
  try {
    let { name, email, password, mobile } = req.body;
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ success: false, message: "User already exists." });

    let avatarUrl = DEFAULT_IMAGE_URL;

    if (req.file) {
      const streamUpload = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "avatars" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });

      const result = await streamUpload(req.file.buffer);
      avatarUrl = result.secure_url;
    }

    const newUser = new User({ name, email, password, mobile, avatarUrl });
    await newUser.save();

    await requestEmailOTP(email);

    res.status(201).json({
      success: true,
      message: "User registered. Please verify your email.",
       newUser
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ success: false, message: "Server error",error: err.message });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials." });

    if (user.status === "blocked")
      return res.status(403).json({ success: false, message: "Your account is blocked." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials." });

    const token = generateToken(user._id);
    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user ,
      token,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, message: "Server error",error: err.message });
  }
};

// ---------------- PROFILE ----------------
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    res.status(200).json({
      success: true,
      user 
    });
  } catch (err) {
    console.error("Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" ,error: err.message});
  }
};

// ---------------- LOGOUT ----------------
export const logout = (req, res) => {
  try {
    res.setHeader("Authorization", "");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Logout error" ,error: err.message});
  }
};

// ---------------- REQUEST OTP ----------------
export const requestEmailVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    await requestEmailOTP(email);
    res.status(200).json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    console.error("OTP Request Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send OTP.",error: err.message });
  }
};

// ---------------- VERIFY OTP ----------------
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Email and OTP are required." });

     const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const isValid = verifyOTPUtil(email, otp);
    if (!isValid) return res.status(400).json({ success: false, message: "Invalid or expired OTP." });

    await User.findOneAndUpdate({ email: email.toLowerCase().trim() }, { isEmailVerified: true });
    res.status(200).json({ success: true, message: "Email verified successfully." });
  } catch (err) {
    console.error("OTP Verify Error:", err.message);
    res.status(500).json({ success: false, message: "OTP verification failed.",error: err.message });
  }
};


