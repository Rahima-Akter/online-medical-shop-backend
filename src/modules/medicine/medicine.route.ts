import { Router } from "express";
import middleware, { userRole } from "../../middleware/middleare";
import { medicineController } from "./medicine.controller";

const router = Router();


router.get("/", medicineController.getAllMedicine);
router.get("/:id", medicineController.getSingleMedicine);


router.post("/", middleware(userRole.SELLER), medicineController.addMedicine);
router.patch("/:id", middleware(userRole.SELLER, userRole.ADMIN), medicineController.updateMedicine);
router.delete("/:id", middleware(userRole.SELLER, userRole.ADMIN), medicineController.deleteMedicine);

export const medicineRouter = router;
