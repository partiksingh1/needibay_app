// Salesperson Signup Schema
import { z } from "zod";

const SalespersonSignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    phone: z.string().optional(),
    employeeId: z.string().min(1),
    panNumber: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
});

// Salesperson Signin Schema
const SalespersonSigninSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
export type SalespersonSignup = z.infer<typeof SalespersonSignupSchema>;
export type SalespersonSignin = z.infer<typeof SalespersonSigninSchema>;