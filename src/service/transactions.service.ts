import { PaymentMethod } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";

type CreateTransactionInput = {
  value: number;
  paymentMethod: PaymentMethod;
  note?: string;
  categoryId: number;
};

export async function createTransaction(data: CreateTransactionInput) {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new AppError("Category does not exist", 404);
  }

  return prisma.transaction.create({
    data: {
      value: data.value,
      paymentMethod: data.paymentMethod,
      note: data.note ?? null,
      categoryId: data.categoryId,
    },
  });
}

export async function getTransactionById(id: number) {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  return transaction;
}

export async function getTransactions({
  page,
  limit,
  order,
}: {
  page: number;
  limit: number;
  order: "asc" | "desc";
}) {
  const skip = (page - 1) * limit;

  const total = await prisma.transaction.count();
  const totalPages = Math.ceil(total / limit);

  const transactions = await prisma.transaction.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: order },
    include: {
      category: {
        select: { name: true, type: true },
      },
    },
  });

  return {
    success: true,
    meta: {
      page,
      limit,
      total,
      totalPages,
      order,
    },
    data: transactions,
  };
}