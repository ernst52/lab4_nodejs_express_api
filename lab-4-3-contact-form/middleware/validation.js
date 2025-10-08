// Contact form validation
const validateContact = (req, res, next) => {
    const { name, email, subject, message, phone, company } = req.body;
    const errors = [];

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
        errors.push('Name must be a string between 2 and 100 characters');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
        errors.push('Valid email is required');
    }

    // Validate subject
    if (!subject || subject.trim().length < 5 || subject.trim().length > 200) {
        errors.push('Subject must be between 5 and 200 characters');
    }

    // Validate message
    if (!message || message.trim().length < 10 || message.trim().length > 1000) {
        errors.push('Message must be between 10 and 1000 characters');
    }

    // Validate phone (optional)
    const phoneRegex = /^[0-9]{9,10}$/;
    if (phone && !phoneRegex.test(phone.trim())) {
        errors.push('Phone must be 9-10 digits if provided');
    }

    // Validate company (optional)
    if (company && company.trim().length > 100) {
        errors.push('Company cannot exceed 100 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // Sanitize data
    req.body.name = name.trim();
    req.body.email = email.trim().toLowerCase();
    req.body.subject = subject.trim();
    req.body.message = message.trim();
    if (phone) req.body.phone = phone.trim();
    if (company) req.body.company = company.trim();

    next();
};

// Feedback validation
const validateFeedback = (req, res, next) => {
    const { rating, comment, email } = req.body;
    const errors = [];

    // Validate rating
    const ratingNum = parseInt(rating);
    if (!rating || isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        errors.push('Rating must be a number between 1 and 5');
    }

    // Validate comment
    if (!comment || comment.trim().length < 5 || comment.trim().length > 500) {
        errors.push('Comment must be between 5 and 500 characters');
    }

    // Validate email (optional)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email.trim())) {
        errors.push('Email must be valid if provided');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // Sanitize
    req.body.comment = comment.trim();
    if (email) req.body.email = email.trim().toLowerCase();
    req.body.rating = ratingNum;

    next();
};

module.exports = {
    validateContact,
    validateFeedback
};
