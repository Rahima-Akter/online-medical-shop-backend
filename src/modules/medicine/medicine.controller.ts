import { Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { userRole } from "../../middleware/middleare";

const addMedicine = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    if (role !== userRole.SELLER && role !== userRole.ADMIN) {
      return res.status(403).json({ msg: "YOU ARE NOT ALLOWED!" });
    }

    const result = await medicineService.addMedicine(req.body);

    res.status(201).json({
      msg: "Medicine Added",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

const updateMedicine = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const id = req.params.id as string;

    if (role !== userRole.SELLER && role !== userRole.ADMIN) {
      return res.status(403).json({ msg: "YOU ARE NOT ALLOWED!" });
    }

    const result = await medicineService.updateMedicine(id, req.body);

    


    res.status(200).json({
      msg: "Medicine Updated",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const id = req.params.id as string;

    if (role !== userRole.SELLER && role !== userRole.ADMIN) {
      return res.status(403).json({ msg: "YOU ARE NOT ALLOWED!" });
    }

    const result = await medicineService.deleteMedicine(id);

    res.status(200).json({
      msg: "Medicine Deleted",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

// PUBLIC
const getAllMedicine = async (req: Request, res: Response) => {
  try {
    const result = await medicineService.getAllMedicine(req.query);

    res.status(200).json({
      msg: "Medicines Fetched",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

const getSingleMedicine = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const result = await medicineService.getSingleMedicine(id);

    res.status(200).json({
      msg: "Medicine Details",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

export const medicineController = {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getAllMedicine,
  getSingleMedicine,
};
