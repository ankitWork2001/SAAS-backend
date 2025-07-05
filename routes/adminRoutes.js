import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/role.js";

import {
  introducePlan,
  blockPlan,
  updatePlan,
  activateBlockedPlan,
} from "../controllers/Admins/planController.js";
import {
  introduceProduct,
  blockProduct,
  updateProduct,
  viewAllProducts,
  activateBlockedProduct
} from "../controllers/Admins/productController.js";
import { allUsers, blockUser , activateBlockedUser} from "../controllers/Admins/userController.js";

const router = express.Router();

router.get("/users", verifyToken, isAdmin, allUsers);
router.patch("/block-user/:userID", verifyToken, isAdmin, blockUser);
router.patch("/activate-user/:userID", verifyToken, isAdmin, activateBlockedUser);

router.post("/add-product", verifyToken, isAdmin, introduceProduct);
router.patch("/block-product/:productId", verifyToken, isAdmin, blockProduct);
router.put("/update-product/:productId", verifyToken, isAdmin, updateProduct);
router.patch("/activate-product/:productId", verifyToken, isAdmin, activateBlockedProduct);
router.get("/products", verifyToken, isAdmin, viewAllProducts);

router.post("/add-plan", verifyToken, isAdmin, introducePlan);
router.patch("/block-plan/:planID", verifyToken, isAdmin, blockPlan);
router.patch("/activate-plan/:planID", verifyToken, isAdmin, activateBlockedPlan);
router.put("/update-plan/:planID", verifyToken, isAdmin, updatePlan);

export default router;
