import { OrderStatus } from "../../../generated/prisma/enums";
import paginationAndSortingHelper from "../../helper/paginationAndSortingHelper";
import { prisma } from "../../lib/prisma";
import { userRole } from "../../middleware/middleare";

export const createOrder = async (
  customerId: string,
  items: any[],
  shippingAddress: string,
) => {
  if (!items || items.length === 0) {
    throw new Error("Order must have at least one item");
  }

  let totalAmount = 0;
  const deliveryCharge = 100;

  const orderItems = items.map(async (item) => {
    const medicine = await prisma.medicine.findUnique({
      where: { id: item.medicineId },
    });

    if (!medicine) {
      throw new Error(`Medicine with ID ${item.medicineId} not found`);
    }

    const itemTotalPrice = medicine.price * item.quantity;
    totalAmount += itemTotalPrice;

    return {
      medicineId: item.medicineId,
      sellerId: item.sellerId,
      quantity: item.quantity,
      price: medicine.price,
    };
  });

  totalAmount = totalAmount + deliveryCharge;

  const orderItemsPromise = await Promise.all(orderItems);

  const order = await prisma.order.create({
    data: {
      customerId,
      shippingAddress: shippingAddress,
      totalPrice: totalAmount,
      status: OrderStatus.PLACED,
      items: {
        create: orderItemsPromise,
      },
    },
    include: {
      items: true,
    },
  });

  for (const item of orderItemsPromise) {
    await prisma.medicine.update({
      where: {
        id: item.medicineId,
      },
      data: {
        stock: { decrement: item.quantity },
      },
    });
  }

  return order;
};

const getAllOrders = async (role: userRole, userId: string, query: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationAndSortingHelper(query);

  if (role === userRole.SELLER) {
    const orders = await prisma.order.findMany({
      where: {
        items: {
          every: {
            sellerId: userId, // CHECKS FOR SELLER ID
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        items: true,
      },
    });

    const total = await prisma.order.count({
      where: {
        items: {
          every: {
            sellerId: userId, // CHECKS FOR SELLER ID
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
    const orders = await prisma.order.findMany({
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

const getSingleOrder = async (
  orderId: string,
  userId: string,
  role: string,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });

  if (!order) return null;

  if (role === userRole.ADMIN) {
    return order;
  }

  if (role === userRole.SELLER) {
    const orderItemBelongsToSeller = order.items.some(
      (item) => item.sellerId === userId,
    );
    if (orderItemBelongsToSeller) {
      return order;
    }
  }

  if (role === userRole.CUSTOMER && order.customerId === userId) {
    return order;
  }

  return null;
};

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
      items: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // check seller
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

  // check customer
  if (
    role === userRole.CUSTOMER &&
    order.customerId === userId &&
    status === OrderStatus.CANCELLED
  ) {
    // Add stock back to the medicines in the cancelled order
    for (const item of order.items) {
      await prisma.medicine.update({
        where: { id: item.medicineId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  return null;
};

export const orderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
};
