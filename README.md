# api-restaurante

API REST para gerenciamento completo de restaurante. Projeto em desenvolvimento.

## Sobre

Backend responsável por toda a operação do restaurante: pedidos por mesa, impressão de comanda na cozinha, controle de mesas, fechamento de contas, gerenciamento de estoque e dashboard de faturamento.

## Funcionalidades

**Pedidos e Mesas**
- Registro de pedidos por mesa
- Impressão de comanda na cozinha
- Gerenciamento de comandas abertas
- Fechamento de conta por mesa

**Gestão**
- Controle de estoque
- Dashboard de faturamento
- Relatórios financeiros

> Projeto em desenvolvimento — novas funcionalidades sendo adicionadas.

## Tech Stack

**Core**
- Node.js — runtime
- TypeScript — static typing

**Banco de Dados**
- Prisma ORM — modelagem e acesso ao banco de dados

**Validação**
- Zod — schema validation

## Setup

```bash
npm install
```

Configure o banco de dados e rode as migrations:

```bash
npx prisma migrate dev
```

Inicie o servidor:

```bash
npm run dev
```

## Environment

Crie um arquivo `.env` na raiz do projeto com:

```env
DATABASE_URL=sua_url_do_banco
```
