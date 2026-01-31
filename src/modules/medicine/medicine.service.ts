import { prisma } from "../../lib/prisma";
import { Medicine } from "../../../generated/prisma/client";
import { userRole } from "../../middleware/middleare";

// Add Medicine
const addMedicine = async (payload: Medicine) => {
  const findSeller = await prisma.user.findUnique({
    where: { id: payload.sellerId },
    select: { id: true, name: true, role: true },
  });

  if (!findSeller) {
    throw new Error(`Seller with ID: ${payload.sellerId} doesn't exist`);
  }

  if (findSeller.role !== userRole.SELLER) {
    throw new Error("Only SELLER can add medicine");
  }

  if (findSeller.id !== payload.sellerId) {
    throw new Error("Seller can only add medicine for themselves");
  }

  const findCategory = await prisma.category.findUnique({
    where: { id: payload.categoryId },
    select: { name: true },
  });

  if (!findCategory) {
    throw new Error(`Category with ID: ${payload.categoryId} doesn't exist`);
  }

  const isExists = await prisma.medicine.findFirst({
    where: {
      name: payload.name,
    },
  });

  if (isExists) {
    throw new Error(`Medicine with name: ${isExists.name} already exists`);
  }

  return await prisma.medicine.create({
    data: payload,
  });
};

// UPDATE
const updateMedicine = async (id: string, payload: Partial<Medicine>) => {
  const isExists = await prisma.medicine.findUnique({
    where: { id },
    select: { name: true },
  });

  if (!isExists) {
    throw new Error(`medicine with ID: ${id} doesn't exists`);
  }

  return await prisma.medicine.update({
    where: { id },
    data: payload,
  });
};

// DELETE
const deleteMedicine = async (id: string) => {
  const isExists = await prisma.medicine.findUnique({
    where: { id },
    select: { name: true },
  });

  if (!isExists) {
    throw new Error(`medicine with ID: ${id} doesn't exists`);
  }

  return await prisma.medicine.delete({
    where: { id },
    select: { name: true },
  });
};

// GET ALL
const getAllMedicine = async (query: any) => {
  const { name, categoryId, manufacturer, minPrice, maxPrice } = query;

  let priceFilter: any = {};

  if (minPrice !== undefined) {
    priceFilter.gte = Number(minPrice);
  }

  if (maxPrice !== undefined) {
    priceFilter.lte = Number(maxPrice);
  }

  const where: any = { isActive: true };
  if (name !== undefined) {
    where.name = { contains: name, mode: "insensitive" };
  }

  if (categoryId !== undefined) {
    where.categoryId = categoryId;
  }

  if (manufacturer !== undefined) {
    where.manufacturer = { contains: manufacturer, mode: "insensitive" };
  }

  if (priceFilter.gte !== undefined || priceFilter.lte !== undefined) {
    where.price = priceFilter;
  }

  return await prisma.medicine.findMany({
    where,
  });
  
};

// GET SINGLE
const getSingleMedicine = async (id: string) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
  });

  if (!medicine) {
    throw new Error(`medicine with ID: ${id} doesn't exists`);
  }

  return medicine;
};

export const medicineService = {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getAllMedicine,
  getSingleMedicine,
};
