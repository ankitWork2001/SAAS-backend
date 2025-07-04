import express from "express";
import { isAdmin } from "../middleware/role.js";
import { createOrder, verifyPayment, viewUserOrderHistory, fetchOwnOrder } from "../controllers/paymentController.js";
import { fetchPayment, viewAllOrders } from "../controllers/Admins/paymentController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-order", verifyToken, createOrder);
router.post("/verify", verifyToken, verifyPayment);
router.get("/my-history", verifyToken, viewUserOrderHistory);
router.get("/my-order/:orderId", verifyToken, fetchOwnOrder);
router.get("/:userid/:id", verifyToken, isAdmin, fetchPayment);
router.get("/history", verifyToken, isAdmin, viewAllOrders);

export default router;
