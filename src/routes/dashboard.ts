import { Prisma } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../lib/prisma";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", async (req, res) => {
    // Total de transações
    /* const totalTransactions = await prisma.transaction.count();
      return res.json({ totalTransactions }); */

    const totalValue = await prisma.transaction.aggregate({
        where: {
            categoryId: 1 
        },
        _sum: {
            value: true,
        },
    });

    const countTransactions = await prisma.transaction.count({
        where: {
            categoryId: 1 
        },
    });

    return res.json({"O valor total de todas as transações do tipo vendas: ": totalValue, "Quantidade de transações do tipo vendas: ": countTransactions });
    

});