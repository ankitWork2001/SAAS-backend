import express from "express";
import { viewPlanById , viewAllAvailablePlans, allActivePlansOfUser, allPlansOfUser} from "../controllers/planController.js";
import { viewAllAvailableProducts , viewProductById} from "../controllers/productController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/view-plan", verifyToken, viewPlanById);

router.get("/view-allPlans", verifyToken, viewAllAvailablePlans);

router.get("/view-product", verifyToken, viewProductById);

router.get("/view-allProducts", verifyToken, viewAllAvailableProducts);

router.get("all-active-plans/:userId",verifyToken,allActivePlansOfUser);

router.get("all-plans/:userId",verifyToken,allPlansOfUser);


export default router;
