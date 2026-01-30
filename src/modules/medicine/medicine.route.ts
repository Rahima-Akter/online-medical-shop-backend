import { Router } from "express";
import middleware, { userRole } from "../../middleware/middleare";
import { medicineController } from "./medicine.controller";

const router = Router();

router.post('/', middleware(userRole.SELLER), medicineController.addMedicine)

export const medicineRouter = router;