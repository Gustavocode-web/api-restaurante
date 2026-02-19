import { Router } from "express";
import { prisma } from "../lib/prisma";
import { buildDateFilter } from "../utils/buildDateFilter";
import { asyncHandler } from "../middlewares/asyncHandler";

export const reportsRoutes = Router();

reportsRoutes.get(
  "/categories",
  asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    const grouped = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: dateFilter,
      _sum: { value: true } as const,
      _count: { _all: true } as const,
    });

    if (grouped.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const categoryIds = grouped.map((g) => g.categoryId);

    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, type: true },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    const result = grouped
      .map((g) => {
        const cat = categoryMap.get(g.categoryId);
        if (!cat) return null;

        return {
          category: cat.name,
          type: cat.type,
          totalValue: Number(g._sum.value ?? 0),
          totalCount: g._count._all,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    return res.json({
      success: true,
      data: result,
    });
  })
);

reportsRoutes.get(
  "/payment-methods",
  asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    const grouped = await prisma.transaction.groupBy({
      by: ["paymentMethod"],
      where: dateFilter,
      _sum: { value: true } as const,
      _count: { _all: true } as const,
    });

    if (grouped.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const result = grouped.map((m) => ({
      paymentMethod: m.paymentMethod,
      totalValue: Number(m._sum.value ?? 0),
      totalCount: m._count._all,
    }));

    return res.json({
      success: true,
      data: result,
    });
  })
);
