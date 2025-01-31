import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRouter from './router/auth.js';
import userRouter from './router/user.js';

import authMiddleware from './middleware/auth.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected.'))
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1);
    });

app.use('/api/auth', authRouter);
app.use('/api/user', authMiddleware, userRouter);

app.get('/', (req, res) => {
    res.json({ success: true, message: 'Welcome to the Authentication backend server.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running at: http://localhost:${PORT}`));
