// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JWTPayload } from '../types/auth.types';

const prisma = new PrismaClient();

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
             res.status(401).json({ error: 'Authentication required' });
             return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }
};

export const authorizeAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.user?.role !== 'ADMIN') {
             res.status(403).json({ error: 'Admin access required' });
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
};