import { Router } from "express";
import { cartController } from "./cart.controller";
import middleware, { userRole } from "../../middleware/middleare";

const router = Router();

// Customer routes
router.post("/add", middleware(userRole.CUSTOMER), cartController.addToCart); // Add to cart
router.delete(
  "/remove",
  middleware(userRole.CUSTOMER),
  cartController.removeFromCart,
); // Remove from cart
router.put(
  "/update-quantity",
  middleware(userRole.CUSTOMER),
  cartController.updateCartQuantity,
); // Update quantity

export const cartRouter = router;
