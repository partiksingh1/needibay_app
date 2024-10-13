import { Router } from 'express';
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";
import {createProduct} from "../controllers/adminController";

const AdminRouter = Router();


// Admin-only Routes
AdminRouter.post('/createProduct', authenticate, authorizeAdmin, createProduct);

export const adminRoute = AdminRouter;

