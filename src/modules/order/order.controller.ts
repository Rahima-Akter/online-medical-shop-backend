import { Request, Response } from "express";
import { orderService } from "./order.service";
import { userRole } from "../../middleware/middleare";

// Get all orders for a user (admin, seller, customer)
const getAllOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming req.user is populated
    const role = req.user?.role as userRole; // Assuming role is available in req.user

    const orders = await orderService.getAllOrders(
      role,
      userId as string,
      req.query
    );

    return res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong",
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};

// Get a single order (admin, seller, customer)
const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Order ID
    const userId = req.user?.id; // Logged-in user ID
    const role = req.user?.role as userRole; // User role

    const order = await orderService.getSingleOrder(
      id as string,
      userId as string,
      role,
    );

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    return res.status(200).json({ data: order });
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong",
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};

// Update order status (for seller and customer)
const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Order ID
    const { status } = req.body; // New status
    const userId = req.user?.id; // Logged-in user ID
    const role = req.user?.role as userRole; // User role

    const updatedOrder = await orderService.updateOrderStatus(
      id as string,
      status,
      userId as string,
      role,
    );

    if (!updatedOrder) {
      return res
        .status(403)
        .json({ msg: "You don't have permission to update this order" });
    }

    return res.status(200).json({
      msg: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong",
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};

export const orderController = {
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
};
