import { Router } from "express";
import middleware, { userRole } from "../../middleware/middleare";
import { userController } from "./user.controller";

const router = Router();

router.get("/", middleware(userRole.ADMIN), userController.getAllUsers); //✅
router.get("/:id", middleware(userRole.ADMIN), userController.getUserById); //✅
router.delete("/:id", middleware(userRole.ADMIN), userController.deleteUser);

router.get(
  "/me",
  middleware(userRole.SELLER, userRole.CUSTOMER),
  userController.getOwnAccount,
); //❌

router.patch(
  "/me",
  middleware(userRole.SELLER, userRole.CUSTOMER),
  userController.updateOwnAccount,
); //✅

router.patch(
  "/update-password",
  middleware(userRole.SELLER, userRole.CUSTOMER),
  userController.updateUserPassword,
); //❌ work with it later!!

export const userRouter = router;
