import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateRandomPassword } from "../utils/password.utils";

const prisma = new PrismaClient();

// Admin signup
export const createAdmin = async (req: Request, res: Response):Promise<void>=> {
    try {
        const { email, password, name, phone, adminCode } = req.body;

        const existingAdmin = await prisma.admin.findFirst({
            where: { OR: [{ email }, { adminCode }] }
        });

        if (existingAdmin) {
             res.status(400).json({
                error: 'Admin with this email or admin code already exists'
            });
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                adminCode,
            },
        });

        const token = jwt.sign(
            { id: admin.id, role: 'ADMIN' },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            user: { ...admin, password: undefined },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create admin' });
    }
};

// Create Salesperson
export const createSalesperson = async (req: Request, res: Response):Promise<void>=> {
    try {
        const adminId = req.user?.id;
        if (!adminId) {res.status(403).json({ error: 'Unauthorized action' });
            return}

        const {
            email, name, phone, employeeId, panNumber, city, address
        } = req.body;

        const temporaryPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        const salesperson = await prisma.salesperson.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                employeeId,
                panNumber,
                city,
                address,
                admin: { connect: { id: adminId } }
            },
        });

        res.status(201).json({
            user: { ...salesperson, password: undefined },
            temporaryPassword // Only in development
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create salesperson' });
    }
};

// Create Distributor
export const createDistributor = async (req: Request, res: Response):Promise<void>=> {
    try {
        const adminId = req.user?.id;
        if (!adminId) {
            res.status(403).json({error: 'Unauthorized action'});
            return;
        }

        const {
            email, name, phone, distributorId, panNumber, gstId, city, address
        } = req.body;

        const temporaryPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        const distributor = await prisma.distributor.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                distributorId,
                panNumber,
                gstId,
                city,
                address,
                admin: { connect: { id: adminId } }
            },
        });

        res.status(201).json({
            user: { ...distributor, password: undefined },
            temporaryPassword // Only in development
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create distributor' });
    }
};

// Universal login
export const login = async (req: Request, res: Response):Promise<void>=> {
    try {
        const { email, password } = req.body;

        // Check for user in Admin, Salesperson, and Distributor tables
        let user: any = await prisma.admin.findUnique({ where: { email } }) ||
            await prisma.salesperson.findUnique({ where: { email } }) ||
            await prisma.distributor.findUnique({ where: { email } });

        if (!user) {
            res.status(401).json({error: 'Invalid credentials'});
            return
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({error: 'Invalid credentials'});
            return;
        }

        const role = user.adminCode ? 'ADMIN' : user.employeeId ? 'SALESPERSON' : 'DISTRIBUTOR';

        const token = jwt.sign(
            { id: user.id, role },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.json({
            user: { ...user, password: undefined },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
};
