import { Router } from "express";
import { prisma } from "../lib/prisma";
import { buildDateFilter } from "../utils/buildDateFilter";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", async (req, res) => {
    const { startDate, endDate } = req.query;

    // Helper retorna algo como: {} ou { createdAt: { gte, lte } }
    const dateFilter = buildDateFilter(startDate, endDate);

    // VENDAS = categoryId 1 e 3 (ex: vendas + abertura de caixa)
    const vendasWhere = {
        categoryId: { in: [1, 3] },
        ...dateFilter,
    };

    // SAÍDAS = categoryId 2 e 4
    const saidasWhere = {
        categoryId: { in: [2, 4] },
        ...dateFilter,
    };

    // Soma + quantidade de VENDAS
    const vendasAgg = await prisma.transaction.aggregate({
        where: vendasWhere,
        _sum: { value: true },
        _count: { _all: true },
    });

    // Soma + quantidade de SAÍDAS
    const saidasAgg = await prisma.transaction.aggregate({
        where: saidasWhere,
        _sum: { value: true },
        _count: { _all: true },
    });

    // Vendas por método de pagamento
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
    });
});
