import { Request, Response } from "express";
import { orderService } from "./order.service";
import { userRole } from "../../middleware/middleare";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerId, items, shippingAddress } = req.body;

    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ msg: "Invalid request data" });
    }

    const result = await orderService.createOrder(
      customerId,
      items,
      shippingAddress,
    );

    return res.status(201).json({
       msg: "Order Placed successfully",
      data: result,
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "Something went wrong",
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; 
    const role = req.user?.role as userRole;

    const orders = await orderService.getAllOrders(
      role,
      userId as string,
      req.query,
    );

    return res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong",
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};

const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role as userRole;

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
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
};
