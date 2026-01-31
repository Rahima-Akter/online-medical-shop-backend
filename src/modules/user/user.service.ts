import paginationAndSortingHelper from "../../helper/paginationAndSortingHelper";
import { prisma } from "../../lib/prisma";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import bcrypt from "bcryptjs";

const getAllUsers = async (query: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationAndSortingHelper(query);
  const { status, userId } = query;

  const where: any = {};

  if (status) {
    where.status = status.toUpperCase();
  }

  if (userId) {
    where.id = userId;
  }

  const totalUsers = await prisma.user.count({
    where,
  });

  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return {
    users,
    total: totalUsers,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit),
  };
};

// Get a user by id
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.delete({
    where: { id },
  });
};

const getOwnAccount = async (userId: string) => {
  // const match = await prisma.user.findUnique({
  //   where: { id: userId },
  // });

  // if (!match) {
  //   throw new Error("Not Allowed!");
  // }
  if (!userId) {
    throw new Error("You Are Not Authorized!");
  }

  const result = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!result) {
    throw new Error("User not found");
  }

  return result;
};

const updateOwnAccount = async (
  userId: string,
  payload: {
    name?: string;
    image?: string;
    blood_type?: string;
    phone_number?: string;
    date_of_birth?: Date;
    default_shipping_address?: string;
  },
) => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const allowedFields: any = {};
  if (payload.name) {
    allowedFields.name = payload.name;
  }
  if (payload.image) {
    allowedFields.image = payload.image;
  }
  if (payload.blood_type) {
    allowedFields.blood_type = payload.blood_type;
  }
  if (payload.phone_number) {
    allowedFields.phone_number = payload.phone_number;
  }
  if (payload.date_of_birth) {
    allowedFields.date_of_birth = payload.date_of_birth;
  }
  if (payload.default_shipping_address) {
    allowedFields.default_shipping_address = payload.default_shipping_address;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: allowedFields,
  });

  return updatedUser;
};

const updateUserPassword = async (
  loggedInUser: string,
  newPassword: string,
  currentPassword: string,
) => {
  if (!currentPassword) {
    throw new Error("Current password is required");
  }

  const userAccount = await prisma.account.findFirst({
    where: { userId: loggedInUser },
    select: { password: true },
  });

  if (!userAccount) {
    throw new Error("User not found");
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    userAccount.password as string,
  );
  console.log({ isCurrentPasswordValid });

  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect!");
  }

  if (currentPassword === newPassword) {
    throw new Error("New password cannot be the same as current password!");
  }

  const hashedNewPassword = await hashPassword(newPassword);

  // await prisma.account.update({
  //   where: { id: userAccount.id},
  //   data: { password: hashedNewPassword },
  // });

  return {
    success: true,
    msg: "Password updated",
  };
}; //❌ work with it later!!

export const userService = {
  getAllUsers,
  getUserById,
  deleteUser,
  getOwnAccount,
  updateOwnAccount,
  updateUserPassword,
};
