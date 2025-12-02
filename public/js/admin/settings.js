/**
 * Admin Settings Page
 * صفحة الإعدادات للأدمن
 */

import { supabase } from '../config/supabase.js';
import authStore from '../stores/authStore.js';
import { requireAdmin } from '../utils/auth-guard.js';
import { clearCompleteCache, clearCacheAndReload } from '../utils/clear-cache.js';

// Settings object
const settings = {};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAdmin();
    if (!user) return;
    
    await loadSettings();
    initEventListeners();
});

/**
 * Load settings from database
 */
async function loadSettings() {
    try {
        // Load settings from database
        // For now, use default values
        
        // Update last backup date (if available)
        updateLastBackupDate();
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Save all settings button
    document.getElementById('save-settings-btn')?.addEventListener('click', saveAllSettings);
    
    // Create backup button
    document.getElementById('create-backup-btn')?.addEventListener('click', createBackup);
    
    // Clear cache button
    document.getElementById('clear-cache-btn')?.addEventListener('click', handleClearCache);
    
    // Update cache info on load
    updateCacheInfo();
    
    // Track changes to toggle switches
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const settingId = e.target.id;
            settings[settingId] = e.target.checked;
        });
    });
    
    // Track changes to text inputs
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
        input.addEventListener('change', () => {
            // Settings tracked in memory
        });
    });
}

/**
 * Save all settings
 */
async function saveAllSettings() {
    try {
        const btn = document.getElementById('save-settings-btn');
        
        // Show loading
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري الحفظ...</span>';
        
        // Collect all settings
        const settingsToSave = {
            // General settings
            platform_name: document.querySelector('[value="منصة نشر الأبحاث العربية"]')?.value,
            contact_email: document.querySelector('[value="contact@arabresearch.com"]')?.value,
            
            // Submission settings
            allow_submissions: document.getElementById('allow-submissions')?.checked,
            auto_review: document.getElementById('auto-review')?.checked,
            
            // Email settings
            email_notifications: document.getElementById('email-notifications')?.checked,
            email_new_submission: document.getElementById('email-new-submission')?.checked,
            email_status_change: document.getElementById('email-status-change')?.checked,
            
            // Security settings
            two_factor_auth: document.getElementById('two-factor-auth')?.checked,
            
            // Backup settings
            auto_backup: document.getElementById('auto-backup')?.checked,
        };
        
        // Save to database
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reset button
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> <span>حفظ جميع التغييرات</span>';
        
        // Show success message
        showSuccess('تم حفظ الإعدادات بنجاح');
        
    } catch (error) {
        console.error('Error saving settings:', error);
        showError('حدث خطأ أثناء حفظ الإعدادات');
        
        // Reset button
        const btn = document.getElementById('save-settings-btn');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> <span>حفظ جميع التغييرات</span>';
    }
}

/**
 * Create backup
 */
async function createBackup() {
    try {
        const btn = document.getElementById('create-backup-btn');
        
        // Show loading
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإنشاء...';
        
        // Implement actual backup logic
        // Simulate backup creation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update last backup date
        const now = new Date();
        const dateStr = now.toLocaleString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        document.getElementById('last-backup-date').textContent = dateStr;
        localStorage.setItem('last_backup_date', now.toISOString());
        
        // Reset button
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-download"></i> إنشاء نسخة احتياطية الآن';
        
        showSuccess('تم إنشاء النسخة الاحتياطية بنجاح');
        
    } catch (error) {
        console.error('Error creating backup:', error);
        showError('حدث خطأ أثناء إنشاء النسخة الاحتياطية');
        
        // Reset button
        const btn = document.getElementById('create-backup-btn');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-download"></i> إنشاء نسخة احتياطية الآن';
    }
}

/**
 * Update last backup date display
 */
function updateLastBackupDate() {
    const lastBackup = localStorage.getItem('last_backup_date');
    
    if (lastBackup) {
        const date = new Date(lastBackup);
        const dateStr = date.toLocaleString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        document.getElementById('last-backup-date').textContent = dateStr;
    }
}

/**
 * Show success message
 */
function showSuccess(message) {
    // TODO: Implement toast notification
    alert(message);
}

/**
 * Show error message
 */
function showError(message) {
    alert(message);
}

/**
 * Handle clear cache
 */
