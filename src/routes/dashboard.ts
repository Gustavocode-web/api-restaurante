import { Router } from "express";
import { prisma } from "../lib/prisma";
import { buildDateFilter } from "../utils/buildDateFilter";
import { asyncHandler } from "../middlewares/asyncHandler";

export const dashboardRoutes = Router();

dashboardRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const dateFilter = buildDateFilter(startDate, endDate);

    const vendasWhere = {
      categoryId: { in: [1, 3] },
      ...dateFilter,
    };

    const saidasWhere = {
      categoryId: { in: [2, 4] },
      ...dateFilter,
    };

    const vendasAgg = await prisma.transaction.aggregate({
      where: vendasWhere,
      _sum: { value: true },
      _count: { _all: true },
    });

    const saidasAgg = await prisma.transaction.aggregate({
      where: saidasWhere,
      _sum: { value: true },
      _count: { _all: true },
    });

    const vendasPorMetodo = await prisma.transaction.groupBy({
      by: ["paymentMethod"],
      where: vendasWhere,
      _sum: { value: true },
      _count: { _all: true },
    });

    const vendasTotalValue = Number(vendasAgg._sum.value ?? 0);
    const vendasTotalCount = vendasAgg._count._all;

    const saidasTotalValue = Number(saidasAgg._sum.value ?? 0);
    const saidasTotalCount = saidasAgg._count._all;

    const saldo = vendasTotalValue - saidasTotalValue;

    const vendasPorMetodoFormatado = vendasPorMetodo.map((row) => ({
      paymentMethod: row.paymentMethod,
      totalValue: Number(row._sum.value ?? 0),
      totalCount: row._count._all,
    }));

    return res.json({
      success: true,
      data: {
        periodo: {
          startDate: typeof startDate === "string" ? startDate : null,
          endDate: typeof endDate === "string" ? endDate : null,
        },
        vendas: {
          totalValue: vendasTotalValue,
          totalCount: vendasTotalCount,
          byPaymentMethod: vendasPorMetodoFormatado,
        },
        saidas: {
          totalValue: saidasTotalValue,
          totalCount: saidasTotalCount,
        },
        saldo,
      },
    });
  })
);
