const express = require('express');
const router = express.Router();
const { validateFeedback } = require('../middleware/validation');
const { appendToJsonFile, readJsonFile } = require('../middleware/fileManager');

// POST /api/feedback → save feedback
router.post('/', validateFeedback, async (req, res) => {
    try {
        const newFeedback = await appendToJsonFile('feedback.json', req.body);
        if (newFeedback) {
            return res.json({
                success: true,
                message: 'Feedback saved successfully',
                data: newFeedback
            });
        } else {
            throw new Error('Failed to save feedback');
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/feedback/stats → return feedback stats
router.get('/stats', async (req, res) => {
    try {
        const feedbacks = await readJsonFile('feedback.json');
        const total = feedbacks.length;
        const ratingSum = feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0);
        const avgRating = total > 0 ? (ratingSum / total).toFixed(2) : 0;

        res.json({
            success: true,
            totalFeedbacks: total,
            averageRating: avgRating
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
