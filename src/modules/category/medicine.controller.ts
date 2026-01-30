import { Request, Response } from "express";
import { categoryService } from "./medicine.service";
import { userRole } from "../../middleware/middleare";

const addCategory = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    if (role !== userRole.ADMIN) {
      return res.status(403).json({
        msg: "YOU ARE NOT ALLOWED!",
      });
    }

    const result = await categoryService.addCategory(req.body);

    if (!result) {
      res.status(400).json({
        msg: "Faild to add medicine!",
        data: result,
      });
    }

    res.status(201).json({
      msg: "Category Added",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};
const changeStatus = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const { name, status } = req.body;
    const id = req.params.id as string;

    if (role !== userRole.ADMIN) {
      return res.status(403).json({
        msg: "YOU ARE NOT ALLOWED!",
      });
    }

    if (!id) {
      return res.status(404).json({
        msg: `ID:${id} NOT FOUND!`,
      });
    }

    const result = await categoryService.changeStatus(id, name, status);

    if (!result) {
      res.status(400).json({
        msg: "Action Faild!",
        data: result,
      });
    }

    res.status(201).json({
      msg: "Status Changed",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

export const categoryController = {
  addCategory,
  changeStatus,
};
