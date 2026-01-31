import { Router } from "express";
import { orderController } from "./order.controller";
import middleware, { userRole } from "../../middleware/middleare";

const router = Router();

// Admin route: Get all orders (you can add pagination later in service layer if needed)
router.get(
  "/",
  middleware(userRole.ADMIN), 
  orderController.getAllOrders
);

// Get single order (any user based on their role)
router.get(
  "/:id",
  middleware(userRole.ADMIN, userRole.SELLER, userRole.CUSTOMER),
  orderController.getSingleOrder
);

// Update order status (Seller and Customer roles)
router.put(
  "/:id/status",
  middleware(userRole.SELLER, userRole.CUSTOMER),
  orderController.updateOrderStatus
);

export const orderRouter = router;
