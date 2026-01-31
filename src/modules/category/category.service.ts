import { Category } from "../../../generated/prisma/client";
import paginationAndSortingHelper from "../../helper/paginationAndSortingHelper";
import { prisma } from "../../lib/prisma";

const addCategory = async (payload: Category) => {
  const isExists = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
    select: {
      name: true,
    },
  });

  if (isExists) {
    throw new Error(`category: ${isExists.name} already exists`);
  }

  return await prisma.category.create({
    data: payload,
  });
};

const changeStatus = async (id: string, name?: string, status?: boolean) => {
  const isExists = await prisma.category.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
    },
  });

  if (!isExists) {
    throw new Error(`category with ID: ${id} doesn't exists`);
  }

  let dataToUpdate: { name?: string; status?: boolean } = {};

  if (name !== undefined) {
    dataToUpdate.name = name;
  }

  if (status !== undefined) {
    dataToUpdate.status = status;
  }

  return await prisma.category.update({
    where: {
      id,
    },
    data: dataToUpdate,
    select: { name: true, isActive: true },
  });
};

const getAllCategory = async (query: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationAndSortingHelper(query);
  const { isActive } = query;

  const where: any = {};

  // if (isActive === "true") {
  //   where.isActive = true;
  // }

  // if (isActive === "false") {
  //   where.isActive = false;
  // }

  if (isActive !== undefined) {
    where.isActive = isActive === "true";
  }

  const result = await prisma.category.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.category.count({
    where,
  });

  return {
    Data: result,
    total,
    skip,
    limit,
    currentPage: page,
    totalPage: Math.ceil(total / limit),
  };
};

const deleteCategory = async (id: string) => {
  const isExists = await prisma.category.findUnique({
    where: { id },
    select: { name: true },
  });

  if (!isExists) {
    throw new Error(`category with ID: ${id} doesn't exists!`);
  }

  return await prisma.category.delete({
    where: { id },
    select: { name: true },
  });
};

export const categoryService = {
  addCategory,
  changeStatus,
  getAllCategory,
  deleteCategory,
};
