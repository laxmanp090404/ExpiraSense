const Medicine = require('../models/medicine');
import { post } from 'axios';

export async function predictSideEffects(req, res) {
    try {
        const { userId, name, ingredients, expiryDate } = req.body;

        const expiry = new Date(expiryDate);
        const today = new Date();

        let status, sideEffects = [];

        if (expiry < today) {
            // Call ML Model API
            const response = await post('http://127.0.0.1:5001/predict', { ingredients });
            sideEffects = response.data.sideEffects;
            status = "expired";
        } else {
            status = "not expired";
        }

        const newMedicine = new Medicine({ userId, name, ingredients, expiryDate, status, sideEffects });
        await newMedicine.save();

        res.json({ status, sideEffects });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
