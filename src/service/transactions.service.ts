import { PaymentMethod } from '@prisma/client';
import {prisma} from '../lib/prisma';
import { AppError } from '../errors/AppError';

type CreateTransactionInput = {
  value: number;
  paymentMethod: PaymentMethod;
  note: string;
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