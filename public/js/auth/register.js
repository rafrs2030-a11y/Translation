/**
 * Register Page JavaScript
 */

import authStore from '../stores/authStore.js';
import { supabase } from '../config/supabase.js';
import { validateEmail, validatePassword, validatePasswordWithLength, validatePhone, validateNationalId, getMinimumPasswordLength } from '../utils/validators.js';
import { guestOnly } from '../utils/auth-guard.js';

// DOM Elements
let form, submitBtn, alertContainer, passwordInput, confirmPasswordInput;
let strengthBar, strengthText;
let accountTypeSelection, accountTypeOptions, accountTypeInput;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await guestOnly(); // Redirect if already logged in
    
    // Clear old cache
    clearOldCache();
    
    // Initialize elements
    initElements();
    
    // Wait a bit to ensure DOM is fully ready
    setTimeout(() => {
        // Re-initialize elements in case they weren't ready
        initElements();
        initEventListeners();
        
        // Double-check account type options are clickable
        accountTypeOptions = document.querySelectorAll('.account-type-option');
        accountTypeOptions.forEach(option => {
            option.style.pointerEvents = 'auto';
            option.style.cursor = 'pointer';
            option.style.userSelect = 'none';
        });
        
    }, 100);
});

/**
 * Clear old cache and localStorage data
 */
function clearOldCache() {
    try {
        // Clear all Supabase-related cache
        const supabaseKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('sb-') || 
            key.startsWith('supabase.') ||
            key.includes('supabase')
        );
        supabaseKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Clear any registration-related cache
        const registrationKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('register_') || 
            key.startsWith('registration_') ||
            key.startsWith('form_cache_') ||
            key.startsWith('account_type_') ||
            key.startsWith('auth_') ||
            key.includes('register') ||
            key.includes('registration')
        );
        registrationKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Clear sessionStorage completely
        try {
            sessionStorage.clear();
        } catch (e) {
            // Silent fail
        }
        
        // Clear all form-related cache
        const formKeys = Object.keys(localStorage).filter(key => 
            key.includes('form') || 
            key.includes('cache') ||
            key.includes('draft')
        );
        formKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Force reload CSS/JS files by adding cache busting
        const timestamp = Date.now();
        
        // Reload CSS files
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
            if (link.href.includes('auth.css') || link.href.includes('main.css')) {
                try {
                    const url = new URL(link.href);
                    url.searchParams.set('v', timestamp);
                    link.href = url.toString();
                } catch (e) {
                    // Silent fail
                }
            }
        });
        
        // Clear browser cache for this page
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    if (name.includes('register') || name.includes('auth')) {
                        caches.delete(name);
                    }
                });
            });
        }
        
    } catch (error) {
        // Try to clear at least the basic localStorage
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch (e) {
            // Silent fail
        }
    }
}

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
    accountTypeInput = document.getElementById('account_type');
    
    // Re-query account type options to ensure they're available
    accountTypeOptions = document.querySelectorAll('.account-type-option');
    
    // Ensure elements exist (will be re-queried if needed)
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Re-query account type options to ensure they're available
    accountTypeOptions = document.querySelectorAll('.account-type-option');
    
    console.log('Initializing event listeners for', accountTypeOptions.length, 'account type options');
    
    // Account type selection - use event delegation to ensure it works
    if (accountTypeSelection) {
        // Add event delegation listener
        const handleAccountTypeClick = (e) => {
            const option = e.target.closest('.account-type-option');
            if (option) {
                e.preventDefault();
                e.stopPropagation();
                const selectedType = option.dataset.type;
                console.log('Account type clicked via delegation:', selectedType);
                if (selectedType) {
                    selectAccountType(selectedType);
                }
                return false;
            }
        };
        
        accountTypeSelection.addEventListener('click', handleAccountTypeClick, true);
        
        // Also add mousedown for better compatibility
        const handleMouseDown = (e) => {
            const option = e.target.closest('.account-type-option');
            if (option) {
                e.preventDefault();
                const selectedType = option.dataset.type;
                if (selectedType) {
                    selectAccountType(selectedType);
                }
            }
        };
        
        accountTypeSelection.addEventListener('mousedown', handleMouseDown, true);
    }
    
    // Also add direct listeners as backup for each option
    accountTypeOptions.forEach((option) => {
        // Ensure pointer events are enabled
        option.style.pointerEvents = 'auto';
        option.style.cursor = 'pointer';
        option.style.userSelect = 'none';
        
        // Add click listener
        const handleClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const selectedType = option.dataset.type;
            console.log('Account type clicked directly:', selectedType);
            if (selectedType) {
                selectAccountType(selectedType);
            }
            return false;
        };
        
        option.addEventListener('click', handleClick, true);
        
        // Add mousedown listener
        const handleMouseDown = (e) => {
            e.preventDefault();
            const selectedType = option.dataset.type;
            if (selectedType) {
                selectAccountType(selectedType);
            }
        };
        
        option.addEventListener('mousedown', handleMouseDown, true);
        
        // Add touchstart for mobile
        const handleTouchStart = (e) => {
            e.preventDefault();
            const selectedType = option.dataset.type;
            if (selectedType) {
                selectAccountType(selectedType);
            }
        };
        
        option.addEventListener('touchstart', handleTouchStart, { passive: false });
    });
    
    // Form submission
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    // Password strength checker
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', togglePasswordVisibility);
    });
    
    // Clear error on input
    if (form) {
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
                const errorDiv = input.parentElement.parentElement.querySelector('.form-error');
                if (errorDiv) errorDiv.remove();
            });
        });
    }
}

