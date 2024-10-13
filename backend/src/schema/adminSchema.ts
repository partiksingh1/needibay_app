import { z } from "zod";

// Admin Signup Schema
const AdminSignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6), // Minimum password length
    name: z.string().min(1),
    phone: z.string().optional(),
    adminCode: z.string().min(1),
});

// Admin Signin Schema
const AdminSigninSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
export type AdminSignup = z.infer<typeof AdminSignupSchema>;
export type AdminSignin = z.infer<typeof AdminSigninSchema>;