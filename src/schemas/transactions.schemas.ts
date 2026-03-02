import { z } from 'zod';

export const createTransactionSchema = z.object({
    body: z.object({
        note: z.string().min(1, "description is required"),
        value: z.number().positive("value must be grather than 0"),
        categoryId: z.number().int().positive("category must be a positive integer"),
        paymentMethod: z.enum(["dinheiro", "pix", "cartao_credito", "cartao_debito"], {
            message: "paymentMethod must be one of: dinheiro, pix, cartao_credito, cartao_debito",
        }),
    })
})

export const getTransactionByIdSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("id must be a positive integer"),
    }),
})

export const gettransactionsSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(20),
        order: z.enum(["asc", "desc"]).default("desc"),
        startDate: z.string().date().optional(),
        endDate: z.string().date().optional(),
    }),
})

export const updateTransactionSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("id must be a positive integer"),
    }),
    body: z.object({
        note: z.string().min(1, "description is required").optional(),
        value: z.number().positive("value must be grather than 0").optional(),
        categoryId: z.number().int().positive("category must be a positive integer").optional(),
        paymentMethod: z.enum(["dinheiro", "pix", "cartao_credito", "cartao_debito"], {
            message: "paymentMethod must be one of: dinheiro, pix, cartao_credito, cartao_debito",
        }).optional(),
    })
})