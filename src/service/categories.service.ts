import { TransactionType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";

type Createcategoryinput = {
    type: TransactionType;
    name: string;
};

export async function createCategory(data: Createcategoryinput) {

    const exists = await prisma.category.findFirst({ where: { name: data.name } });
    if (exists) throw new AppError("Category name already exists", 409);

    const category = await prisma.category.create({
        data: {
            type: data.type,
            name: data.name,
        },
    })
    return category;
}