import { Request, Response } from "express";
import {
  createTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
} from "../service/transactions.service";
import { success } from "zod";

export async function createTransactionController(req: Request, res: Response) {
  const { value, paymentMethod, categoryId, note } = req.body;

  const transaction = await createTransaction({
    value,
    paymentMethod,
    categoryId,
    note,
  });

  return res.status(201).json({
    success: true,
    data: transaction,
  });
}

export async function getTransactionByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);

  const transaction = await getTransactionById(id);

  return res.json({
    success: true,
    data: transaction,
  });
}

export async function getTransactionsController(req: Request, res: Response) {
  const order: "asc" | "desc" = req.query.order === "asc" ? "asc" : "desc";

  const pageRaw = Number(req.query.page);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const limitRaw = Number(req.query.limit);
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 20;

  const result = await getTransactions({ page, limit, order });

  return res.json(result);
}

export async function updateTransactionController(req: Request, res: Response) {
  const id = Number(req.params.id);

  const updated = await updateTransaction(id, req.body)

  return res.json({
    success: true,
    data: updated,
  });
}