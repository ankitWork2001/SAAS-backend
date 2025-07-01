import express from "express";
import { subscribedPlansOfUser, addPlanToUser } from "../controllers/planController.js";
import { subscribedProductsOfUser, addProductToUser } from "../controllers/productController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/subscribed-plans", verifyToken, subscribedPlansOfUser);
router.post("/add-plan", verifyToken, addPlanToUser);


router.get("/subscribed-products", verifyToken, subscribedProductsOfUser);
router.post("/add-product", verifyToken, addProductToUser);

export default router;
