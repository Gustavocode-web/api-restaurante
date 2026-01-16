import { Router } from "express";
import { prisma } from "../lib/prisma";
import { json } from "stream/consumers";

export const categoriesRoutes = Router();

// Rota para obter todas as categorias
categoriesRoutes.get("/", async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: {id: "asc"}
  });
  return res.json(categories);
});

categoriesRoutes.post("/", async (req, res) => {
    const {type, name} = req.body;

    if(!type || !name){
        return res.status(400).json({error: "type e name são obrigatórios" });
    }
  const categoriesregistro = await prisma.category.create({
    data: {
      type,
      name
    }
  });
  return res.status(201).json(categoriesregistro);
});

