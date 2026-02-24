import { Request, response } from "express";
import { createTransaction } from "../service/transactions.service";

export async function createTransactionController(req: Request, res = response) {   
    const { value, paymentMethod, categoryId, note } = req.body;

    const transaction = await createTransaction({
        value,
        paymentMethod,
        categoryId,
        note
    });
    return res.status(201).json({
        success: true,
        data: transaction,
    });
}