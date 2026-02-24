import { Router } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validate } from "../middlewares/validate";
import { createCategorySchema } from "../schemas/categories.schemas";
import { createCategoryController } from "../controllers/categories.controllers";

export const categoriesRoutes = Router();

categoriesRoutes.post(
  "/",
  validate(createCategorySchema),
  asyncHandler(createCategoryController)
);

categoriesRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });

    return res.json({
      success: true,
      data: categories,
    });
  })
);

