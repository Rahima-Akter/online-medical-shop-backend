import { Request, Response } from "express";
import { medicineService } from "./medicine.service";

const addMedicine = async (req: Request, res: Response) => {
  try {
    const result = await medicineService.addMedicine();
    // if(result){
    //     res.status(200).json({
    //         msg: "Medicine Added",
    //         data: result;
    //     })
    // }
    // res.status(400).json({
    //     msg: "Faild to add medicine!",
    //     data: result
    // })
    res.status(200).json({
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

export const medicineController = {
  addMedicine,
};
