import express from 'express';
import bcrypt from 'bcryptjs';

import User from '../model/userModel.js';
import { setToken } from '../util/authToken.js';
import userAuth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        const token = setToken(user.email);

        res.status(200).json({ success: true, token, message: 'Login successful' });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/verify', userAuth, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User verified successfully' });
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

export default router;
