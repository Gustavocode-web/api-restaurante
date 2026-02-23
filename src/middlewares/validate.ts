import { ZodTypeAny, ZodError } from "zod";
import { AppError } from "../errors/AppError";

export function validate(schema: ZodTypeAny) {
  return (req: any, res: any, next: any) => {
    try {
      // Aqui o Zod valida tudo que a gente quiser validar
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Se passou na validação, deixa a requisição seguir
      return next();
    } catch (error) {
      // Se o erro foi de validação do Zod
      if (error instanceof ZodError) {
        // Transformamos os erros do Zod em uma mensagem única, legível
        const message = error.issues
          .map((err) => {
            const path = err.path.join("."); // ex: body.amount
            return path ? `${path}: ${err.message}` : err.message;
          })
          .join(", ");

        // Lançamos AppError para cair no seu errorHandler global
        throw new AppError(`Validation error: ${message}`, 400);
      }

      // Se for outro tipo de erro, não escondemos: repassamos
      throw error;
    }
  };
}