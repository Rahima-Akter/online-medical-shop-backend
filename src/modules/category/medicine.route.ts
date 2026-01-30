import { Router } from "express";
import middleware, { userRole } from "../../middleware/middleare";
import { categoryController } from "./medicine.controller";

const router = Router();

router.post('/', middleware(userRole.ADMIN), categoryController.addCategory);
router.patch('/:id', middleware(userRole.ADMIN), categoryController.changeStatus);

export const categoryRouter = router;