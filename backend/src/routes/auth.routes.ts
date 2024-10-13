import { Router } from 'express';
import { createAdmin, createSalesperson, createDistributor, login } from "../controllers/authController";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";

const router = Router();

// Public Routes
router.post('/login', login);

// Admin-only Routes
router.post('/createAdmin', authenticate, authorizeAdmin, createAdmin);
router.post('/create-salesperson', authenticate, authorizeAdmin, createSalesperson);
router.post('/create-distributor', authenticate, authorizeAdmin, createDistributor);

export const authRouter = router;
