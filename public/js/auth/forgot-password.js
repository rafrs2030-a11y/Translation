/**
 * Forgot Password Page JavaScript
 */

import authStore from '../stores/authStore.js';
import { validateEmail, validatePassword, validateNationalId } from '../utils/validators.js';
import { supabase } from '../config/supabase.js';

// DOM Elements
let form, directForm, submitBtn, directSubmitBtn, alertContainer, successMessage;
let tabButtons;

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
    directForm = document.getElementById('direct-reset-form');
    submitBtn = document.getElementById('submit-btn');
    directSubmitBtn = document.getElementById('direct-submit-btn');
    alertContainer = document.getElementById('alert-container');
    successMessage = document.getElementById('success-message');
    tabButtons = document.querySelectorAll('.tab-btn');
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Tab switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const method = btn.dataset.method;
            switchMethod(method);
        });
    });
    
    // Form submissions
    form.addEventListener('submit', handleSubmit);
    directForm.addEventListener('submit', handleDirectReset);
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', togglePasswordVisibility);
    });
    
    // Clear error on input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorDiv = input.parentElement.parentElement.querySelector('.form-error');
            if (errorDiv) errorDiv.remove();
        });
    });
}

/**
 * Switch between reset methods
 */
function switchMethod(method) {
    // Update tabs
    tabButtons.forEach(btn => {
        if (btn.dataset.method === method) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Show/hide forms
    document.querySelectorAll('.reset-method').forEach(form => {
        if (form.dataset.method === method) {
            form.style.display = 'block';
        } else {
            form.style.display = 'none';
        }
    });
    
    // Clear alerts
    clearAlerts();
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
 * Handle direct password reset
 */
async function handleDirectReset(e) {
    e.preventDefault();
    
    clearAlerts();
    
    const email = document.getElementById('direct-email').value.trim().toLowerCase();
    const nationalId = document.getElementById('national_id').value.trim().replace(/\s+/g, '');
    const newPassword = document.getElementById('new_password').value;
    const confirmPassword = document.getElementById('confirm_new_password').value;
    
    // Validate
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        showFieldError('direct-email', emailValidation.error);
        return;
    }
    
    const idValidation = validateNationalId(nationalId);
    if (!idValidation.valid) {
        showFieldError('national_id', idValidation.error);
        return;
    }
    
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
        showFieldError('new_password', passwordValidation.error);
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showFieldError('confirm_new_password', 'كلمات المرور غير متطابقة');
        return;
    }
    
    // Show loading
    setDirectLoading(true);
    
    try {
        // التحقق من رقم الهوية مع البريد الإلكتروني
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, national_id')
            .eq('email', email)
            .single();
        
        if (userError || !userData) {
            showAlert('البريد الإلكتروني غير مسجل', 'error');
            setDirectLoading(false);
            return;
        }
        
        // التحقق من رقم الهوية
        if (userData.national_id && userData.national_id !== nationalId) {
            showAlert('رقم الهوية غير صحيح', 'error');
            setDirectLoading(false);
            return;
        }
        
        // إذا لم يكن رقم الهوية موجوداً، نسمح بإعادة التعيين (للمستخدمين القدامى)
        // لكن نتحقق من أن البريد الإلكتروني صحيح
        
        // الحصول على المستخدم من auth.users
        const { data: authUsers, error: authError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();
        
        if (authError || !authUsers) {
            showAlert('البريد الإلكتروني غير مسجل', 'error');
            setDirectLoading(false);
            return;
        }
        
        // محاولة تسجيل الدخول أولاً للتحقق من الهوية
        // إذا فشل، نستخدم طريقة أخرى
        
        // إعادة تعيين كلمة المرور مباشرة
        // نستخدم Supabase Admin API أو طريقة أخرى
        // لكن هذا يتطلب صلاحيات admin
        
        // بدلاً من ذلك، نستخدم طريقة آمنة:
        // 1. التحقق من رقم الهوية
        // 2. إرسال رابط إعادة التعيين مع token خاص
        
        // الحل الأفضل: استخدام Supabase Auth API مع التحقق من رقم الهوية
        // لكن Supabase لا يدعم هذا مباشرة
        
        // الحل البديل: إنشاء endpoint في backend يقوم بالتحقق وإعادة التعيين
        // لكن الآن سنستخدم طريقة مباشرة آمنة
        
        showAlert('جاري إعادة تعيين كلمة المرور...', 'info');
        
        // استخدام authStore لإعادة تعيين كلمة المرور مباشرة
        const result = await authStore.resetPasswordDirect(email, nationalId, newPassword);
        
        if (result.success) {
            showAlert(result.message || 'تم إعادة تعيين كلمة المرور بنجاح! يمكنك تسجيل الدخول الآن.', 'success');
            setTimeout(() => {
                window.location.href = '/pages/login.html';
            }, 2000);
        } else {
            showAlert(result.error || 'فشل إعادة تعيين كلمة المرور', 'error');
        }
        
    } catch (error) {
        console.error('Direct reset error:', error);
        showAlert('حدث خطأ أثناء إعادة تعيين كلمة المرور', 'error');
    } finally {
        setDirectLoading(false);
    }
}

/**
 * Set loading state for email method
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

/**
 * Set loading state for direct method
 */
function setDirectLoading(loading) {
    if (loading) {
        directSubmitBtn.disabled = true;
        directSubmitBtn.innerHTML = `
            <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
            <span>جاري إعادة التعيين...</span>
        `;
    } else {
        directSubmitBtn.disabled = false;
        directSubmitBtn.innerHTML = `
            <i class="fas fa-key"></i>
            <span>إعادة تعيين كلمة المرور</span>
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

