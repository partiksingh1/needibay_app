// src/validators/auth.validator.ts
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email().nonempty(),
    password: z.string().nonempty(),
});

export const createSalespersonSchema = z.object({
    email: z.string().email().nonempty(),
    name: z.string().nonempty(),
    phone: z.string().nonempty(),
    employeeId: z.string().nonempty(),
    panNumber: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
});

export const createDistributorSchema = z.object({
    email: z.string().email().nonempty(),
    name: z.string().nonempty(),
    phone: z.string().nonempty(),
    distributorId: z.string().nonempty(),
    panNumber: z.string().optional(),
    gstId: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().nonempty(),
    newPassword: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        })
        .nonempty(),
});
