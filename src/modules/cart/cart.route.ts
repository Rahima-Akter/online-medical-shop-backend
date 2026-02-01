import { Router } from "express";
import { cartController } from "./cart.controller";
import middleware, { userRole } from "../../middleware/middleare";

const router = Router();

router.post("/", middleware(userRole.CUSTOMER), cartController.addToCart);

router.delete("/remove", middleware(userRole.CUSTOMER), cartController.removeFromCart);

router.put("/update-quantity", middleware(userRole.CUSTOMER), cartController.updateCartQuantity);

router.get("/", middleware(userRole.CUSTOMER), cartController.getCartItems);

export const cartRouter = router;
