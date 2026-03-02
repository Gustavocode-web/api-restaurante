import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validate } from "../middlewares/validate";
import {
  createTransactionSchema,
  getTransactionByIdSchema,
  updateTransactionSchema,
} from "../schemas/transactions.schemas";
import {
  createTransactionController,
  getTransactionByIdController,
  getTransactionsController,
  updateTransactionController,
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

transactionsRoutes.patch(
  "/:id",
  validate(updateTransactionSchema),
  asyncHandler(updateTransactionController)
);



