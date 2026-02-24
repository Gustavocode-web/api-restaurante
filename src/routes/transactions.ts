import { Router } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validate } from "../middlewares/validate";
import {createTransactionSchema} from "../schemas/transactions.schemas";
import { createTransactionController } from "../controllers/transactions.controler";


export const transactionsRoutes = Router();

transactionsRoutes.post(
  "/",
  validate(createTransactionSchema),
  asyncHandler(createTransactionController)
);

transactionsRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const order = req.query.order === "asc" ? "asc" : "desc";

    const pageRaw = Number(req.query.page);
    const page =
      Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

    const limitRaw = Number(req.query.limit);
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(limitRaw, 100)
        : 20;

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

    return res.json({
      success: true,
      meta: {
        page,
        limit,
        total,
        totalPages,
        order,
      },
      data: transactions,
    });
  })
);

transactionsRoutes.get("/error-test", (req, res) => {
  throw new Error("Erro inesperado de teste");
});
