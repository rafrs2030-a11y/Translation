/**
 * Admin Settings Page
 * صفحة الإعدادات للأدمن
 */

import { supabase } from '../config/supabase.js';
import authStore from '../stores/authStore.js';
import { requireAdmin } from '../utils/auth-guard.js';

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
        // TODO: Load settings from a settings table in database
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
    
    // Track changes to toggle switches
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const settingId = e.target.id;
            settings[settingId] = e.target.checked;
            console.log(`Setting ${settingId} changed to:`, e.target.checked);
        });
    });
    
    // Track changes to text inputs
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
        input.addEventListener('change', (e) => {
            const settingValue = e.target.value;
            console.log('Setting changed:', settingValue);
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
        
        // TODO: Save to database
        console.log('Saving settings:', settingsToSave);
        
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
        
        // TODO: Implement actual backup logic
        // This would typically:
        // 1. Export all database tables
        // 2. Create a backup file
        // 3. Store in cloud storage or download
        
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
    // TODO: Implement toast notification
    alert(message);
}

