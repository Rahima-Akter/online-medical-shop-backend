import { Router } from "express";
import middleware, { userRole } from "../../middleware/middleare";
import { reviewController } from "./review.controller";

const router = Router();

// public
router.get("/:medicineId", reviewController.getReviewsByMedicine);

// customer only
router.post("/", middleware(userRole.CUSTOMER), reviewController.addReview);
router.patch("/:id", middleware(userRole.CUSTOMER), reviewController.updateReview);
router.delete("/:id", middleware(userRole.CUSTOMER,userRole.ADMIN), reviewController.deleteReview);

export const reviewRouter = router;