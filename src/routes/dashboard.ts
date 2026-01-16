import { Prisma } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../lib/prisma";
import { count } from "console";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", async (req, res) => {
    // Total de transações
    /* const totalTransactions = await prisma.transaction.count();
      return res.json({ totalTransactions }); */

    const { startDate, endDate } = req.query;

    const where: any = {
        categoryId: 1,
    };

    if (typeof startDate === "string" || typeof endDate === "string") {
        where.createdAt = {};

        if (typeof startDate === "string") {
            const start = new Date(`${startDate}T00:00:00.000`);
            if (Number.isNaN(start.getTime())) {
                return res.status(400).json({ error: "startDate inválida. Use YYYY-MM-DD" });
            }
            where.createdAt.gte = start;
        }

        if (typeof endDate === "string") {
            const end = new Date(`${endDate}T23:59:59.999`);
            if (Number.isNaN(end.getTime())) {
                return res.status(400).json({ error: "endDate inválida. Use YYYY-MM-DD" });
            }
            where.createdAt.lte = end;
        }
    }


    const countTransactions = await prisma.transaction.aggregate({
        where,
        _sum: {
            value: true
        },
        _count: { _all: true },
    });

    const total_e_soma_por_metodo_pagamento = await prisma.transaction.groupBy({
        by: ['paymentMethod'],
        where,
        _sum: {
            value: true,
        },
        _count: {
            _all: true,
        },
    });





    return res.json({ "O valor total de todas as transações do tipo vendas: ": total_e_soma_por_metodo_pagamento, "Quantidade de transações do tipo vendas: ": countTransactions });


});