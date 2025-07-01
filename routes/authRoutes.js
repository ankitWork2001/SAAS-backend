import express from "express";
import { register, login, getProfile, logout } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/multer.js";


const router = express.Router();

router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.post("/logout",logout);

export default router;
