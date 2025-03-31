const Medicine = require('../models/medicine');
const axios = require('axios');

exports.predictSideEffects = async (req, res) => {
    try {
        const { userId, name, ingredients, expiryDate } = req.body;
        const expiry = new Date(expiryDate);
        const today = new Date();

        let status, sideEffects = [];

        if (expiry < today) {
            // Call the Flask API for expired medicines
            const response = await axios.post(process.env.FLASK_API, { ingredients });
            sideEffects = response.data.sideEffects;
            status = "expired";
        } else {
            status = "not expired";
        }

        res.json({ status, sideEffects });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
