import { Router } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validate } from "../middlewares/validate";
import {createTransactionSchema} from "../schemas/transactions";


export const transactionsRoutes = Router();

transactionsRoutes.post(
  "/",
  validate(createTransactionSchema),
  asyncHandler(async (req, res) => {
    const { value, paymentMethod, categoryId, note } = req.body;

    if (value === undefined || !paymentMethod || categoryId === undefined) {
      throw new AppError(
        "value, paymentMethod e categoryId são obrigatórios",
        400
      );
    }

    if (Number(value) <= 0) {
      throw new AppError("value deve ser maior que 0", 400);
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });

    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }

    const transaction = await prisma.transaction.create({
      data: {
        value,
        paymentMethod,
        categoryId: Number(categoryId),
        note,
      },
    });

    return res.status(201).json({
      success: true,
      data: transaction,
    });
  })
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
