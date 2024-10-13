// src/app.ts
import express from 'express';
import cors from 'cors';
import {errorHandler} from "./middleware/error.middleware";
import {authRouter} from "./routes/auth.routes";
import {adminRoute} from "./routes/adminRoutes";
import {shopRouter} from "./routes/salespersonRoute";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/admin',adminRoute)
app.use('/salesperson',shopRouter)
// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;