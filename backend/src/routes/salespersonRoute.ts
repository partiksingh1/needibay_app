import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {createShop,createOrder} from "../controllers/salespersonController";

const router = Router();

// Protected route for creating a shop
router.post('/create-shop', authenticate, createShop);
router.post('/create-order', authenticate, createOrder);

export const shopRouter = router;
