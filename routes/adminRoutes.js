import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/role.js";

import {introducePlan, blockPlan, updatePlan, activateBlockedPlan} from "../controllers/Admins/planController.js";
import {introduceProduct, blockProduct, updateProduct , viewAllProducts} from "../controllers/Admins/productController.js";
import {allUsers, blockUser} from "../controllers/Admins/userController.js";
import { viewAllAvailableProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/users", verifyToken, isAdmin, allUsers);
router.post("/block-user/:userID", verifyToken, isAdmin, blockUser);

router.post("/add-product", verifyToken, isAdmin, introduceProduct);
router.post("/block-product/:productID", verifyToken, isAdmin, blockProduct);
router.put("/update-product/:productID", verifyToken, isAdmin, updateProduct);
router.get("/products", verifyToken, isAdmin, viewAllProducts);

router.post("/add-plan", verifyToken, isAdmin, introducePlan);
router.post("/block-plan/:planID", verifyToken, isAdmin, blockPlan);
router.post("/activate-plan/:planID", verifyToken, isAdmin, activateBlockedPlan);
router.put("/update-plan/:planID", verifyToken, isAdmin, updatePlan);