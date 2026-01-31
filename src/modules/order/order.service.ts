import { Request } from "express";
import { OrderStatus } from "../../../generated/prisma/enums";
import paginationAndSortingHelper from "../../helper/paginationAndSortingHelper";
import { prisma } from "../../lib/prisma";
import { userRole } from "../../middleware/middleare";

// Get all orders for seller, customer, or admin
const getAllOrders = async (role: userRole, userId: string, query: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationAndSortingHelper(query);

  if (role === userRole.SELLER) {
    // Seller sees orders that contain their products
    const orders = await prisma.order.findMany({
      where: {
        items: {
          // Explicitly matching order items to the seller's product
          every: {
            sellerId: userId, // This checks if every order item has the seller's ID
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        items: true, // Include order items (product details)
      },
    });

    const total = await prisma.order.count({
      where: {
        items: {
          every: {
            sellerId: userId, // Explicit check for all items belonging to the seller
          },
        },
      },
    });

    return {
      data: orders,
      total,
      limit,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  if (role === userRole.CUSTOMER) {
    // Customer sees their own orders
    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        items: true,
      },
    });

    const total = await prisma.order.count({
      where: { customerId: userId },
    });

    return {
      data: orders,
      total,
      limit,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  if (role === userRole.ADMIN) {
    // Admin can see all orders
    const orders = await prisma.order.findMany({
      skip,
      take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        items: true,
      },
    });

    const total = await prisma.order.count();

    return {
      data: orders,
      total,
      limit,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  throw new Error("Forbidden: You don't have permission to view orders");
};

// Get a single order (Admin, Seller, or Customer)
const getSingleOrder = async (
  orderId: string,
  userId: string,
  role: string,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true, // Include order items (medicine details)
    },
  });

  if (!order) return null;

  if (role === userRole.ADMIN) {
    return order; // Admin can see any order
  }

  if (role === userRole.SELLER) {
    // Seller can view the order only if it's associated with their product
    const orderItemBelongsToSeller = order.items.some(
      (item) => item.sellerId === userId,
    );
    if (orderItemBelongsToSeller) {
      return order;
    }
  }

  if (role === userRole.CUSTOMER && order.customerId === userId) {
    return order; // Customer can only view their own orders
  }

  return null; // If none of the above conditions match
};

// Update the status of an order
const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  userId: string,
  role: string,
) => {
  const validStatuses = [
    "PLACED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true, // Include order items (medicine details)
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Seller can update status if the order contains their products
  if (role === userRole.SELLER) {
    const orderItemBelongsToSeller = order.items.some(
      (item) => item.sellerId === userId,
    );
    if (orderItemBelongsToSeller) {
      return prisma.order.update({
        where: { id: orderId },
        data: { status },
      });
    }
  }

  // Customer can only cancel their own orders
  if (
    role === userRole.CUSTOMER &&
    order.customerId === userId &&
    status === OrderStatus.CANCELLED
  ) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  // If none of the above conditions match, return null
  return null;
};

export const orderService = {
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
};
