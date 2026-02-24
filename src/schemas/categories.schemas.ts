import {z} from 'zod';

export const createCategorySchema = z.object({
   body : z.object({
      name: z.string().min(1, "name is required"),
      type: z.enum(["entrada", "saida"], {
        message: "type must be one of: entrada, saida",
      }),  
   })
})