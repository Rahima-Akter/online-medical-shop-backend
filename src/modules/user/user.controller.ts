import { Request, Response } from "express";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers(req.query);

    if (!result) {
      return res.status(400).json({
        msg: "Failed to fetch users!",
      });
    }
    res.status(200).json({ msg: "Users fetched successfully!", data: result });
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getUserById(id as string);
    if (!result) {
      return res.status(400).json({
        msg: "Failed to fetch user!",
      });
    }
    res.status(200).json({ msg: "User fetched successfully!", data: result });
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id as string);
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

const getOwnAccount = async (req: Request, res: Response) => {
  try {
    // const userId = req.params?.id;
    const userId = req.user?.id;
    console.log({ userId });
    const result = await userService.getOwnAccount(userId as string);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

const updateOwnAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const result = await userService.updateOwnAccount(userId, req.body);
    res.status(200).json({ msg: "Account updated successfully", data: result });
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong",
      err: err instanceof Error ? err.message : "Internal Server Error!",
    });
  }
};

const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!loggedInUser) {
      return res.status(401).json({
        msg: "User is not authenticated",
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        msg: "Both current and new password are required",
      });
    }

    const result = await userService.updateUserPassword(
      loggedInUser,
      newPassword,
      currentPassword,
    );

    return res.status(200).json({
      msg: result.msg,
      success: result.success,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Something went wrong",
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}; //❌ work with it later!!

export const userController = {
  getAllUsers,
  getUserById,
  deleteUser,
  getOwnAccount,
  updateOwnAccount,
  updateUserPassword,
};
