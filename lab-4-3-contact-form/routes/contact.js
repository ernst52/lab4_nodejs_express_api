const express = require('express');
const router = express.Router();
const { validateContact } = require('../middleware/validation');
const { appendToJsonFile, readJsonFile } = require('../middleware/fileManager');

// POST /api/contact → save contact
router.post('/', validateContact, async (req, res) => {
    try {
        const newContact = await appendToJsonFile('contacts.json', req.body);
        if (newContact) {
            return res.json({
                success: true,
                message: 'Contact saved successfully',
                data: newContact
            });
        } else {
            throw new Error('Failed to save contact');
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/contact → get all contacts (with simple pagination)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const allContacts = await readJsonFile('contacts.json');
        const start = (page - 1) * limit;
        const paginated = allContacts.slice(start, start + limit);

        res.json({
            success: true,
            page,
            limit,
            total: allContacts.length,
            data: paginated
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