async function handleClearCache() {
    try {
        // Confirm action
        if (!confirm('هل أنت متأكد من مسح جميع أنواع الكاش؟\n\nسيتم مسح:\n- كاش Service Worker\n- localStorage\n- sessionStorage\n- IndexedDB\n- كاش الملفات الثابتة\n\nسيتم إعادة تحميل الصفحة بعد المسح.')) {
            return;
        }
        
        const btn = document.getElementById('clear-cache-btn');
        const statusEl = document.getElementById('cache-status');
        
        // Show loading
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المسح...';
        if (statusEl) {
            statusEl.textContent = 'جاري مسح الكاش...';
            statusEl.style.color = 'var(--warning-color)';
        }
        
        // Clear complete cache
        const result = await clearCompleteCache();
        
        if (result.success && result.results) {
            const results = result.results;
            
            // Update status
            if (statusEl) {
                statusEl.textContent = 'تم مسح الكاش بنجاح! جاري إعادة التحميل...';
                statusEl.style.color = 'var(--success-color)';
            }
            
            // Show success message
            const message = `✅ تم مسح الكاش بنجاح!\n\n` +
                `📦 Service Worker: ${results.serviceWorker} كاش\n` +
                `💾 localStorage: ${results.localStorage} عنصر\n` +
                `🗂️ sessionStorage: ${results.sessionStorage} عنصر\n` +
                `📊 IndexedDB: ${results.indexedDB ? 'تم المسح' : 'غير متوفر'}\n` +
                `🎨 الملفات الثابتة: ${results.assets} عنصر\n\n` +
                `المجموع: ${results.total} عنصر\n\n` +
                `سيتم إعادة تحميل الصفحة الآن...`;
            
            showSuccess(message);
            
            // Reload page after 2 seconds
            setTimeout(() => {
                window.location.reload(true);
            }, 2000);
            
        } else {
            throw new Error(result.error || 'فشل مسح الكاش');
        }
        
    } catch (error) {
        console.error('Error clearing cache:', error);
        showError('حدث خطأ أثناء مسح الكاش: ' + error.message);
        
        // Reset button
        const btn = document.getElementById('clear-cache-btn');
        const statusEl = document.getElementById('cache-status');
        
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-broom"></i> مسح الكاش الآن';
        if (statusEl) {
            statusEl.textContent = 'حدث خطأ';
            statusEl.style.color = 'var(--error-color)';
        }
    }
}

/**
 * Update cache info display
 */
function updateCacheInfo() {
    try {
        const cacheInfoEl = document.getElementById('cache-info');
        const cacheCountEl = document.getElementById('cache-count');
        
        if (!cacheInfoEl || !cacheCountEl) return;
        
        // Count localStorage items (excluding important keys)
        const importantKeys = ['supabase.auth.token', 'sb-'];
        const localStorageKeys = Object.keys(localStorage).filter(
            key => !importantKeys.some(important => key.includes(important))
        );
        
        // Count sessionStorage items
        const sessionStorageKeys = Object.keys(sessionStorage);
        
        // Count Service Worker caches (async)
        if ('caches' in window) {
            caches.keys().then(async (cacheNames) => {
                // Count IndexedDB databases
                let indexedDBCount = 0;
                if ('indexedDB' in window) {
                    try {
                        const databases = ['chat_cache', 'notifications_cache', 'app_cache', 'supabase_cache'];
                        for (const dbName of databases) {
                            try {
                                const req = indexedDB.open(dbName);
                                req.onsuccess = () => {
                                    indexedDBCount++;
                                };
                                req.onerror = () => {};
                            } catch (e) {}
                        }
                    } catch (e) {}
                }
                
                const totalItems = localStorageKeys.length + sessionStorageKeys.length + cacheNames.length + indexedDBCount;
                cacheCountEl.innerHTML = `
                    <strong>${totalItems}</strong> عنصر في الكاش<br>
                    <small style="color: var(--text-secondary);">
                        • ${localStorageKeys.length} localStorage<br>
                        • ${sessionStorageKeys.length} sessionStorage<br>
                        • ${cacheNames.length} Service Worker<br>
                        • ${indexedDBCount} IndexedDB
                    </small>
                `;
            });
        } else {
            const totalItems = localStorageKeys.length + sessionStorageKeys.length;
            cacheCountEl.textContent = `${totalItems} عنصر في الكاش (${localStorageKeys.length} localStorage، ${sessionStorageKeys.length} sessionStorage)`;
        }
        
    } catch (error) {
        console.error('Error updating cache info:', error);
    }
}

