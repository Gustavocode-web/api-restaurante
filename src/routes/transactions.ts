import { Router } from "express";
import { prisma } from "../lib/prisma";


export const transactionsRoutes = Router();

//Esse medoto post trata-se da criação de uma nova transação, nesse caso a gente recebe pelo body os dados necessarios para criar a transação, e os insere na constante que passara por uma verificação para ver se os campos obriagtorios foram preenchidos, caso falte algum campo obrigatorio ele retorna um status 400 com uma mensagem de erro, caso todos os campos obrigatorios estejam preenchidos ele cria a transação no banco de dados e retorna a transação criada com status 201 (criado com sucesso).
// POST /transactions -> cria uma entrada ou saída
transactionsRoutes.post("/", async (req, res) => {
  const { value, paymentMethod, categoryId, note } = req.body;

  // validação básica
  if (value === undefined || !paymentMethod || categoryId === undefined) {
    return res.status(400).json({
      error: "value, paymentMethod e categoryId são obrigatórios",
    });
  }


  const foundcategory = await prisma.category.findUnique({
    where: { id: Number(categoryId), },
  });

  if (foundcategory === null) {
    return res.status(404).json({ error: "Categoria nao encontrada" })
  }

  const transaction = await prisma.transaction.create({
    data: {
      value,
      paymentMethod,
      categoryId: Number(categoryId),
      note,
    },
  });


  return res.status(201).json(transaction);
});

transactionsRoutes.get("/", async (req, res) => {
  // order: asc | desc (default desc)
  const order = req.query.order === "asc" ? "asc" : "desc";

  // page: default 1 (se vier inválido, cai no 1)
  const pageRaw = Number(req.query.page);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  // limit: default 20, máximo 100
  const limitRaw = Number(req.query.limit);
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0
      ? Math.min(limitRaw, 100)
      : 20;

  const skip = (page - 1) * limit;

  // total de registros (para meta)
  const total = await prisma.transaction.count();
  const totalPages = Math.ceil(total / limit);

  const transactions = await prisma.transaction.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: order },
    include: {
      category: {
        select: {
          name: true,
          type: true,
        },
      },
    },
  });

  return res.json({
    meta: {
      page,
      limit,
      total,
      totalPages,
      order,
    },
    data: transactions,
  });
});


