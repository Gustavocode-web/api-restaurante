import { Router } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";
import { asyncHandler } from "../middlewares/asyncHandler";

export const categoriesRoutes = Router();

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

categoriesRoutes.post(
  "/",
  asyncHandler(async (req, res) => {
    const { type, name } = req.body;

    if (!type || !name) {
      throw new AppError("type e name são obrigatórios", 400);
    }

    const category = await prisma.category.create({
      data: { type, name },
    });

    return res.status(201).json({
      success: true,
      data: category,
    });
  })
);
