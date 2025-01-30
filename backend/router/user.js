import express from 'express';

import User from '../model/userModel.js'; 
import Data from '../model/dataModel.js'; 

const router = express.Router();

router.use(async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Unauthorized! User not authenticated.' });
        }

        const user = await User.findOne({ email: req.user });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        req.userId = user._id;
        next();
    } catch (error) {
        console.error('Authentication Middleware Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.post('/data', async (req, res) => {
    try {
        const { name, dob } = req.body;
        if (!name || !dob) {
            return res.status(400).json({ success: false, error: 'Name and DOB are required' });
        }

        const newData = await Data.create({
            userId: req.userId,
            name,
            dob
        });

        res.status(201).json({ success: true, message: 'Data added successfully', data: newData });
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/data', async (req, res) => {
    try {
        let { page, limit } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const totalData = await Data.countDocuments({ userId: req.userId });
        const userData = await Data.find({ userId: req.userId })
            .skip((page - 1) * limit)
            .limit(limit);

        const dataWithAge = userData.map(entry => ({
            ...entry._doc,
            age: entry.age, 
        }));

        res.json({
            success: true,
            totalData,
            totalPages: Math.ceil(totalData / limit),
            currentPage: page,
            data: dataWithAge
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.put('/data/:id', async (req, res) => {
    try {
        const { name, dob } = req.body;

        const updatedData = await Data.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { name, dob },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ success: false, error: 'Data not found' });
        }

        res.json({ success: true, message: 'Data updated successfully', data: updatedData });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.delete('/data/:id', async (req, res) => {
    try {
        const deletedData = await Data.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!deletedData) {
            return res.status(404).json({ success: false, error: 'Data not found' });
        }

        res.json({ success: true, message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

export default router;
