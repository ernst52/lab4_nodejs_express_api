const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes and middleware
const foodRoutes = require('./routes/foods');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(logger); // use logger middleware

// Routes
app.get('/', (req, res) => {
    res.json({
        message: '🍜 Welcome to Food API!',
        version: '1.0.0',
        endpoints: {
            foods: '/api/foods',
            search: '/api/foods?search=stir-fry',
            category: '/api/foods?category=curry',
            spicy: '/api/foods?maxSpicy=3',
            vegetarian: '/api/foods?vegetarian=true',
            documentation: '/api/docs'
        }
    });
});

// Food routes
app.use('/api/foods', foodRoutes);

// API documentation
app.get('/api/docs', (req, res) => {
    res.json({
        message: '🍽️ Food API Documentation',
        endpoints: {
            listAllFoods: 'GET /api/foods',
            filterFoods: 'GET /api/foods?search=&category=&maxSpicy=&vegetarian=',
            stats: 'GET /api/stats'
        }
    });
});

// Stats endpoint
const foods = require('./data/foods.json');
app.get('/api/stats', (req, res) => {
    const totalFoods = foods.length;

    const categories = foods.reduce((acc, food) => {
        acc[food.category] = (acc[food.category] || 0) + 1;
        return acc;
    }, {});

    const maxSpicy = Math.max(...foods.map(f => f.spicy || 0));

    const vegetarianCount = foods.filter(f => f.vegetarian).length;

    res.json({
        totalFoods,
        foodsPerCategory: categories,
        maxSpicyLevel: maxSpicy,
        vegetarianCount
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        requestedUrl: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Food API Server running on http://localhost:${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
});
