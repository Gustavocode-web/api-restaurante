import {z} from 'zod';

export const createTransactionSchema = z.object({
   body : z.object({
      note: z.string().min(1, "description is required"),  
      value: z.number().positive("value must be grather than 0"),
      categoryId: z.number().int().positive("category must be a positive integer"),
      paymentMethod: z.enum(["dinheiro", "pix", "cartao_credito", "cartao_debito"], {
        message: "paymentMethod must be one of: dinheiro, pix, cartao_credito, cartao_debito",
      }),
   })
})