import { prisma } from "../../lib/prisma";
import { Medicine } from "../../../generated/prisma/client";

// Add Medicine
const addMedicine = async (payload: Medicine) => {
  const isExists = await prisma.medicine.findUnique({
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

// UPDATE (partial update)
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

// PUBLIC - GET ALL + FILTER
const getAllMedicine = async (query: any) => {
  const { categoryId, manufacturer, minPrice, maxPrice } = query;

  return await prisma.medicine.findMany({
    where: {
      categoryId: categoryId || undefined,
      manufacturer: manufacturer || undefined,
      price: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      },
      isActive: true,
    },
  });
};

// PUBLIC - GET SINGLE
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
