import express from "express";
import cors from "cors";
import {prisma} from "./lib/prisma";
import { categoriesRoutes } from "./routes/categories";
import { transactionsRoutes } from "./routes/transactions";


const app = express();

// permite receber JSON no body das requisições
app.use(express.json());
// libera acesso (por enquanto sem restrição)
app.use(cors());

app.use("/categories", categoriesRoutes);
app.use("/transactions", transactionsRoutes);

//essa função realiza a consulta da quantas categorias existem no banco de dados, agora vou explicar por partes: trata-se de uma função get ou seja serve para pegar/consultar uma informação - é usado async pois trata-se de uma consulta banco de dados então se faz necessario um tempo para buscar essa informação e recebe-la na variavel por isso o await ou seja ele acessa o banco de dados na tabela categorias e faz a contagem de quantas existem - logo depois responde com um json e quantidade de categorias encontradas.
app.get("/db-check", async (req, res) => {
  const caregoriesCount = await prisma.category.count();
  return res.json({ ok: true, caregoriesCount });
})

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});




