/**
 * Login Page JavaScript
 */

import authStore from '../stores/authStore.js';
import { guestOnly } from '../utils/auth-guard.js';
import { supabase } from '../config/supabase.js';

// DOM Elements
let form, submitBtn, alertContainer;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await guestOnly(); // Redirect if already logged in
    
    initElements();
    initEventListeners();
    
    // Check if 2FA is enabled and update UI accordingly
    await updateUIForTwoFactor();
    
    // Check for verification messages
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        showAlert('تم إنشاء حسابك بنجاح! يرجى التحقق من بريدك الإلكتروني والنقر على رابط التحقق لإكمال عملية التسجيل.', 'success');
    }
    if (urlParams.get('verified') === 'true') {
        showAlert('تم التحقق من بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول.', 'success');
    }
});

/**
 * Update UI based on 2FA setting
 */
async function updateUIForTwoFactor() {
    const twoFactorEnabled = await checkTwoFactorEnabled();
    
    if (twoFactorEnabled) {
        // Hide password field and related options when 2FA is enabled
        const passwordGroup = document.getElementById('password-group');
        const formOptions = document.getElementById('form-options');
        const passwordInput = document.getElementById('password');
        
        if (passwordGroup) {
            passwordGroup.style.display = 'none';
        }
        if (formOptions) {
            formOptions.style.display = 'none';
        }
        if (passwordInput) {
            passwordInput.removeAttribute('required');
        }
        
        // Update header text
        const headerP = document.querySelector('.auth-header p');
        if (headerP) {
            headerP.textContent = 'أدخل بريدك الإلكتروني وسيتم إرسال رمز التحقق إليك';
        }
    }
}

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
    
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Check if 2FA is enabled
    const twoFactorEnabled = await checkTwoFactorEnabled();
    
    // Validate (password only required if 2FA is disabled)
    if (!validateForm(email, password, twoFactorEnabled)) {
        return;
    }
    
    // Show loading
    setLoading(true);
    
    try {
        // Check if 2FA is enabled
        const twoFactorEnabled = await checkTwoFactorEnabled();
        
        if (twoFactorEnabled) {
            // Two-factor authentication flow - email only, no password needed
            // Hide password field requirement
            await handleTwoFactorLogin(email, password);
        } else {
            // Regular login flow - email + password
            await handleRegularLogin(email, password);
        }
    } catch (error) {
        console.error('Login error:', error);
        // عرض رسالة الخطأ إذا كانت موجودة
        const errorMsg = error.message || 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.';
        showAlert(errorMsg, 'error');
        setLoading(false);
    }
}

/**
 * Validate form
 */
