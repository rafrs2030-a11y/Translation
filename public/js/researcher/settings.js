/**
 * Researcher Settings Page JavaScript
 * إدارة إعدادات المستخدم
 */

import authStore from '../stores/authStore.js';
import notificationsStore from '../stores/notificationsStore.js';
import { supabase } from '../config/supabase.js';

// DOM Elements
let alertContainer;
let saveButton;

// Settings state
let settings = {
    notifications: {
        email_enabled: true,
        in_app_enabled: true,
        status_change_email: true,
        comments_email: true,
        reminders_email: true,
        news_email: true,
    },
    language: 'ar',
    theme: 'light',
    privacy: {
        profile_visible: true,
        research_visible: true,
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initElements();
    loadSettings();
    initEventListeners();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    alertContainer = document.getElementById('alert-container');
    saveButton = document.getElementById('save-settings-btn');
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Save button
    saveButton.addEventListener('click', handleSaveSettings);

    // Auto-save on change (debounced)
    let saveTimeout;
    const inputs = document.querySelectorAll('input[type="checkbox"], select');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                handleSaveSettings();
            }, 1000); // Save after 1 second of inactivity
        });
    });
}

/**
 * Load settings from database and localStorage
 */
async function loadSettings() {
    try {
        const user = authStore.getState().user;
        if (!user) {
            showAlert('يجب تسجيل الدخول أولاً', 'error');
            setTimeout(() => {
                window.location.href = '/pages/login.html';
            }, 2000);
            return;
        }

        // Load notification preferences
        await loadNotificationPreferences();

        // Load language from localStorage
        const savedLanguage = localStorage.getItem('user_language') || 'ar';
        settings.language = savedLanguage;
        document.getElementById('language-select').value = savedLanguage;

        // Load theme from localStorage
        const savedTheme = localStorage.getItem('user_theme') || 'light';
        settings.theme = savedTheme;
        document.getElementById('theme-select').value = savedTheme;
        applyTheme(savedTheme);

        // Load privacy settings from localStorage
        const savedPrivacy = JSON.parse(localStorage.getItem('user_privacy') || '{"profile_visible":true,"research_visible":true}');
        settings.privacy = savedPrivacy;
        document.getElementById('profile-visible').checked = savedPrivacy.profile_visible !== false;
        document.getElementById('research-visible').checked = savedPrivacy.research_visible !== false;

    } catch (error) {
        console.error('Error loading settings:', error);
        showAlert('حدث خطأ أثناء تحميل الإعدادات', 'error');
    }
}

/**
 * Load notification preferences
 */
async function loadNotificationPreferences() {
    try {
        const result = await notificationsStore.fetchPreferences();
        
        if (result.success && result.data) {
            const prefs = result.data;
            settings.notifications = {
                email_enabled: prefs.email_enabled !== false,
                in_app_enabled: prefs.in_app_enabled !== false,
                status_change_email: prefs.status_change_email !== false,
                comments_email: prefs.comments_email !== false,
                reminders_email: prefs.reminders_email !== false,
                news_email: prefs.news_email !== false,
            };

            // Update UI
            document.getElementById('email-enabled').checked = settings.notifications.email_enabled;
            document.getElementById('in-app-enabled').checked = settings.notifications.in_app_enabled;
            document.getElementById('status-change-email').checked = settings.notifications.status_change_email;
            document.getElementById('comments-email').checked = settings.notifications.comments_email;
            document.getElementById('reminders-email').checked = settings.notifications.reminders_email;
            document.getElementById('news-email').checked = settings.notifications.news_email;
        }
    } catch (error) {
        console.error('Error loading notification preferences:', error);
    }
}

/**
 * Handle save settings
 */
async function handleSaveSettings() {
    try {
        // Collect current settings from UI
        settings.notifications = {
            email_enabled: document.getElementById('email-enabled').checked,
            in_app_enabled: document.getElementById('in-app-enabled').checked,
            status_change_email: document.getElementById('status-change-email').checked,
            comments_email: document.getElementById('comments-email').checked,
            reminders_email: document.getElementById('reminders-email').checked,
            news_email: document.getElementById('news-email').checked,
        };

        settings.language = document.getElementById('language-select').value;
        settings.theme = document.getElementById('theme-select').value;
        settings.privacy = {
            profile_visible: document.getElementById('profile-visible').checked,
            research_visible: document.getElementById('research-visible').checked,
        };

        // Show loading
        setLoading(true);

        // Save notification preferences
        await saveNotificationPreferences();

        // Save language
        localStorage.setItem('user_language', settings.language);
        applyLanguage(settings.language);

        // Save theme
        localStorage.setItem('user_theme', settings.theme);
        applyTheme(settings.theme);

        // Save privacy settings
        localStorage.setItem('user_privacy', JSON.stringify(settings.privacy));

        // Success
        showAlert('تم حفظ الإعدادات بنجاح', 'success');
        setLoading(false);

    } catch (error) {
        console.error('Error saving settings:', error);
        showAlert('حدث خطأ أثناء حفظ الإعدادات', 'error');
        setLoading(false);
    }
}

/**
 * Save notification preferences
 */
async function saveNotificationPreferences() {
    try {
        const user = authStore.getState().user;
        if (!user) return;

        const { data, error } = await supabase
            .from('notification_preferences')
            .upsert({
                user_id: user.id,
                email_enabled: settings.notifications.email_enabled,
                in_app_enabled: settings.notifications.in_app_enabled,
                status_change_email: settings.notifications.status_change_email,
                comments_email: settings.notifications.comments_email,
                reminders_email: settings.notifications.reminders_email,
                news_email: settings.notifications.news_email,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id'
            });

        if (error) throw error;

        // Update notifications store
        await notificationsStore.fetchPreferences();

    } catch (error) {
        console.error('Error saving notification preferences:', error);
        throw error;
    }
}

/**
 * Apply language
 */
function applyLanguage(language) {
    // Store language preference
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Note: Full i18n implementation would require a translation system
    // For now, we just store the preference
    console.log('Language preference saved:', language);
}

/**
 * Apply theme
 */
function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
    } else if (theme === 'light') {
        root.classList.add('light-theme');
        root.classList.remove('dark-theme');
    } else {
        // Auto mode - detect system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
        } else {
            root.classList.add('light-theme');
            root.classList.remove('dark-theme');
        }
    }
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
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);

    // Auto remove after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
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
 * Set loading state
 */
function setLoading(loading) {
    if (loading) {
        saveButton.disabled = true;
        saveButton.innerHTML = `
            <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
            <span>جاري الحفظ...</span>
        `;
    } else {
        saveButton.disabled = false;
        saveButton.innerHTML = `
            <i class="fas fa-save"></i>
            حفظ جميع الإعدادات
        `;
    }
}
