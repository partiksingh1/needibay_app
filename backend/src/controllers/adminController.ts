import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProduct = async (req: Request, res: Response):Promise<any> => {
    try {
        const adminId = req.user?.id;
        const role = req.user?.role;

        if (!adminId || role !== 'ADMIN') {
             res.status(403).json({ error: 'Unauthorized action' });
            return
        }

        const { name, description, price, category, stock, sku, images } = req.body;

        // Validate input
        if (!name || !price || !category || !stock || !sku || !images) {
             res.status(400).json({ error: 'Missing required fields' });
            return
        }

        const existingProduct = await prisma.product.findUnique({
            where: { sku }
        });

        if (existingProduct) {
             res.status(400).json({ error: 'Product with this SKU already exists' });
            return
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                category,
                stock,
                sku,
                images,
                adminId,
            },
        });

        res.status(201).json({
            product,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
};
