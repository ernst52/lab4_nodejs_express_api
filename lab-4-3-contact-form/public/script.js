// Global variables
let isSubmitting = false;

// DOM Elements
const contactForm = document.getElementById('contactForm');
const feedbackForm = document.getElementById('feedbackForm');
const statusMessages = document.getElementById('statusMessages');
const apiResults = document.getElementById('apiResults');
const ratingSlider = document.getElementById('rating');
const ratingValue = document.getElementById('ratingValue');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeForms();
    setupEventListeners();
});

function initializeForms() {
    // Update rating display
    ratingSlider.addEventListener('input', () => {
        ratingValue.textContent = ratingSlider.value;
    });
}

function setupEventListeners() {
    // Contact form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitContactForm();
    });

    // Feedback form submission
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitFeedbackForm();
    });

    // Real-time validation for inputs
    document.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => {
            const { isValid, message } = validateField(field.name, field.value);
            if (!isValid) {
                field.classList.add('invalid');
            } else {
                field.classList.remove('invalid');
            }
        });
    });
}

function validateField(fieldName, value) {
    let isValid = true;
    let message = '';

    if (!value || value.trim() === '') {
        isValid = false;
        message = `${fieldName} is required`;
    } else if (fieldName === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
        isValid = false;
        message = 'Invalid email format';
    }

    return { isValid, message };
}

async function submitContactForm() {
    if (isSubmitting) return;
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    
    try {
        isSubmitting = true;
        updateSubmitButton('contactSubmit', 'Sending...', true);
        
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showStatusMessage('✅ Contact submitted successfully!', 'success');
            contactForm.reset();
        } else {
            showStatusMessage(`❌ Error: ${result.message}`, 'error');
            if (result.errors) displayValidationErrors(result.errors);
        }
    } catch (error) {
        showStatusMessage('❌ Connection error', 'error');
        console.error('Error:', error);
    } finally {
        isSubmitting = false;
        updateSubmitButton('contactSubmit', 'Submit', false);
    }
}

async function submitFeedbackForm() {
    if (isSubmitting) return;
    
    const formData = new FormData(feedbackForm);
    const data = Object.fromEntries(formData.entries());
    data.rating = parseInt(data.rating);
    
    try {
        isSubmitting = true;
        updateSubmitButton('feedbackSubmit', 'Sending...', true);
        
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showStatusMessage('✅ Feedback submitted successfully!', 'success');
            feedbackForm.reset();
            ratingValue.textContent = '5';
        } else {
            showStatusMessage(`❌ Error: ${result.message}`, 'error');
            if (result.errors) displayValidationErrors(result.errors);
        }

    } catch (error) {
        showStatusMessage('❌ Connection error', 'error');
        console.error('Error:', error);
    } finally {
        isSubmitting = false;
        updateSubmitButton('feedbackSubmit', 'Submit Feedback', false);
    }
}

function showStatusMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message ${type}`;
    messageDiv.textContent = message;
    
    statusMessages.appendChild(messageDiv);
    
    setTimeout(() => messageDiv.remove(), 5000);
}

function updateSubmitButton(buttonId, text, disabled) {
    const button = document.getElementById(buttonId);
    button.textContent = text;
    button.disabled = disabled;
}

function displayValidationErrors(errors) {
    errors.forEach(error => showStatusMessage(`🔸 ${error}`, 'error'));
}

// API Testing Functions
async function loadContacts() {
    try {
        apiResults.textContent = 'Loading contacts...';
        const res = await fetch('/api/contact');
        const data = await res.json();
        apiResults.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        apiResults.textContent = 'Error loading contacts: ' + error.message;
    }
}

async function loadFeedbackStats() {
    try {
        apiResults.textContent = 'Loading feedback stats...';
        const res = await fetch('/api/feedback/stats');
        const data = await res.json();
        apiResults.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        apiResults.textContent = 'Error loading feedback stats: ' + error.message;
    }
}

async function loadAPIStatus() {
    try {
        apiResults.textContent = 'Loading API status...';
        const res = await fetch('/api/status');
        const data = await res.json();
        apiResults.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        apiResults.textContent = 'Error loading API status: ' + error.message;
    }
}

async function loadAPIDocs() {
    try {
        const response = await fetch('/api/docs');
        const data = await response.json();
        apiResults.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        apiResults.textContent = 'Error loading API docs: ' + error.message;
    }
}
