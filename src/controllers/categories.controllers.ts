import {request, response} from 'express';
import { createCategory } from '../service/categories.service';

export async function createCategoryController(req = request, res = response) {
    const { type, name } = req.body;
    const category = await createCategory({
        type,
        name    
    });
    return res.status(201).json({
        success: true,
        data: category,
    });
}