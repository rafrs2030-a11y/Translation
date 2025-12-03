/**
 * Main JavaScript File
 * Global utilities and configurations
 */

// Import Supabase client
import { supabase } from './config/supabase.js';

// Import cache clearing utilities
import { 
    clearAllOldCache, 
    clearChatCache, 
    clearNotificationsCache, 
    clearAssetCache,
    clearCompleteCache,
    clearCacheAndReload 
} from './utils/clear-cache.js';

// Import platform name utility
import { initPlatformName } from './utils/platform-name.js';

// Import contact email utility
import { initContactEmail } from './utils/contact-email.js';

// Import contact info utility
import { initContactInfo } from './utils/contact-info.js';

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

/**
 * Clear all cache (Service Worker, localStorage, sessionStorage)
 * مسح جميع أنواع الكاش (بما في ذلك الإصدارات القديمة)
 */
async function clearAllCache() {
    try {
        console.log('بدء مسح الكاش...');
        
        let cacheNamesDeleted = [];
        let localStorageItemsDeleted = 0;
        let serviceWorkersUnregistered = 0;
        
        // Clear ALL Service Worker caches (including old versions)
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            console.log('تم العثور على', cacheNames.length, 'كاش:', cacheNames);
            
            // Delete all caches (including old versions)
            await Promise.all(
                cacheNames.map(async (cacheName) => {
                    try {
                        console.log('مسح كاش:', cacheName);
                        const deleted = await caches.delete(cacheName);
                        if (deleted) {
                            cacheNamesDeleted.push(cacheName);
                        }
                        return deleted;
                    } catch (err) {
                        console.error('خطأ في مسح كاش:', cacheName, err);
                        return false;
                    }
                })
            );
            console.log('✓ تم مسح', cacheNamesDeleted.length, 'كاش من Service Worker');
        }
        
        // Clear localStorage (keep auth tokens only)
        const importantKeys = ['supabase.auth.token', 'sb-'];
        const allKeys = Object.keys(localStorage);
        const keysToRemove = allKeys.filter(
            key => !importantKeys.some(important => key.includes(important))
        );
        
        keysToRemove.forEach(key => {
            try {
                console.log('مسح من localStorage:', key);
                localStorage.removeItem(key);
                localStorageItemsDeleted++;
            } catch (err) {
                console.error('خطأ في مسح:', key, err);
            }
        });
        console.log('✓ تم مسح', localStorageItemsDeleted, 'عنصر من localStorage');
        
        // Clear ALL sessionStorage
        try {
            const sessionKeys = Object.keys(sessionStorage);
            sessionStorage.clear();
            console.log('✓ تم مسح', sessionKeys.length, 'عنصر من sessionStorage');
        } catch (err) {
            console.error('خطأ في مسح sessionStorage:', err);
        }
        
        // Unregister ALL Service Workers (including old versions)
        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                console.log('تم العثور على', registrations.length, 'Service Worker مسجل');
                
                await Promise.all(
                    registrations.map(async (registration) => {
                        try {
                            console.log('إلغاء تسجيل Service Worker:', registration.scope);
                            const unregistered = await registration.unregister();
                            if (unregistered) {
                                serviceWorkersUnregistered++;
                            }
                            return unregistered;
                        } catch (err) {
                            console.error('خطأ في إلغاء تسجيل Service Worker:', err);
                            return false;
                        }
                    })
                );
                console.log('✓ تم إلغاء تسجيل', serviceWorkersUnregistered, 'Service Worker');
            } catch (err) {
                console.error('خطأ في جلب Service Workers:', err);
            }
        }
        
        console.log('✓ تم مسح الكاش بنجاح');
        
        return { 
            success: true, 
            message: 'تم مسح الكاش بنجاح',
            cleared: {
                serviceWorker: cacheNamesDeleted.length,
                localStorage: localStorageItemsDeleted,
                sessionStorage: true,
                serviceWorkersUnregistered: serviceWorkersUnregistered
            },
            details: {
                cacheNames: cacheNamesDeleted
            }
        };
    } catch (error) {
        console.error('خطأ في مسح الكاش:', error);
        return { success: false, error: error.message };
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
window.clearAllCache = clearAllCache;

// جعل دوال مسح الكاش المحسّنة متاحة عالمياً
window.clearAllOldCache = clearAllOldCache;
window.clearChatCache = clearChatCache;
window.clearNotificationsCache = clearNotificationsCache;
window.clearAssetCache = clearAssetCache;
window.clearCompleteCache = clearCompleteCache;
window.clearCacheAndReload = clearCacheAndReload;

// دالة سريعة لمسح الكاش وإعادة التحميل
window.clearCache = async () => {
    console.log('🔄 مسح الكاش وإعادة التحميل...');
    await clearCompleteCache();
    setTimeout(() => {
        window.location.reload(true);
    }, 500);
};

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('App initialized');
    
    // Initialize platform name
    initPlatformName();
    
    // Initialize contact email
    initContactEmail();
    
    // Initialize contact info (phone, whatsapp, address)
    initContactInfo();
    
    // Initialize user menu dropdown
    initUserMenuDropdown();
    
    // Initialize chat if chat button exists (with retry mechanism)
    await initChatWithRetry();
});

/**
 * Initialize chat with retry mechanism
 */
async function initChatWithRetry() {
    const maxRetries = 3;
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            const chatBtn = document.getElementById('chat-btn');
            if (!chatBtn) {
                // No chat button on this page, skip
                return;
            }
            
            // Import and initialize chat
            const chatModule = await import('./utils/init-chat.js');
            await chatModule.initChatIfExists();
            
            // Verify initialization
            if (chatBtn.onclick || chatBtn.getAttribute('data-chat-initialized')) {
                console.log('✅ Chat initialized successfully');
                return;
            }
            
            // If not initialized, wait and retry
            retries++;
            if (retries < maxRetries) {
                console.log(`⏳ Retrying chat initialization (${retries}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (err) {
            console.warn('Chat initialization error:', err);
            retries++;
            if (retries < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
    
    // Final attempt: direct initialization
    try {
        const chatBtn = document.getElementById('chat-btn');
        if (chatBtn && !chatBtn.getAttribute('data-chat-initialized')) {
            console.log('🔄 Attempting direct chat initialization...');
            const chatModule = await import('./utils/init-chat.js');
            await chatModule.initChatIfExists();
            chatBtn.setAttribute('data-chat-initialized', 'true');
        }
    } catch (err) {
        console.error('Failed to initialize chat after all retries:', err);
    }
}

/**
 * Initialize user menu dropdown
 */
function initUserMenuDropdown() {
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');
    const logoutLink = document.getElementById('logout-link');
    
    if (!userMenuBtn || !userMenuDropdown) return;
    
    // Toggle dropdown on click
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = userMenuDropdown.style.display === 'block';
        userMenuDropdown.style.display = isVisible ? 'none' : 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userMenuBtn.contains(e.target) && !userMenuDropdown.contains(e.target)) {
            userMenuDropdown.style.display = 'none';
        }
    });
    
    // Handle logout
    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            await logout();
        });
    }
}

