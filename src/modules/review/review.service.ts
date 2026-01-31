import { prisma } from "../../lib/prisma";
import { userRole } from "../../middleware/middleare";

const addReview = async (customerId: string, payload: any) => {
  const { medicineId, rating, comment } = payload;

  const findMedicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: { name: true },
  });

  if (!findMedicine) {
    throw new Error(`Medicine with ID: ${medicineId} doesn't exists`);
  }

  const isExists = await prisma.review.findUnique({
    where: {
      customerId_medicineId: {
        customerId,
        medicineId,
      },
    },
  });

  if (isExists) {
    throw new Error("You already reviewed this medicine");
  }

  return await prisma.review.create({
    data: {
      customerId,
      medicineId,
      rating,
      comment,
    },
  });
};

const updateReview = async (id: string, customerId: string, payload: any) => {
  const isExists = await prisma.review.findUnique({
    where: { id },
    select: { customerId: true },
  });

  if (!isExists) {
    throw new Error(`Review with ID: ${id} doesn't exists`);
  }

  if (isExists.customerId !== customerId) {
    throw new Error("You can only update your own review");
  }

  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  let dataToUpdate: any = {};

  if (payload.rating !== undefined) {
    dataToUpdate.rating = payload.rating;
  }

  if (payload.comment !== undefined) {
    dataToUpdate.comment = payload.comment;
  }

  return await prisma.review.update({
    where: { id },
    data: dataToUpdate,
  });
};

const deleteReview = async (role: userRole, id: string, customerId: string) => {
  const isExists = await prisma.review.findUnique({
    where: { id },
    select: { customerId: true },
  });

  if (!isExists) {
    throw new Error(`Review with ID: ${id} doesn't exists`);
  }

  if (isExists.customerId !== customerId && role !== userRole.ADMIN) {
    throw new Error("You can only delete your own review");
  }

  return await prisma.review.delete({
    where: { id },
  });
};

const getReviewsByMedicine = async (medicineId: string) => {
  return await prisma.review.findMany({
    where: { medicineId },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const reviewService = {
  addReview,
  updateReview,
  deleteReview,
  getReviewsByMedicine,
};
