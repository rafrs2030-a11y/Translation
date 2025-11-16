/**
 * Login Page JavaScript
 */

import authStore from '../stores/authStore.js';
import { guestOnly } from '../utils/auth-guard.js';

// DOM Elements
let form, submitBtn, alertContainer;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await guestOnly(); // Redirect if already logged in
    
    initElements();
    initEventListeners();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    form = document.getElementById('login-form');
    submitBtn = document.getElementById('submit-btn');
    alertContainer = document.getElementById('alert-container');
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', togglePasswordVisibility);
    });
    
    // Clear error on input
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorDiv = input.parentElement.parentElement.querySelector('.form-error');
            if (errorDiv) errorDiv.remove();
        });
    });
}

/**
 * Handle form submission
 */
async function handleSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearAlerts();
    
    // Get form data
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validate
    if (!validateForm(email, password)) {
        return;
    }
    
    // Show loading
    setLoading(true);
    
    try {
        // Login
        const result = await authStore.login(email, password);
        
        if (result.success) {
            // Show success message
            showAlert('تم تسجيل الدخول بنجاح! جاري التحويل...', 'success');
            
            // Get user data
            const user = await authStore.getCurrentUser();
            
            // Redirect based on role
            setTimeout(() => {
                if (user?.role === 'admin') {
                    window.location.href = '/pages/admin/dashboard.html';
                } else {
                    window.location.href = '/pages/researcher/dashboard.html';
                }
            }, 1000);
        } else {
            showAlert(result.error || 'فشل تسجيل الدخول', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
        setLoading(false);
    }
}

/**
 * Validate form
 */
function validateForm(email, password) {
    let isValid = true;
    
    // Validate email
    if (!email) {
        showFieldError('email', 'البريد الإلكتروني مطلوب');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('email', 'البريد الإلكتروني غير صحيح');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showFieldError('password', 'كلمة المرور مطلوبة');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError('password', 'كلمة المرور قصيرة جداً');
        isValid = false;
    }
    
    return isValid;
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
 * Toggle password visibility
 */
function togglePasswordVisibility(e) {
    const button = e.currentTarget;
    const targetId = button.dataset.target;
    const input = document.getElementById(targetId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

/**
 * Set loading state
 */
function setLoading(loading) {
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
            <span>جاري تسجيل الدخول...</span>
        `;
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <i class="fas fa-sign-in-alt"></i>
            <span>تسجيل الدخول</span>
        `;
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

