import { Router } from "express";
import { orderController } from "./order.controller";
import middleware, { userRole } from "../../middleware/middleare";

const router = Router();

router.post("/", middleware(userRole.CUSTOMER), orderController.createOrder); //✅

router.get("/", middleware(userRole.ADMIN), orderController.getAllOrders); //✅

router.get(
  "/:id",
  middleware(userRole.ADMIN, userRole.SELLER, userRole.CUSTOMER),
  orderController.getSingleOrder,
); //✅

router.patch(
  "/:id/status",
  middleware(userRole.SELLER, userRole.CUSTOMER),
  orderController.updateOrderStatus,
); //✅

export const orderRouter = router;
