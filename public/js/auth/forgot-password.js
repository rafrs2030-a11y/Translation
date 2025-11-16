/**
 * Forgot Password Page JavaScript
 */

import { authStore } from '../stores/authStore.js';
import { validateEmail } from '../utils/validators.js';

// DOM Elements
let form, submitBtn, alertContainer, successMessage;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initEventListeners();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    form = document.getElementById('forgot-password-form');
    submitBtn = document.getElementById('submit-btn');
    alertContainer = document.getElementById('alert-container');
    successMessage = document.getElementById('success-message');
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Clear error on input
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', () => {
        emailInput.classList.remove('error');
        const errorDiv = emailInput.parentElement.parentElement.querySelector('.form-error');
        if (errorDiv) errorDiv.remove();
    });
}

/**
 * Handle form submission
 */
async function handleSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearAlerts();
    
    // Get email
    const email = document.getElementById('email').value.trim().toLowerCase();
    
    // Validate
    if (!validateFormEmail(email)) {
        return;
    }
    
    // Show loading
    setLoading(true);
    
    try {
        // Request password reset
        const result = await authStore.requestPasswordReset(email);
        
        if (result.success) {
            // Hide form and show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
        } else {
            showAlert(
                result.error || 'فشل إرسال رابط الاستعادة. يرجى المحاولة مرة أخرى.',
                'error'
            );
        }
    } catch (error) {
        console.error('Password reset error:', error);
        showAlert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
        setLoading(false);
    }
}

/**
 * Validate email
 */
function validateFormEmail(email) {
    const emailValidation = validateEmail(email);
    
    if (!emailValidation.valid) {
        showFieldError('email', emailValidation.error);
        return false;
    }
    
    return true;
}

/**
 * Show field error
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('error');
    
    const container = field.parentElement.parentElement;
    let errorDiv = container.querySelector('.form-error');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        container.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        <span>${message}</span>
    `;
    alertContainer.appendChild(alert);
}

/**
 * Clear alerts
 */
function clearAlerts() {
    alertContainer.innerHTML = '';
}

/**
 * Get alert icon
 */
function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Set loading state
 */
function setLoading(loading) {
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
            <span>جاري الإرسال...</span>
        `;
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <i class="fas fa-paper-plane"></i>
            <span>إرسال رابط الاستعادة</span>
        `;
    }
}

