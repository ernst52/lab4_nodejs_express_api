const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const FOODS_FILE = path.join(__dirname, '../data/foods.json');

// Helper function: load foods data
const loadFoods = () => {
    try {
        const data = fs.readFileSync(FOODS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading foods:', error);
        return [];
    }
};

// GET /api/foods - list all foods with optional filters
router.get('/', (req, res) => {
    try {
        let foods = loadFoods();
        const { search, category, maxSpicy, vegetarian, available, maxPrice } = req.query;

        if (search) {
            const s = search.toLowerCase();
            foods = foods.filter(f => f.name.toLowerCase().includes(s) || (f.description && f.description.toLowerCase().includes(s)));
        }
        if (category) {
            foods = foods.filter(f => f.category.toLowerCase() === category.toLowerCase());
        }
        if (maxSpicy) {
            foods = foods.filter(f => (f.spicy || 0) <= parseInt(maxSpicy));
        }
        if (vegetarian) {
            const veg = vegetarian.toLowerCase() === 'true';
            foods = foods.filter(f => f.vegetarian === veg);
        }
        if (available) {
            const avail = available.toLowerCase() === 'true';
            foods = foods.filter(f => f.available === avail);
        }
        if (maxPrice) {
            foods = foods.filter(f => (f.price || 0) <= parseFloat(maxPrice));
        }

        res.json({
            success: true,
            data: foods,
            total: foods.length,
            filters: { search, category, maxSpicy, vegetarian, available, maxPrice }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching foods' });
    }
});

// GET /api/foods/:id - get food by ID
router.get('/:id', (req, res) => {
    const foods = loadFoods();
    const id = parseInt(req.params.id);
    const food = foods.find(f => f.id === id);

    if (food) {
        res.json({ success: true, data: food });
    } else {
        res.status(404).json({ success: false, message: 'Food not found' });
    }
});

// GET /api/foods/category/:category - get foods by category
router.get('/category/:category', (req, res) => {
    const foods = loadFoods();
    const category = req.params.category.toLowerCase();
    const filtered = foods.filter(f => f.category.toLowerCase() === category);

    res.json({ success: true, data: filtered, total: filtered.length });
});

// GET /api/foods/random - get one random food
router.get('/random', (req, res) => {
    const foods = loadFoods();
    if (foods.length === 0) return res.status(404).json({ success: false, message: 'No foods available' });

    const randomIndex = Math.floor(Math.random() * foods.length);
    res.json({ success: true, data: foods[randomIndex] });
});

module.exports = router;
