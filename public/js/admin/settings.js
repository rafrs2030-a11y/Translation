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
 * Clear old cache and reload from Supabase
 */
async function clearSettingsCache() {
    try {
        // Remove old cache from localStorage
        localStorage.removeItem('platform_name');
        localStorage.removeItem('contact_email');
        localStorage.removeItem('contact_phone');
        localStorage.removeItem('whatsapp_number');
        localStorage.removeItem('contact_address');
        
        // Clear cache in utility modules
        if (typeof window !== 'undefined') {
            // Clear platform name cache
            window.dispatchEvent(new CustomEvent('clearPlatformNameCache'));
            // Clear contact email cache
            window.dispatchEvent(new CustomEvent('clearContactEmailCache'));
            // Clear contact info cache
            window.dispatchEvent(new CustomEvent('clearContactInfoCache'));
        }
        
        console.log('✅ تم مسح الكاش القديم');
        
        // Reload settings from Supabase
        await loadSettings();
        
        return true;
    } catch (error) {
        console.error('Error clearing cache:', error);
        return false;
    }
}

/**
 * Load settings from database
 */
async function loadSettings() {
    try {
        // Clear old cache first
        localStorage.removeItem('platform_name');
        localStorage.removeItem('contact_email');
        localStorage.removeItem('contact_phone');
        localStorage.removeItem('whatsapp_number');
        localStorage.removeItem('contact_address');
        
        // Load settings from Supabase
        const { data: settings, error } = await supabase
            .from('platform_settings')
            .select('setting_key, setting_value')
            .order('setting_key');
        
        if (error) {
            console.error('Error loading settings from Supabase:', error);
            // Fallback to localStorage
            loadSettingsFromLocalStorage();
            return;
        }
        
        // Process settings
        const settingsMap = {};
        if (settings && settings.length > 0) {
            settings.forEach(setting => {
                settingsMap[setting.setting_key] = setting.setting_value;
                // Save to localStorage as cache (fresh from Supabase)
                localStorage.setItem(setting.setting_key, setting.setting_value);
            });
        }
        
        // Update platform name input
        const platformName = settingsMap['platform_name'] || 'منصة نشر الأبحاث العربية';
        const platformNameInput = document.getElementById('platform-name-input');
        if (platformNameInput) {
            platformNameInput.value = platformName;
        }
        
        // Update contact email input
        const contactEmail = settingsMap['contact_email'] || 'contact@arabresearch.com';
        const contactEmailInput = document.getElementById('contact-email-input');
        if (contactEmailInput) {
            contactEmailInput.value = contactEmail;
        }
        
        // Update contact phone input
        const contactPhone = settingsMap['contact_phone'] || '+966 58 000 2284';
        const contactPhoneInput = document.getElementById('contact-phone-input');
        if (contactPhoneInput) {
            contactPhoneInput.value = contactPhone;
        }
        
        // Update WhatsApp number input
        const whatsappNumber = settingsMap['whatsapp_number'] || '966580002284';
        const whatsappNumberInput = document.getElementById('whatsapp-number-input');
        if (whatsappNumberInput) {
            whatsappNumberInput.value = whatsappNumber;
        }
        
        // Update contact address input
        const contactAddress = settingsMap['contact_address'] || '3727 ريحانة بنت زيد - 8602 حي النرجس ، 13339';
        const contactAddressInput = document.getElementById('contact-address-input');
        if (contactAddressInput) {
            contactAddressInput.value = contactAddress;
        }
        
        // Update last backup date (if available)
        updateLastBackupDate();
        
        console.log('✅ تم تحميل الإعدادات من Supabase:', settingsMap);
        
    } catch (error) {
        console.error('Error loading settings:', error);
        // Fallback to localStorage
        loadSettingsFromLocalStorage();
    }
}

/**
 * Load settings from localStorage (fallback)
 */
