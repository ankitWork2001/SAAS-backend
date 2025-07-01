import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/role.js";

import {introducePlan, blockPlan, updatePlan} from "../controllers/Admins/planController.js";
import {introduceProduct, blockProduct, updateProduct} from "../controllers/Admins/productController.js";
import {allUsers, blockUser} from "../controllers/Admins/userController.js";

const router = express.Router();

router.get("/users", verifyToken, isAdmin, allUsers);
router.post("/block-user/:userID", verifyToken, isAdmin, blockUser);

router.post("/add-product", verifyToken, isAdmin, introduceProduct);
router.post("/block-product/:productID", verifyToken, isAdmin, blockProduct);
router.put("/update-product/:productID", verifyToken, isAdmin, updateProduct);

router.post("/add-plan", verifyToken, isAdmin,
introducePlan);
router.post("/block-plan/:planID", verifyToken, isAdmin, blockPlan);
router.put("/update-plan/:planID", verifyToken, isAdmin, updatePlan);

export default router;
