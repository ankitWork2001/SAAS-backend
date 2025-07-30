import express from "express";
import { register, login, getProfile, logout, requestEmailVerificationOTP, verifyEmailOTP} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/role.js";

import upload from "../middleware/multer.js";


const router = express.Router();

router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.post("/logout",logout);

router.post("/ownAdmin/login", login);
router.get("/ownAdmin/profile", verifyToken, getProfile);
router.post("/ownAdmin/logout",logout);

// Email verification OTP    ---- under re-view 
// router.post("/request-otp", requestEmailVerificationOTP);
// router.post("/verify-otp", verifyEmailOTP);

export default router;
