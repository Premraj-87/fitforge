const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// @desc    Get all scraped exercises
// @route   GET /api/data/exercises
// @access  Public
router.get('/exercises', (req, res) => {
    try {
        const filePath = path.join(__dirname, '../data/exercises.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            res.status(404).json({ message: 'Exercise database not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get nutrition database (static)
// @route   GET /api/data/nutrition
// @access  Public
router.get('/nutrition', (req, res) => {
    const foodDatabase = [
        // Indian Proteins
        { id: 11, name: 'Paneer (Raw)', portion: '100g', calories: 265, protein: 18, carbs: 1.2, fats: 20, type: 'Protein' },
        { id: 12, name: 'Soya Chunks (Boiled)', portion: '50g (dry)', calories: 172, protein: 26, carbs: 16, fats: 0.5, type: 'Protein' },
        { id: 13, name: 'Dahi (Plain Curd)', portion: '150g', calories: 90, protein: 5, carbs: 7, fats: 4.5, type: 'Protein' },
        { id: 14, name: 'Chicken Curry (Home style)', portion: '200g', calories: 240, protein: 25, carbs: 8, fats: 12, type: 'Protein' },
        { id: 15, name: 'Egg Bhurji', portion: '2 eggs', calories: 170, protein: 13, carbs: 2, fats: 12, type: 'Protein' },
        { id: 16, name: 'Tofu (Firm)', portion: '100g', calories: 144, protein: 15, carbs: 3, fats: 8, type: 'Protein' },
        // Indian Carbs
        { id: 17, name: 'Roti (Whole Wheat)', portion: '1 piece', calories: 120, protein: 4, carbs: 22, fats: 3, type: 'Carbs' },
        { id: 18, name: 'White Rice (Cooked)', portion: '150g', calories: 195, protein: 4, carbs: 42, fats: 0.5, type: 'Carbs' },
        { id: 19, name: 'Toor Dal (Cooked)', portion: '150g', calories: 180, protein: 11, carbs: 32, fats: 1, type: 'Carbs' },
        { id: 20, name: 'Chana Masala', portion: '150g', calories: 240, protein: 12, carbs: 35, fats: 6, type: 'Carbs' },
        { id: 21, name: 'Rajma (Kidney Beans)', portion: '150g', calories: 210, protein: 10, carbs: 38, fats: 2, type: 'Carbs' },
        { id: 22, name: 'Poha', portion: '150g', calories: 250, protein: 5, carbs: 45, fats: 6, type: 'Carbs' },
        { id: 23, name: 'Idli', portion: '2 pieces', calories: 116, protein: 4, carbs: 24, fats: 0.4, type: 'Carbs' },
        { id: 24, name: 'Upma', portion: '150g', calories: 220, protein: 6, carbs: 35, fats: 7, type: 'Carbs' },
        { id: 25, name: 'Moong Dal Chilla', portion: '1 piece', calories: 130, protein: 6, carbs: 18, fats: 4, type: 'Carbs' },
        { id: 26, name: 'Sweet Potato (Shakarkandi)', portion: '150g', calories: 135, protein: 3, carbs: 31, fats: 0.2, type: 'Carbs' },
        // Veggies / Sides
        { id: 27, name: 'Mixed Veg Sabzi (Dry)', portion: '150g', calories: 120, protein: 3, carbs: 12, fats: 7, type: 'Veggies' },
        { id: 28, name: 'Bhindi Masala (Okra)', portion: '150g', calories: 140, protein: 3, carbs: 10, fats: 10, type: 'Veggies' },
        { id: 29, name: 'Palak Paneer', portion: '200g', calories: 280, protein: 14, carbs: 10, fats: 22, type: 'Veggies' },
        { id: 30, name: 'Cucumber Salad (Kachumber)', portion: '100g', calories: 20, protein: 1, carbs: 4, fats: 0, type: 'Veggies' },
        // Fats
        { id: 31, name: 'Desi Ghee', portion: '1 tbsp', calories: 130, protein: 0, carbs: 0, fats: 14, type: 'Fats' },
        { id: 32, name: 'Almonds (Badam)', portion: '30g', calories: 170, protein: 6, carbs: 6, fats: 15, type: 'Fats' },
        { id: 33, name: 'Walnuts (Akhrot)', portion: '30g', calories: 185, protein: 4, carbs: 4, fats: 18, type: 'Fats' },
        { id: 34, name: 'Peanuts (Roasted)', portion: '30g', calories: 160, protein: 7, carbs: 5, fats: 14, type: 'Fats' }
    ];
    res.json(foodDatabase);
});

module.exports = router;