function validateForm(email, password, twoFactorEnabled = false) {
    let isValid = true;
    
    // Validate email (always required)
    if (!email) {
        showFieldError('email', 'البريد الإلكتروني مطلوب');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('email', 'البريد الإلكتروني غير صحيح');
        isValid = false;
    }
    
    // Validate password (only required if 2FA is disabled)
    if (!twoFactorEnabled) {
        if (!password) {
            showFieldError('password', 'كلمة المرور مطلوبة');
            isValid = false;
        } else if (password.length < 6) {
            showFieldError('password', 'كلمة المرور قصيرة جداً');
            isValid = false;
        }
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
 * Show password reset option
 */
function showPasswordResetOption(email) {
    // إزالة أي رسالة سابقة
    const existingReset = document.getElementById('password-reset-option');
    if (existingReset) {
        existingReset.remove();
    }
    
    // إنشاء رسالة إعادة تعيين كلمة المرور
    const resetDiv = document.createElement('div');
    resetDiv.id = 'password-reset-option';
    resetDiv.className = 'alert alert-info';
    resetDiv.style.marginTop = '1rem';
    resetDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
                <i class="fas fa-key"></i>
                <span>نسيت كلمة المرور؟</span>
            </div>
            <button type="button" class="btn btn-outline btn-small" id="reset-password-btn">
                <i class="fas fa-envelope"></i>
                إرسال رابط إعادة التعيين
            </button>
        </div>
    `;
    
    alertContainer.appendChild(resetDiv);
    
    // إضافة event listener للزر
    document.getElementById('reset-password-btn').addEventListener('click', async () => {
        await handlePasswordReset(email);
    });
}

/**
 * Handle password reset
 */
async function handlePasswordReset(email) {
    if (!email) {
        showAlert('يرجى إدخال البريد الإلكتروني', 'error');
        return;
    }
    
    const resetBtn = document.getElementById('reset-password-btn');
    const originalHTML = resetBtn.innerHTML;
    resetBtn.disabled = true;
    resetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    
    try {
        const result = await authStore.requestPasswordReset(email);
        
        if (result.success) {
            showAlert('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.', 'success');
            resetBtn.innerHTML = '<i class="fas fa-check"></i> تم الإرسال';
        } else {
            showAlert(result.error || 'فشل إرسال رابط إعادة التعيين', 'error');
            resetBtn.disabled = false;
            resetBtn.innerHTML = originalHTML;
        }
    } catch (error) {
        console.error('Password reset error:', error);
        showAlert('حدث خطأ أثناء إرسال رابط إعادة التعيين', 'error');
        resetBtn.disabled = false;
        resetBtn.innerHTML = originalHTML;
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Check if two-factor authentication is enabled
 */
async function checkTwoFactorEnabled() {
    try {
        // Check localStorage cache first
        const cached = localStorage.getItem('two_factor_auth');
        if (cached !== null) {
            return cached === 'true';
        }
        
        // Fetch from Supabase
        const { data, error } = await supabase
            .from('platform_settings')
            .select('setting_value')
            .eq('setting_key', 'two_factor_auth')
            .single();
        
        if (error || !data) {
            // Default to false if not found
            return false;
        }
        
        const enabled = data.setting_value === 'true';
        // Cache the result
        localStorage.setItem('two_factor_auth', enabled ? 'true' : 'false');
        
        return enabled;
    } catch (error) {
        console.error('Error checking 2FA setting:', error);
        return false; // Default to false on error
    }
}

/**
 * Handle regular login (without 2FA)
 */
async function handleRegularLogin(email, password) {
    try {
        // Login
        const result = await authStore.login(email, password);
        
        if (result.success) {
            // Show success message
            showAlert('تم تسجيل الدخول بنجاح! جاري التحويل...', 'success');
            
            // Wait for authStore to finish updating (setSession completes)
            await authStore.waitForInitialization();
            
            // إعطاء وقت إضافي لضمان تحديث البيانات
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Get user data - try multiple times with different methods
            let user = null;
            let userRole = null;
            
            // المحاولة الأولى: من state
            user = authStore.getState().user;
            if (user && user.role) {
                userRole = user.role;
                console.log('✅ Got role from state:', userRole);
            }
            
            // المحاولة الثانية: من getCurrentUser
            if (!userRole) {
                console.log('⚠️ Role not in state, trying getCurrentUser...');
                user = await authStore.getCurrentUser();
                if (user && user.role) {
                    userRole = user.role;
                    console.log('✅ Got role from getCurrentUser:', userRole);
                }
            }
            
            // المحاولة الثالثة: انتظار وإعادة المحاولة
            if (!userRole) {
                console.warn('⚠️ Role still not found, waiting and retrying...');
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // تحديث البيانات يدوياً
                const currentState = authStore.getState();
                if (currentState.session) {
                    await authStore.setSession(currentState.session);
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
                
                user = authStore.getState().user || await authStore.getCurrentUser();
                userRole = user?.role;
                
                if (userRole) {
                    console.log('✅ Got role after retry:', userRole);
                } else {
                    console.error('❌ Failed to get role, defaulting to researcher');
                    userRole = 'researcher';
                }
            }

            // Log final role for debugging
            console.log('🔍 Final user data:', {
                id: user?.id,
                email: user?.email,
                role: userRole,
                userObject: user
            });

            // Redirect based on role
            setTimeout(() => {
                console.log('🚀 Redirecting user with role:', userRole);
                if (userRole === 'admin' || userRole === 'super_admin') {
                    console.log('✅ Redirecting to admin dashboard');
                    window.location.href = '/pages/admin/dashboard.html';
                } else {
                    console.log('✅ Redirecting to researcher dashboard');
                    window.location.href = '/pages/researcher/dashboard.html';
                }
            }, 1000);
        } else {
            // عرض رسالة الخطأ من authStore
            const errorMsg = result.error || 'فشل تسجيل الدخول';
            showAlert(errorMsg, 'error');
            console.error('Login failed:', result);
            
            // إذا كان الخطأ متعلق بكلمة المرور، عرض خيار إعادة التعيين
            if (errorMsg.includes('كلمة المرور') || 
                errorMsg.includes('credentials') || 
                errorMsg.includes('غير صحيحة')) {
                showPasswordResetOption(email);
            }
            setLoading(false);
        }
    } catch (error) {
        console.error('Regular login error:', error);
        showAlert(error.message || 'حدث خطأ أثناء تسجيل الدخول', 'error');
        setLoading(false);
    }
}

/**
 * Handle two-factor authentication login flow
 * When 2FA is enabled, users login with email only (no password needed)
 */
async function handleTwoFactorLogin(email, password) {
    try {
        // Check if user exists with this email
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', email)
            .single();
        
        if (userError || !userData) {
            showAlert('البريد الإلكتروني غير مسجل في النظام', 'error');
            setLoading(false);
            return;
        }
        
        // User exists, now send OTP
        setLoading(false);
        
        // Hide login form and show OTP form
        showOTPForm(email);
        
        // Send OTP via Supabase
        const { error: otpError } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                shouldCreateUser: false, // Don't create user, only send OTP for existing users
                emailRedirectTo: undefined
            }
        });
        
        if (otpError) {
            console.error('Error sending OTP:', otpError);
            showAlert('فشل إرسال رمز التحقق. يرجى المحاولة مرة أخرى.', 'error');
            hideOTPForm();
            return;
        }
        
        showAlert('تم إرسال رمز التحقق إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد وإدخال الرمز المكون من 6 أرقام.', 'info');
        
    } catch (error) {
        console.error('2FA login error:', error);
        showAlert(error.message || 'حدث خطأ أثناء تسجيل الدخول', 'error');
        setLoading(false);
    }
}

/**
 * Show OTP verification form
 */
function showOTPForm(email) {
    // Hide login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.style.display = 'none';
    }
    
    // Create or show OTP form
    let otpForm = document.getElementById('otp-form');
    if (!otpForm) {
        otpForm = document.createElement('form');
        otpForm.id = 'otp-form';
        otpForm.className = 'auth-form';
        otpForm.innerHTML = `
            <div class="form-group">
                <label for="otp-code" class="form-label required">رمز التحقق</label>
                <div class="input-with-icon">
                    <i class="fas fa-key"></i>
                    <input 
                        type="text" 
                        id="otp-code" 
                        name="otp-code" 
                        class="form-input"
                        placeholder="أدخل رمز التحقق المكون من 6 أرقام"
                        required
                        maxlength="6"
                        autocomplete="one-time-code"
                        pattern="[0-9]{6}"
                    >
                </div>
                <p class="form-help">أدخل الرمز المكون من 6 أرقام المرسل إلى ${email}</p>
            </div>
            
            <button type="submit" class="btn btn-primary btn-large btn-block" id="verify-otp-btn">
                <i class="fas fa-check-circle"></i>
                <span>تحقق من الرمز</span>
            </button>
            
            <button type="button" class="btn btn-outline btn-large btn-block" id="resend-otp-btn" style="margin-top: 1rem;">
                <i class="fas fa-redo"></i>
                <span>إعادة إرسال الرمز</span>
            </button>
            
            <button type="button" class="btn btn-ghost btn-block" id="back-to-login-btn" style="margin-top: 0.5rem;">
                <i class="fas fa-arrow-right"></i>
                <span>العودة لتسجيل الدخول</span>
            </button>
        `;
        
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer && alertContainer.parentNode) {
            alertContainer.parentNode.insertBefore(otpForm, alertContainer.nextSibling);
        }
        
        // Add event listeners
        otpForm.addEventListener('submit', handleOTPVerification);
        document.getElementById('resend-otp-btn').addEventListener('click', () => {
            resendOTP(email);
        });
        document.getElementById('back-to-login-btn').addEventListener('click', hideOTPForm);
        
        // Auto-focus OTP input
        const otpInput = document.getElementById('otp-code');
        if (otpInput) {
            otpInput.focus();
        }
    } else {
        otpForm.style.display = 'block';
    }
}

/**
 * Hide OTP form and show login form
 */
function hideOTPForm() {
    const otpForm = document.getElementById('otp-form');
    if (otpForm) {
        otpForm.style.display = 'none';
    }
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.style.display = 'block';
    }
    
    // Clear alerts
    clearAlerts();
}

/**
 * Handle OTP verification
 */
async function handleOTPVerification(e) {
    e.preventDefault();
    
    const otpCode = document.getElementById('otp-code').value.trim();
    const verifyBtn = document.getElementById('verify-otp-btn');
    
    if (!otpCode || otpCode.length !== 6) {
        showAlert('يرجى إدخال رمز التحقق المكون من 6 أرقام', 'error');
        return;
    }
    
    // Get email from form
    const email = document.getElementById('email').value.trim().toLowerCase();
    
    // Show loading
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = '<div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></div> <span>جاري التحقق...</span>';
    
    try {
        // Verify OTP with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
            email: email,
            token: otpCode,
            type: 'email'
        });
        
        if (error) {
            throw error;
        }
        
        if (data && data.user) {
            // OTP verified successfully
            showAlert('تم التحقق من الرمز بنجاح! جاري تسجيل الدخول...', 'success');
            
            // Wait for authStore to initialize
            await authStore.waitForInitialization();
            
            // Get user data
            let user = authStore.getState().user;
            if (!user) {
                user = await authStore.getCurrentUser();
            }
            if (!user) {
                await new Promise(resolve => setTimeout(resolve, 500));
                user = authStore.getState().user || await authStore.getCurrentUser();
            }
            
            // التأكد من جلب role بشكل صحيح قبل إعادة التوجيه
            let userRole = user?.role;
            
            // إذا لم يكن role موجوداً، انتظر قليلاً ثم أعد المحاولة
            if (!userRole) {
                console.warn('User role not found in 2FA, waiting and retrying...');
                await new Promise(resolve => setTimeout(resolve, 500));
                const retryUser = await authStore.getCurrentUser();
                userRole = retryUser?.role || 'researcher';
            }

            // Redirect based on role
            setTimeout(() => {
                console.log('Redirecting user with role:', userRole);
                if (userRole === 'admin' || userRole === 'super_admin') {
                    window.location.href = '/pages/admin/dashboard.html';
                } else {
                    window.location.href = '/pages/researcher/dashboard.html';
                }
            }, 1000);
        } else {
            throw new Error('فشل التحقق من الرمز');
        }
        
    } catch (error) {
        console.error('OTP verification error:', error);
        const errorMsg = error.message || 'رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.';
        showAlert(errorMsg, 'error');
        
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>تحقق من الرمز</span>';
        
        // Clear OTP input on error
        document.getElementById('otp-code').value = '';
    }
}

/**
 * Resend OTP code
 */
async function resendOTP(email) {
    const resendBtn = document.getElementById('resend-otp-btn');
    const originalHTML = resendBtn.innerHTML;
    
    resendBtn.disabled = true;
    resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري الإرسال...</span>';
    
    try {
        const { error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                shouldCreateUser: false,
                emailRedirectTo: undefined
            }
        });
        
        if (error) {
            throw error;
        }
        
        showAlert('تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني', 'success');
        
    } catch (error) {
        console.error('Resend OTP error:', error);
        showAlert('فشل إعادة إرسال الرمز. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
        resendBtn.disabled = false;
        resendBtn.innerHTML = originalHTML;
    }
}