/**
 * Select account type
 */
function selectAccountType(type) {
    // Re-query options to ensure we have the latest DOM
    accountTypeOptions = document.querySelectorAll('.account-type-option');
    
    // Update visual selection
    accountTypeOptions.forEach(option => {
        if (option.dataset.type === type) {
            option.classList.add('selected');
            option.style.pointerEvents = 'auto';
            option.style.cursor = 'pointer';
        } else {
            option.classList.remove('selected');
            option.style.pointerEvents = 'auto';
            option.style.cursor = 'pointer';
        }
    });
    
    // Update hidden input
    if (accountTypeInput) {
        accountTypeInput.value = type;
    } else {
        console.error('Account type input not found when trying to set value!');
        // Try to find it again
        accountTypeInput = document.getElementById('account_type');
        if (accountTypeInput) {
            accountTypeInput.value = type;
        }
    }
    
    // Show/hide fields based on account type
    const individualFields = document.getElementById('individual-fields');
    const businessFields = document.getElementById('business-fields');
    
    if (type === 'أفراد') {
        // Show individual fields, hide business fields
        if (individualFields) {
            individualFields.style.display = 'block';
        }
        if (businessFields) {
            businessFields.style.display = 'none';
        }
        
        // Set required attributes for individual fields
        const fullNameInput = document.getElementById('full_name');
        const nationalIdInput = document.getElementById('national_id');
        const genderSelect = document.getElementById('gender');
        
        if (fullNameInput) {
            fullNameInput.setAttribute('required', 'required');
            const label = fullNameInput.closest('.form-group')?.querySelector('.form-label');
            if (label) label.classList.add('required');
        }
        if (nationalIdInput) {
            nationalIdInput.setAttribute('required', 'required');
            const label = nationalIdInput.closest('.form-group')?.querySelector('.form-label');
            if (label) label.classList.add('required');
        }
        if (genderSelect) {
            genderSelect.setAttribute('required', 'required');
            const label = genderSelect.closest('.form-group')?.querySelector('.form-label');
            if (label) label.classList.add('required');
        }
        
        // Remove required from business fields
        const orgNameInput = document.getElementById('organization_name');
        const orgTypeSelect = document.getElementById('organization_type');
        
        if (orgNameInput) {
            orgNameInput.removeAttribute('required');
            const label = orgNameInput.closest('.form-group')?.querySelector('.form-label');
            if (label) label.classList.remove('required');
        }
        if (orgTypeSelect) {
            orgTypeSelect.removeAttribute('required');
            const label = orgTypeSelect.closest('.form-group')?.querySelector('.form-label');
            if (label) label.classList.remove('required');
        }
        
    } else if (type === 'أعمال') {
        // Show business fields, hide individual fields
        if (individualFields) {
            individualFields.style.display = 'none';
        }
        if (businessFields) {
            businessFields.style.display = 'block';
        }
        
        // Set required attributes for business fields
        const orgNameInput = document.getElementById('organization_name');
        const orgTypeSelect = document.getElementById('organization_type');
        
        if (orgNameInput) {
            orgNameInput.setAttribute('required', 'required');
            const label = orgNameInput.closest('.form-group')?.querySelector('.form-label');
            if (label) label.classList.add('required');
        }
        if (orgTypeSelect) {
            orgTypeSelect.setAttribute('required', 'required');
            const label = orgTypeSelect.closest('.form-group')?.querySelector('.form-label');
            if (label) label.classList.add('required');
        }
        
        // Remove required from individual fields
        const fullNameInput = document.getElementById('full_name');
        const nationalIdInput = document.getElementById('national_id');
        const genderSelect = document.getElementById('gender');
        
        if (fullNameInput) {
            fullNameInput.removeAttribute('required');
            const label = fullNameInput.closest('.form-group')?.querySelector('.form-label');
            if (label) label.classList.remove('required');
        }
        if (nationalIdInput) {
            nationalIdInput.removeAttribute('required');
            const label = nationalIdInput.closest('.form-group')?.querySelector('.form-label');
            if (label) label.classList.remove('required');
        }
        if (genderSelect) {
            genderSelect.removeAttribute('required');
            const label = genderSelect.closest('.form-group')?.querySelector('.form-label');
            if (label) label.classList.remove('required');
        }
    }
    
    // Show form with animation
    if (form) {
        setTimeout(() => {
            form.style.display = 'block';
            form.style.opacity = '0';
            form.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                form.style.opacity = '1';
            }, 10);
            form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
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
    
    // Get form data based on account type
    const formData = {
        email: email,
        phone: document.getElementById('phone').value.trim().replace(/\s+/g, ''),
        country: document.getElementById('country').value.trim(),
        password: document.getElementById('password').value,
        confirm_password: document.getElementById('confirm_password').value,
        account_type: accountType,
        terms: document.getElementById('terms').checked
    };
    
    // Add fields based on account type
    if (accountType === 'أفراد') {
        formData.full_name = document.getElementById('full_name').value.trim();
        formData.national_id = document.getElementById('national_id').value.trim().replace(/\s+/g, '');
        formData.gender = document.getElementById('gender').value.trim();
    } else if (accountType === 'أعمال') {
        formData.organization_name = document.getElementById('organization_name').value.trim();
        formData.organization_type = document.getElementById('organization_type').value.trim();
    }
    
    // Validate
    if (!(await validateForm(formData))) {
        return;
    }
    
    // Show loading
    setLoading(true);
    
    try {
        // Register
        const registerData = {
            username: formData.account_type === 'أعمال' 
                ? formData.organization_name 
                : formData.full_name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            country: formData.country,
            account_type: formData.account_type
        };
        
        // Add fields based on account type
        if (formData.account_type === 'أفراد') {
            registerData.national_id = formData.national_id;
            registerData.gender = formData.gender;
        } else if (formData.account_type === 'أعمال') {
            registerData.organization_name = formData.organization_name;
            registerData.organization_type = formData.organization_type;
        }
        
        const result = await authStore.register(registerData);
        
        if (result.success) {
            // إرسال بريد التحقق من البريد الإلكتروني
            try {
                console.log('Attempting to send verification email to:', formData.email);
                const resendResult = await authStore.resendVerificationEmail(formData.email);
                if (resendResult.success) {
                    console.log('Verification email sent successfully');
                } else {
                    console.error('Failed to send verification email:', resendResult.error);
                }
            } catch (verifyError) {
                console.error('Error sending verification email:', verifyError);
                // لا نمنع إكمال التسجيل إذا فشل إرسال بريد التحقق
            }

            // Try to send welcome email in real-time (non-blocking for the user)
            try {
                const userId = result.data?.user?.id || null;
                console.log('Attempting to send welcome email to:', formData.email, 'User ID:', userId);
                
                const welcomeResponse = await supabase.functions.invoke('send-welcome-emails', {
                    body: {
                        mode: 'realtime',
                        recipient_email: formData.email,
                        user_id: userId,
                        type: 'welcome',
                        payload: {
                            name: registerData.username,
                        },
                    },
                });
                
                if (welcomeResponse.error) {
                    console.error('Welcome email function error:', welcomeResponse.error);
                } else {
                    console.log('Welcome email sent successfully:', welcomeResponse.data);
                }
            } catch (welcomeError) {
                console.error('Error invoking welcome email function:', welcomeError);
                // لا نمنع إكمال التسجيل إذا فشل البريد الترحيبي
            } 
            

            // Show success message
            showAlert(
                'تم إنشاء حسابك بنجاح! يرجى التحقق من بريدك الإلكتروني والنقر على رابط التحقق لإكمال عملية التسجيل.',
                'success'
            );
            
            // Redirect to login after 5 seconds (زيادة الوقت لإعطاء المستخدم وقت لقراءة الرسالة)
            setTimeout(() => {
                window.location.href = '/pages/login.html?registered=true';
            }, 5000);
        } else {
            // عرض رسالة الخطأ بشكل واضح
            const errorMessage = result.error || 'فشل إنشاء الحساب';
            showAlert(errorMessage, 'error');
            
            // إذا كان الخطأ متعلقاً بكلمة المرور، قم بالتمرير إلى حقل كلمة المرور
            if (errorMessage.includes('كلمة المرور') || errorMessage.includes('password')) {
                setTimeout(() => {
                    passwordInput?.focus();
                    passwordInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    } catch (error) {
        const errorMessage = error.message || 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.';
        showAlert(errorMessage, 'error');
        
        // إذا كان الخطأ متعلقاً بكلمة المرور، قم بالتمرير إلى حقل كلمة المرور
        if (errorMessage.includes('كلمة المرور') || errorMessage.includes('password')) {
            setTimeout(() => {
                passwordInput?.focus();
                passwordInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    } finally {
        setLoading(false);
    }
}

/**
 * Validate form
 */
async function validateForm(data) {
    let isValid = true;
    
    // Validate based on account type
    if (data.account_type === 'أفراد') {
        // Validate individual fields
        if (!data.full_name || data.full_name.length < 3) {
            showFieldError('full_name', 'الاسم الكامل مطلوب (3 أحرف على الأقل)');
            isValid = false;
        }
        
        if (!data.gender) {
            showFieldError('gender', 'يرجى اختيار الجنس');
            isValid = false;
        }
        
        if (!data.national_id || data.national_id.length < 5) {
            showFieldError('national_id', 'رقم الهوية مطلوب');
            isValid = false;
        }
    } else if (data.account_type === 'أعمال') {
        // Validate business fields
        if (!data.organization_name || data.organization_name.length < 3) {
            showFieldError('organization_name', 'اسم الجهة مطلوب (3 أحرف على الأقل)');
            isValid = false;
        }
        
        if (!data.organization_type) {
            showFieldError('organization_type', 'يرجى اختيار نوع الجهة');
            isValid = false;
        }
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
    
    // Validate national ID (only for individuals)
    if (data.account_type === 'أفراد' && data.national_id) {
        const idValidation = validateNationalId(data.national_id);
        if (!idValidation.valid) {
            showFieldError('national_id', idValidation.error);
            isValid = false;
        }
    }
    
    // Validate country
    if (!data.country) {
        showFieldError('country', 'يرجى اختيار الدولة');
        isValid = false;
    }
    
    // Validate password
    // Get minimum password length from settings
    const minPasswordLength = await getMinimumPasswordLength();
    const passwordValidation = validatePasswordWithLength(data.password, minPasswordLength);
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
    
    // Length (Supabase requires minimum 12 characters)
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    
    // Uppercase
    if (/[A-Z]/.test(password)) strength++;
    
    // Lowercase
    if (/[a-z]/.test(password)) strength++;
    
    // Numbers
    if (/\d/.test(password)) strength++;
    
    // Special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    // Determine strength level
    // Note: Password must be at least 12 characters to be valid
    let level, text;
    if (password.length < 12) {
        level = 'weak';
        text = 'قصيرة (يجب 12 حرف على الأقل)';
    } else if (strength <= 3) {
        level = 'weak';
        text = 'ضعيفة';
    } else if (strength <= 5) {
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

