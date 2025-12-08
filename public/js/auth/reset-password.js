/**
 * Reset Password Page JavaScript
 * معالجة إعادة تعيين كلمة المرور من الرابط
 */

import authStore from '../stores/authStore.js';
import { validatePassword } from '../utils/validators.js';
import { supabase } from '../config/supabase.js';

// DOM Elements
let form, submitBtn, alertContainer, successMessage, tokenError;
let newPasswordInput, confirmPasswordInput;
let passwordStrength;

// Token from URL
let recoveryToken = null;
let tokenType = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initElements();
    extractTokenFromURL();
    initEventListeners();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    form = document.getElementById('reset-password-form');
    submitBtn = document.getElementById('submit-btn');
    alertContainer = document.getElementById('alert-container');
    successMessage = document.getElementById('success-message');
    tokenError = document.getElementById('token-error');
    newPasswordInput = document.getElementById('new_password');
    confirmPasswordInput = document.getElementById('confirm_password');
    passwordStrength = document.getElementById('password-strength');
}

/**
 * Extract token from URL
 * Supabase sends tokens in hash: #access_token=xxx&type=recovery
 */
function extractTokenFromURL() {
    // Check hash first (Supabase default)
    const hash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hash);
    
    if (hashParams.has('access_token')) {
        recoveryToken = hashParams.get('access_token');
        tokenType = hashParams.get('type') || 'recovery';
    } else {
        // Check query params as fallback
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('access_token')) {
            recoveryToken = urlParams.get('access_token');
            tokenType = urlParams.get('type') || 'recovery';
        }
    }

    if (!recoveryToken) {
        showTokenError();
        return;
    }

    // Verify token and set session
    verifyTokenAndSetSession();
}

/**
 * Verify token and set session
 */
async function verifyTokenAndSetSession() {
    try {
        // Set the session using the recovery token
        // Supabase handles this automatically when we call updateUser with a valid recovery token
        const { data, error } = await supabase.auth.getSession();
        
        // If no session exists, try to set it using the token
        if (!data.session && recoveryToken) {
            // Supabase will automatically handle the session when we call updateUser
            // But first, we need to verify the token is valid
            // We'll do this by attempting to get the user
            const { data: userData, error: userError } = await supabase.auth.getUser(recoveryToken);
            
            if (userError) {
                console.error('Token verification error:', userError);
                showTokenError();
                return;
            }
        }

        // Show form if token is valid
        form.style.display = 'block';
        
    } catch (error) {
        console.error('Token verification error:', error);
        showTokenError();
    }
}

/**
 * Show token error message
 */
function showTokenError() {
    tokenError.style.display = 'block';
    form.style.display = 'none';
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
    
    // Password strength checker
    newPasswordInput.addEventListener('input', checkPasswordStrength);
    
    // Confirm password validation
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    
    // Clear error on input
    [newPasswordInput, confirmPasswordInput].forEach(input => {
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
    
    // Get values
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validate
    if (!validateForm(newPassword, confirmPassword)) {
        return;
    }
    
    // Show loading
    setLoading(true);
    
    try {
        // First, ensure we have a valid session with the recovery token
        // Supabase requires a session to update password
        if (!recoveryToken) {
            throw new Error('رابط غير صالح');
        }

        // Supabase automatically creates a session when the recovery link is accessed
        // The token in the URL hash is automatically processed by Supabase
        // We just need to check if we have a valid session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
            // If no session, the token might be invalid or expired
            // Try to exchange the token for a session
            // Note: Supabase should have already done this, but we check anyway
            throw new Error('رابط غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد');
        }

        // Update password using Supabase Auth
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            throw error;
        }

        // Success!
        showSuccess();
        
    } catch (error) {
        console.error('Reset password error:', error);
        
        let errorMessage = 'حدث خطأ أثناء تغيير كلمة المرور';
        
        if (error.message) {
            if (error.message.includes('expired') || error.message.includes('invalid')) {
                errorMessage = 'رابط غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد';
            } else {
                errorMessage = error.message;
            }
        }
        
        showAlert(errorMessage, 'error');
    } finally {
        setLoading(false);
    }
}

/**
 * Validate form
 */
function validateForm(newPassword, confirmPassword) {
    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
        showFieldError('new_password', passwordValidation.error);
        return false;
    }
    
    // Check passwords match
    if (newPassword !== confirmPassword) {
        showFieldError('confirm_password', 'كلمات المرور غير متطابقة');
        return false;
    }
    
    return true;
}

/**
 * Validate password match
 */
function validatePasswordMatch() {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword && newPassword !== confirmPassword) {
        confirmPasswordInput.classList.add('error');
        showFieldError('confirm_password', 'كلمات المرور غير متطابقة');
    } else {
        confirmPasswordInput.classList.remove('error');
        const errorDiv = confirmPasswordInput.parentElement.parentElement.querySelector('.form-error');
        if (errorDiv) errorDiv.remove();
    }
}

/**
 * Check password strength
 */
function checkPasswordStrength() {
    const password = newPasswordInput.value;
    
    if (!password) {
        passwordStrength.style.display = 'none';
        return;
    }
    
    passwordStrength.style.display = 'block';
    
    let strength = 0;
    let strengthText = 'ضعيف';
    let strengthClass = 'weak';
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Character variety
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    // Determine strength level
    if (strength <= 2) {
        strengthText = 'ضعيف';
        strengthClass = 'weak';
    } else if (strength <= 4) {
        strengthText = 'متوسط';
        strengthClass = 'medium';
    } else {
        strengthText = 'قوي';
        strengthClass = 'strong';
    }
    
    // Update UI
    const strengthFill = document.getElementById('strength-fill');
    const strengthTextEl = document.getElementById('strength-text');
    
    strengthFill.className = `strength-fill ${strengthClass}`;
    strengthFill.style.width = `${(strength / 6) * 100}%`;
    strengthTextEl.textContent = strengthText;
    strengthTextEl.className = `strength-text ${strengthClass}`;
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
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
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
 * Show success message
 */
function showSuccess() {
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Redirect after 3 seconds
    setTimeout(() => {
        window.location.href = '/pages/login.html';
    }, 3000);
}

/**
 * Set loading state
 */
function setLoading(loading) {
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
            <span>جاري التغيير...</span>
        `;
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <i class="fas fa-key"></i>
            <span>تغيير كلمة المرور</span>
        `;
    }
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
