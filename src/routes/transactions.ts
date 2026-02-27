import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validate } from "../middlewares/validate";
import {
  createTransactionSchema,
  getTransactionByIdSchema,
} from "../schemas/transactions.schemas";
import {
  createTransactionController,
  getTransactionByIdController,
  getTransactionsController,
} from "../controllers/transactions.controler";

export const transactionsRoutes = Router();

transactionsRoutes.post(
  "/",
  validate(createTransactionSchema),
  asyncHandler(createTransactionController)
);

transactionsRoutes.get("/", asyncHandler(getTransactionsController));

transactionsRoutes.get(
  "/:id",
  validate(getTransactionByIdSchema),
  asyncHandler(getTransactionByIdController)
);