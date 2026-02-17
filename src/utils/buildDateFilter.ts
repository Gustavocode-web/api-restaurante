import { Prisma } from "@prisma/client";

export function buildDateFilter(
  startDate?: unknown,
  endDate?: unknown
): Prisma.TransactionWhereInput {
  const filter: Prisma.TransactionWhereInput = {};

  // Só cria createdAt se alguma data existir
  if (typeof startDate === "string" || typeof endDate === "string") {
    const createdAt: Prisma.DateTimeFilter = {};

    if (typeof startDate === "string") {
      const start = new Date(`${startDate}T00:00:00.000`);
      if (!Number.isNaN(start.getTime())) createdAt.gte = start;
    }

    if (typeof endDate === "string") {
      const end = new Date(`${endDate}T23:59:59.999`);
      if (!Number.isNaN(end.getTime())) createdAt.lte = end;
    }

    if (Object.keys(createdAt).length > 0) {
      filter.createdAt = createdAt;
    }
  }

  return filter;
}
