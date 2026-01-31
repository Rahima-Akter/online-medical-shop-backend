import { prisma } from "../../lib/prisma";

const addToCart = async (userId: string, medicineId: string, quantity: number) => {
  // Check if the item already exists in the cart
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      userId_medicineId: {
        userId,
        medicineId,
      },
    },
  });

  if (existingCartItem) {
    // If the item exists, just update the quantity
    return await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + quantity },
    });
  } else {
    // If it doesn't exist, create a new entry
    return await prisma.cartItem.create({
      data: {
        userId,
        medicineId,
        quantity,
      },
    });
  }
};

const removeFromCart = async (userId: string, medicineId: string) => {
  // Find and remove the cart item
  return await prisma.cartItem.delete({
    where: {
      userId_medicineId: {
        userId,
        medicineId,
      },
    },
  });
};

const updateQuantity = async (userId: string, medicineId: string, quantity: number) => {
  // Find the existing cart item
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      userId_medicineId: {
        userId,
        medicineId,
      },
    },
  });

  if (!cartItem) {
    throw new Error("Item not found in cart");
  }

  // Update the quantity of the cart item
  return await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity },
  });
};

export const cartService = {
  addToCart,
  removeFromCart,
  updateQuantity,
};
