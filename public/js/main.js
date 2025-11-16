/**
 * Main JavaScript File
 * Global utilities and configurations
 */

// Import Supabase client
import { supabase } from './config/supabase.js';
import { CONSTANTS } from './config/constants.js';

// ========================================
// Global State
// ========================================
const App = {
    currentUser: null,
    isLoading: false,
};

// ========================================
// Authentication Helpers
// ========================================

/**
 * Check if user is logged in
 */
async function checkAuth() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            App.currentUser = session.user;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
}

/**
 * Get current user
 */
async function getCurrentUser() {
    if (App.currentUser) return App.currentUser;
    
    const { data: { user } } = await supabase.auth.getUser();
    App.currentUser = user;
    return user;
}

/**
 * Redirect if not authenticated
 */
async function requireAuth() {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        window.location.href = '/pages/login.html';
        return false;
    }
    return true;
}

/**
 * Logout user
 */
async function logout() {
    try {
        await supabase.auth.signOut();
        App.currentUser = null;
        window.location.href = '/pages/login.html';
    } catch (error) {
        console.error('Logout failed:', error);
        showNotification('فشل تسجيل الخروج', 'error');
    }
}

// ========================================
// UI Utilities
// ========================================

/**
 * Show notification
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `toast-notification toast-${type}`;
    notification.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getIconForType(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // Add styles if not exists
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 1rem;
                min-width: 300px;
                animation: slideDown 0.3s ease;
            }
            .toast-notification.toast-success { border-right: 4px solid #10b981; }
            .toast-notification.toast-error { border-right: 4px solid #ef4444; }
            .toast-notification.toast-warning { border-right: 4px solid #f59e0b; }
            .toast-notification.toast-info { border-right: 4px solid #3b82f6; }
            .toast-content { display: flex; align-items: center; gap: 0.75rem; flex: 1; }
            .toast-content i { font-size: 1.25rem; }
            .toast-success .toast-content i { color: #10b981; }
            .toast-error .toast-content i { color: #ef4444; }
            .toast-warning .toast-content i { color: #f59e0b; }
            .toast-info .toast-content i { color: #3b82f6; }
            .toast-close { background: none; border: none; cursor: pointer; color: #6b7280; }
            @keyframes slideDown {
                from { transform: translate(-50%, -100%); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // Close button
    notification.querySelector('.toast-close').addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove
    if (duration > 0) {
        setTimeout(() => notification.remove(), duration);
    }
}

function getIconForType(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Show loading overlay
 */
function showLoading(message = 'جاري التحميل...') {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(overlay);
    App.isLoading = true;
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.remove();
    App.isLoading = false;
}

/**
 * Confirm dialog
 */
function confirmDialog(message, title = 'تأكيد') {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'modal-overlay';
        dialog.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="modal-actions">
                    <button class="btn btn-primary" data-action="confirm">تأكيد</button>
                    <button class="btn btn-ghost" data-action="cancel">إلغاء</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        dialog.querySelector('[data-action="confirm"]').addEventListener('click', () => {
            dialog.remove();
            resolve(true);
        });

        dialog.querySelector('[data-action="cancel"]').addEventListener('click', () => {
            dialog.remove();
            resolve(false);
        });
    });
}

// ========================================
// Form Utilities
// ========================================

/**
 * Validate form
 */
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'هذا الحقل مطلوب');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });

    return isValid;
}

/**
 * Show field error
 */
function showFieldError(input, message) {
    input.classList.add('error');
    
    let errorDiv = input.parentElement.querySelector('.form-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        input.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

/**
 * Clear field error
 */
function clearFieldError(input) {
    input.classList.remove('error');
    const errorDiv = input.parentElement.querySelector('.form-error');
    if (errorDiv) errorDiv.remove();
}

/**
 * Serialize form data
 */
function serializeForm(formElement) {
    const formData = new FormData(formElement);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

// ========================================
// Date & Time Utilities
// ========================================

/**
 * Format date to Arabic
 */
function formatDate(date) {
    if (!date) return '-';
    
    const d = new Date(date);
    return d.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format relative time
 */
function formatRelativeTime(date) {
    if (!date) return '-';
    
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    
    return formatDate(date);
}

// ========================================
// Local Storage Utilities
// ========================================

/**
 * Save to local storage
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Storage save failed:', error);
        return false;
    }
}

/**
 * Get from local storage
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Storage get failed:', error);
        return defaultValue;
    }
}

/**
 * Remove from local storage
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Storage remove failed:', error);
        return false;
    }
}

// ========================================
// Export globals
// ========================================

window.App = App;
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.requireAuth = requireAuth;
window.logout = logout;
window.showNotification = showNotification;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.confirmDialog = confirmDialog;
window.validateForm = validateForm;
window.showFieldError = showFieldError;
window.clearFieldError = clearFieldError;
window.serializeForm = serializeForm;
window.formatDate = formatDate;
window.formatRelativeTime = formatRelativeTime;
window.saveToStorage = saveToStorage;
window.getFromStorage = getFromStorage;
window.removeFromStorage = removeFromStorage;

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
});

