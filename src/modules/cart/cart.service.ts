import { prisma } from "../../lib/prisma";

const addToCart = async (userId: string, medicineId: string, quantity: number) => {
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      userId_medicineId: {
        userId,
        medicineId,
      },
    },
  });

  if (existingCartItem) {
    return await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + quantity },
    });

  } else {
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

  // Update the cart item with the new quantity
  return await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity },
  });
};

const getCartItems = async (userId: string) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      medicine: {
        select: {
          name: true,
          price: true,
          img: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return cartItems.map((item) => ({
    medicineId: item.medicineId,
    quantity: item.quantity,
    name: item.medicine.name,
    price: item.medicine.price,
    img: item.medicine.img,
    category: item.medicine.category.name,
  }));
};

export const cartService = {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCartItems,
};