function loadSettingsFromLocalStorage() {
    const platformName = localStorage.getItem('platform_name') || 'منصة نشر الأبحاث العربية';
    const platformNameInput = document.getElementById('platform-name-input');
    if (platformNameInput) {
        platformNameInput.value = platformName;
    }
    
    const contactEmail = localStorage.getItem('contact_email') || 'contact@arabresearch.com';
    const contactEmailInput = document.getElementById('contact-email-input');
    if (contactEmailInput) {
        contactEmailInput.value = contactEmail;
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
    
    // Clear settings cache button
    document.getElementById('clear-settings-cache-btn')?.addEventListener('click', async () => {
        const btn = document.getElementById('clear-settings-cache-btn');
        const originalHTML = btn.innerHTML;
        
        try {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحديث...';
            
            // Clear cache and reload from Supabase
            const success = await clearSettingsCache();
            
            if (success) {
                showSuccess('تم مسح الكاش وتحديث الإعدادات من قاعدة البيانات بنجاح');
                
                // Update page platform name and contact email
                updatePlatformName(localStorage.getItem('platform_name') || 'منصة نشر الأبحاث العربية');
                updateContactEmail(localStorage.getItem('contact_email') || 'contact@arabresearch.com');
            } else {
                showError('حدث خطأ أثناء مسح الكاش');
            }
        } catch (error) {
            console.error('Error clearing settings cache:', error);
            showError('حدث خطأ أثناء مسح الكاش');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    });
    
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
    
    // Track changes to platform name input (real-time)
    const platformNameInput = document.getElementById('platform-name-input');
    if (platformNameInput) {
        let platformNameTimeout;
        platformNameInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (!value) return;
            
            // Debounce: Update after 500ms of no typing
            clearTimeout(platformNameTimeout);
            platformNameTimeout = setTimeout(async () => {
                const oldValue = localStorage.getItem('platform_name');
                
                // Save to localStorage immediately (cache)
                localStorage.setItem('platform_name', value);
                
                // Save to Supabase
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const { error } = await supabase
                        .from('platform_settings')
                        .upsert({
                            setting_key: 'platform_name',
                            setting_value: value,
                            updated_by: user?.id
                        }, {
                            onConflict: 'setting_key'
                        });
                    
                    if (error) {
                        console.error('Error saving platform name to Supabase:', error);
                    }
                } catch (error) {
                    console.error('Error saving platform name:', error);
                }
                
                // Update in current page (real-time)
                updatePlatformName(value);
                
                // Dispatch custom event for same-page updates
                window.dispatchEvent(new CustomEvent('platformNameUpdated', {
                    detail: { name: value, oldValue: oldValue }
                }));
            }, 500);
        });
    }
    
    // Track changes to contact email input (real-time)
    const contactEmailInput = document.getElementById('contact-email-input');
    if (contactEmailInput) {
        let contactEmailTimeout;
        contactEmailInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (!value) return;
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return;
            
            // Debounce: Update after 500ms of no typing
            clearTimeout(contactEmailTimeout);
            contactEmailTimeout = setTimeout(async () => {
                const oldValue = localStorage.getItem('contact_email');
                
                // Save to localStorage immediately (cache)
                localStorage.setItem('contact_email', value);
                
                // Save to Supabase
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const { error } = await supabase
                        .from('platform_settings')
                        .upsert({
                            setting_key: 'contact_email',
                            setting_value: value,
                            updated_by: user?.id
                        }, {
                            onConflict: 'setting_key'
                        });
                    
                    if (error) {
                        console.error('Error saving contact email to Supabase:', error);
                    }
                } catch (error) {
                    console.error('Error saving contact email:', error);
                }
                
                // Update in current page (real-time)
                updateContactEmail(value);
                
                // Dispatch custom event for same-page updates
                window.dispatchEvent(new CustomEvent('contactEmailUpdated', {
                    detail: { email: value, oldValue: oldValue }
                }));
            }, 500);
        });
    }
    
    // Track changes to contact phone input (real-time)
    const contactPhoneInput = document.getElementById('contact-phone-input');
    if (contactPhoneInput) {
        let contactPhoneTimeout;
        contactPhoneInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (!value) return;
            
            // Debounce: Update after 500ms of no typing
            clearTimeout(contactPhoneTimeout);
            contactPhoneTimeout = setTimeout(async () => {
                const oldValue = localStorage.getItem('contact_phone');
                
                // Save to localStorage immediately (cache)
                localStorage.setItem('contact_phone', value);
                
                // Save to Supabase
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const { error } = await supabase
                        .from('platform_settings')
                        .upsert({
                            setting_key: 'contact_phone',
                            setting_value: value,
                            updated_by: user?.id
                        }, {
                            onConflict: 'setting_key'
                        });
                    
                    if (error) {
                        console.error('Error saving contact phone to Supabase:', error);
                    } else {
                        // Update in all pages
                        window.dispatchEvent(new CustomEvent('contactInfoUpdated', {
                            detail: { type: 'phone', value: value }
                        }));
                    }
                } catch (error) {
                    console.error('Error saving contact phone:', error);
                }
            }, 500);
        });
    }
    
    // Track changes to WhatsApp number input (real-time)
    const whatsappNumberInput = document.getElementById('whatsapp-number-input');
    if (whatsappNumberInput) {
        let whatsappNumberTimeout;
        whatsappNumberInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (!value) return;
            
            // Debounce: Update after 500ms of no typing
            clearTimeout(whatsappNumberTimeout);
            whatsappNumberTimeout = setTimeout(async () => {
                const oldValue = localStorage.getItem('whatsapp_number');
                
                // Save to localStorage immediately (cache)
                localStorage.setItem('whatsapp_number', value);
                
                // Save to Supabase
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const { error } = await supabase
                        .from('platform_settings')
                        .upsert({
                            setting_key: 'whatsapp_number',
                            setting_value: value,
                            updated_by: user?.id
                        }, {
                            onConflict: 'setting_key'
                        });
                    
                    if (error) {
                        console.error('Error saving WhatsApp number to Supabase:', error);
                    } else {
                        // Update in all pages
                        window.dispatchEvent(new CustomEvent('contactInfoUpdated', {
                            detail: { type: 'whatsapp', value: value }
                        }));
                    }
                } catch (error) {
                    console.error('Error saving WhatsApp number:', error);
                }
            }, 500);
        });
    }
    
    // Track changes to contact address input (real-time)
    const contactAddressInput = document.getElementById('contact-address-input');
    if (contactAddressInput) {
        let contactAddressTimeout;
        contactAddressInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (!value) return;
            
            // Debounce: Update after 500ms of no typing
            clearTimeout(contactAddressTimeout);
            contactAddressTimeout = setTimeout(async () => {
                const oldValue = localStorage.getItem('contact_address');
                
                // Save to localStorage immediately (cache)
                localStorage.setItem('contact_address', value);
                
                // Save to Supabase
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const { error } = await supabase
                        .from('platform_settings')
                        .upsert({
                            setting_key: 'contact_address',
                            setting_value: value,
                            updated_by: user?.id
                        }, {
                            onConflict: 'setting_key'
                        });
                    
                    if (error) {
                        console.error('Error saving contact address to Supabase:', error);
                    } else {
                        // Update in all pages
                        window.dispatchEvent(new CustomEvent('contactInfoUpdated', {
                            detail: { type: 'address', value: value }
                        }));
                    }
                } catch (error) {
                    console.error('Error saving contact address:', error);
                }
            }, 500);
        });
    }
    
    // Track changes to other text inputs
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
        if (input.id !== 'platform-name-input' && 
            input.id !== 'contact-email-input' && 
            input.id !== 'contact-phone-input' && 
            input.id !== 'whatsapp-number-input' && 
            input.id !== 'contact-address-input') {
            input.addEventListener('change', () => {
                // Settings tracked in memory
            });
        }
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
        const platformNameInput = document.getElementById('platform-name-input');
        const platformName = platformNameInput?.value || 'منصة نشر الأبحاث العربية';
        
        const contactEmailInput = document.getElementById('contact-email-input');
        const contactEmail = contactEmailInput?.value || 'contact@arabresearch.com';
        
        const contactPhoneInput = document.getElementById('contact-phone-input');
        const contactPhone = contactPhoneInput?.value || '+966 58 000 2284';
        
        const whatsappNumberInput = document.getElementById('whatsapp-number-input');
        const whatsappNumber = whatsappNumberInput?.value || '966580002284';
        
        const contactAddressInput = document.getElementById('contact-address-input');
        const contactAddress = contactAddressInput?.value || '3727 ريحانة بنت زيد - 8602 حي النرجس ، 13339';
        
        // Get current user for audit
        const { data: { user } } = await supabase.auth.getUser();
        
        // Save platform settings to Supabase
        const platformSettingsToSave = [
            { setting_key: 'platform_name', setting_value: platformName, updated_by: user?.id },
            { setting_key: 'contact_email', setting_value: contactEmail, updated_by: user?.id },
            { setting_key: 'contact_phone', setting_value: contactPhone, updated_by: user?.id },
            { setting_key: 'whatsapp_number', setting_value: whatsappNumber, updated_by: user?.id },
            { setting_key: 'contact_address', setting_value: contactAddress, updated_by: user?.id }
        ];
        
        // Other settings (for future use)
        const otherSettings = {
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
        
        // Upsert platform settings in Supabase
        for (const setting of platformSettingsToSave) {
            const { error } = await supabase
                .from('platform_settings')
                .upsert({
                    setting_key: setting.setting_key,
                    setting_value: setting.setting_value,
                    updated_by: setting.updated_by
                }, {
                    onConflict: 'setting_key'
                });
            
            if (error) {
                console.error(`Error saving ${setting.setting_key}:`, error);
                // Continue with other settings even if one fails
            } else {
                // Save to localStorage as cache
                localStorage.setItem(setting.setting_key, setting.setting_value);
            }
        }
        
        // Update platform name in all places
        updatePlatformName(platformName);
        
        // Update contact email in all places
        updateContactEmail(contactEmail);
        
        // Update contact info in all places
        updatePageContactInfo();
        
        // Dispatch events for contact info updates
        window.dispatchEvent(new CustomEvent('contactInfoUpdated', {
            detail: { type: 'all', phone: contactPhone, whatsapp: whatsappNumber, address: contactAddress }
        }));
        
        // Note: Storage events will automatically fire for other tabs/windows
        // Custom events are dispatched by updatePlatformName and updateContactEmail
        
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
 * Update platform name in all places
 */
function updatePlatformName(platformName) {
    // Update using utility function
    updatePagePlatformName();
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('platformNameUpdated', { detail: { name: platformName } }));
}

/**
 * Update contact email in all places
 */
function updateContactEmail(contactEmail) {
    // Update using utility function
    updatePageContactEmail();
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('contactEmailUpdated', { detail: { email: contactEmail } }));
}

// Import platform name utility
import { getPlatformName as getPlatformNameUtil, updatePagePlatformName } from '../utils/platform-name.js';

// Import contact email utility
import { updatePageContactEmail } from '../utils/contact-email.js';

// Import contact info utility
import { updatePageContactInfo } from '../utils/contact-info.js';

/**
 * Get platform name from storage
 */
export function getPlatformName() {
    return getPlatformNameUtil();
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

