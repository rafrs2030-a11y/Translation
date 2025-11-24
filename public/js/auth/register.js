/**
 * Register Page JavaScript
 */

import authStore from '../stores/authStore.js';
import { validateEmail, validatePassword, validatePhone, validateNationalId } from '../utils/validators.js';
import { guestOnly } from '../utils/auth-guard.js';

// DOM Elements
let form, submitBtn, alertContainer, passwordInput, confirmPasswordInput;
let strengthBar, strengthText;
let accountTypeSelection, accountTypeOptions, accountTypeInput;

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
    form = document.getElementById('register-form');
    submitBtn = document.getElementById('submit-btn');
    alertContainer = document.getElementById('alert-container');
    passwordInput = document.getElementById('password');
    confirmPasswordInput = document.getElementById('confirm_password');
    strengthBar = document.querySelector('.strength-bar');
    strengthText = document.querySelector('.strength-text');
    accountTypeSelection = document.getElementById('account-type-selection');
    accountTypeOptions = document.querySelectorAll('.account-type-option');
    accountTypeInput = document.getElementById('account_type');
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Account type selection
    accountTypeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedType = option.dataset.type;
            selectAccountType(selectedType);
        });
    });
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Password strength checker
    passwordInput.addEventListener('input', checkPasswordStrength);
    
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
 * Select account type
 */
function selectAccountType(type) {
    // Update visual selection
    accountTypeOptions.forEach(option => {
        if (option.dataset.type === type) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    // Update hidden input
    accountTypeInput.value = type;
    
    // Show form with animation
    setTimeout(() => {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
}

/**
 * Handle form submission
 */
async function handleSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearAlerts();
    
    // Get form data
    let email = document.getElementById('email').value.trim().toLowerCase();
    
    // تصحيح الأخطاء الإملائية الشائعة في البريد الإلكتروني
    const emailCorrections = {
        'gmai.com': 'gmail.com',
        'gmial.com': 'gmail.com',
        'gmaill.com': 'gmail.com',
        'gmaiil.com': 'gmail.com',
        'yahooo.com': 'yahoo.com',
        'yaho.com': 'yahoo.com',
        'hotmial.com': 'hotmail.com',
        'hotmai.com': 'hotmail.com',
        'hotmali.com': 'hotmail.com',
    };
    
    // تطبيق التصحيحات
    Object.keys(emailCorrections).forEach(wrong => {
        if (email.includes('@' + wrong)) {
            email = email.replace('@' + wrong, '@' + emailCorrections[wrong]);
        }
    });
    
    // Check if account type is selected
    const accountType = accountTypeInput.value;
    if (!accountType) {
        showAlert('يرجى اختيار نوع الحساب', 'error');
        accountTypeSelection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    const formData = {
        full_name: document.getElementById('full_name').value.trim(),
        email: email,
        phone: document.getElementById('phone').value.trim().replace(/\s+/g, ''),
        national_id: document.getElementById('national_id').value.trim().replace(/\s+/g, ''),
        gender: document.getElementById('gender').value.trim(),
        country: document.getElementById('country').value.trim(),
        password: document.getElementById('password').value,
        confirm_password: document.getElementById('confirm_password').value,
        account_type: accountType,
        terms: document.getElementById('terms').checked
    };
    
    // Validate
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading
    setLoading(true);
    
    try {
        // Register
        const result = await authStore.register({
            username: formData.full_name, // استخدام الاسم الكامل كاسم مستخدم
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            national_id: formData.national_id,
            gender: formData.gender,
            country: formData.country,
            account_type: formData.account_type
        });
        
        if (result.success) {
            // Show success message
            showAlert(
                'تم إنشاء حسابك بنجاح! تحقق من بريدك الإلكتروني لتفعيل الحساب.',
                'success'
            );
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                window.location.href = '/pages/login.html?registered=true';
            }, 3000);
        } else {
            showAlert(result.error || 'فشل إنشاء الحساب', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
        setLoading(false);
    }
}

/**
 * Validate form
 */
function validateForm(data) {
    let isValid = true;
    
    // Validate full name
    if (!data.full_name || data.full_name.length < 3) {
        showFieldError('full_name', 'الاسم الكامل مطلوب (3 أحرف على الأقل)');
        isValid = false;
    }
    
    // Validate email
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
        showFieldError('email', emailValidation.error);
        isValid = false;
    }
    
    // Validate phone
    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.valid) {
        showFieldError('phone', phoneValidation.error);
        isValid = false;
    }
    
    // Validate national ID
    const idValidation = validateNationalId(data.national_id);
    if (!idValidation.valid) {
        showFieldError('national_id', idValidation.error);
        isValid = false;
    }
    
    // Validate gender
    if (!data.gender) {
        showFieldError('gender', 'يرجى اختيار الجنس');
        isValid = false;
    }
    
    // Validate country
    if (!data.country) {
        showFieldError('country', 'يرجى اختيار الدولة');
        isValid = false;
    }
    
    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
        showFieldError('password', passwordValidation.error);
        isValid = false;
    }
    
    // Confirm password
    if (data.password !== data.confirm_password) {
        showFieldError('confirm_password', 'كلمات المرور غير متطابقة');
        isValid = false;
    }
    
    // Terms acceptance
    if (!data.terms) {
        showAlert('يجب الموافقة على الشروط والأحكام', 'warning');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Check password strength
 */
function checkPasswordStrength() {
    const password = passwordInput.value;
    
    if (!password) {
        strengthBar.className = 'strength-bar';
        strengthText.textContent = '';
        return;
    }
    
    let strength = 0;
    
    // Length
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Uppercase
    if (/[A-Z]/.test(password)) strength++;
    
    // Lowercase
    if (/[a-z]/.test(password)) strength++;
    
    // Numbers
    if (/\d/.test(password)) strength++;
    
    // Special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    // Determine strength level
    let level, text;
    if (strength <= 2) {
        level = 'weak';
        text = 'ضعيفة';
    } else if (strength <= 4) {
        level = 'medium';
        text = 'متوسطة';
    } else {
        level = 'strong';
        text = 'قوية';
    }
    
    strengthBar.className = `strength-bar ${level}`;
    strengthText.textContent = text;
    strengthText.className = `strength-text ${level}`;
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
    
    // Scroll to alert
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
            <span>جاري إنشاء الحساب...</span>
        `;
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <i class="fas fa-user-plus"></i>
            <span>إنشاء الحساب</span>
        `;
    }
}

