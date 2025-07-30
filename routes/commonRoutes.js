import express from "express";
import { viewPlanById , viewAllAvailablePlans} from "../controllers/planController.js";
import { viewAllAvailableProducts , viewProductById} from "../controllers/productController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/view-plan/:id", verifyToken, viewPlanById);

router.get("/view-allPlans", verifyToken, viewAllAvailablePlans);

router.get("/view-product/:id", verifyToken, viewProductById);

router.get("/view-allProducts", verifyToken, viewAllAvailableProducts);

export default router;
