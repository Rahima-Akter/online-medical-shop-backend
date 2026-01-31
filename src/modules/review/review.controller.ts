import { Request, Response } from "express";
import { reviewService } from "./review.service";
import { userRole } from "../../middleware/middleare";

const addReview = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;

    if (role !== userRole.CUSTOMER) {
      return res.status(403).json({ msg: "YOU ARE NOT ALLOWED!" });
    }

    const result = await reviewService.addReview(req.user!.id, req.body);

    if (!result) {
      return res.status(400).json({
        msg: "Failed to add review!",
      });
    }

    res.status(201).json({
      msg: "Review Added",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

const updateReview = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const id = req.params.id as string;

    if (role !== userRole.CUSTOMER) {
      return res.status(403).json({ msg: "YOU ARE NOT ALLOWED!" });
    }

    const result = await reviewService.updateReview(id, req.user!.id, req.body);

    if (!result) {
      return res.status(400).json({
        msg: "Failed to update review!",
      });
    }

    res.status(200).json({
      msg: "Review Updated",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

const deleteReview = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const id = req.params.id as string;

    if (role !== userRole.CUSTOMER && role !== userRole.ADMIN) {
      return res.status(403).json({ msg: "YOU ARE NOT ALLOWED!" });
    }

    const result = await reviewService.deleteReview(role,id, req.user!.id);

    if (!result) {
      return res.status(400).json({
        msg: "Failed to delete review!",
      });
    }

    res.status(200).json({
      msg: "Review Deleted",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

const getReviewsByMedicine = async (req: Request, res: Response) => {
  try {
    const medicineId = req.params.medicineId as string;

    if (!medicineId) {
      return res.status(400).json({
        msg: "Medicine ID is required!",
      });
    }

    const result = await reviewService.getReviewsByMedicine(medicineId);
    if (!result) {
      return res.status(400).json({
        msg: "Failed to get reviews!",
      });
    }

    res.status(200).json({
      msg: "Reviews Fetched",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

export const reviewController = {
  addReview,
  updateReview,
  deleteReview,
  getReviewsByMedicine,
};
