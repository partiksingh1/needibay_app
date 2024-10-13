// Distributor Signup Schema
import { z } from "zod";
const DistributorSignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    phone: z.string().optional(),
    distributorId: z.string().min(1),
    panNumber: z.string().optional(),
    city: z.string().optional(),
    gstId: z.string().optional(),
    address: z.string().optional(),
});

// Distributor Signin Schema
const DistributorSigninSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
export type DistributorSignup = z.infer<typeof DistributorSignupSchema>;
export type DistributorSignin = z.infer<typeof DistributorSigninSchema>;