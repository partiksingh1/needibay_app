
// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../types/auth.types';

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Internal Server Error'
    });
};
