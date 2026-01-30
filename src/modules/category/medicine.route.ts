import { Router } from "express";
import middleware, { userRole } from "../../middleware/middleare";
import { categoryController } from "./medicine.controller";

const router = Router();

router.get('/', middleware(userRole.ADMIN), categoryController.getAllCategory)
router.post('/', middleware(userRole.ADMIN), categoryController.addCategory);
router.patch('/:id', middleware(userRole.ADMIN), categoryController.changeStatus);
router.delete('/:id', middleware(userRole.ADMIN), categoryController.deleteCategory);

export const categoryRouter = router;