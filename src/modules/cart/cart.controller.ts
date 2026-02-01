import { Request, Response } from "express";
import { cartService } from "./cart.service";

const addToCart = async (req: Request, res: Response) => {
  try {
    const { medicineId, quantity } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    if (!medicineId || quantity <= 0) {
      return res.status(400).json({ msg: "Invalid medicine or quantity" });
    }

    const result = await cartService.addToCart(userId, medicineId, quantity);

    res.status(201).json({
      msg: "Medicine added to cart",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong",
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};

// Remove item from cart
const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    if (!medicineId) {
      return res.status(400).json({ msg: "Medicine ID is required" });
    }

    const result = await cartService.removeFromCart(userId, medicineId);

    res.status(200).json({
      msg: "Medicine removed from cart",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong",
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};

// Update item quantity in cart
const updateCartQuantity = async (req: Request, res: Response) => {
  try {
    const { medicineId, quantity } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    if (!medicineId || quantity <= 0) {
      return res.status(400).json({ msg: "Invalid medicine or quantity" });
    }

    const result = await cartService.updateQuantity(userId, medicineId, quantity);

    res.status(200).json({
      msg: "Cart updated",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong",
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};

// Get all items in cart
const getCartItems = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    const cartItems = await cartService.getCartItems(userId);

    res.status(200).json({
      msg: "Cart items fetched successfully",
      data: cartItems,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Something went wrong",
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};

export const cartController = {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCartItems,
};
