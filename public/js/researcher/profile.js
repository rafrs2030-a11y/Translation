/**
 * Researcher Profile JavaScript
 * الملف الشخصي للباحث
 */

import authStore from '../stores/authStore.js';
import submissionsStore from '../stores/submissionsStore.js';
import { handleLogout } from '../utils/logout.js';
import { supabase } from '../config/supabase.js';
import { requireResearcher } from '../utils/auth-guard.js';

// State
let currentUser = null;

// DOM Elements
let profileAvatar, profileName, profileEmail, profilePhone;
let totalSubmissions, approvedCount, pendingCount;
let personalInfoForm, contactInfoForm, notificationSettingsForm, changePasswordForm;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    currentUser = await requireResearcher();
    if (!currentUser) return;
    
    initElements();
    initEventListeners();
    await loadProfileData();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    // Profile header
    profileAvatar = document.getElementById('profile-avatar');
    profileName = document.getElementById('profile-name');
    profileEmail = document.getElementById('profile-email');
    profilePhone = document.getElementById('profile-phone');
    
    // Stats
    totalSubmissions = document.getElementById('total-submissions');
    approvedCount = document.getElementById('approved-count');
    pendingCount = document.getElementById('pending-count');
    
    // Forms
    personalInfoForm = document.getElementById('personal-info-form');
    contactInfoForm = document.getElementById('contact-info-form');
    notificationSettingsForm = document.getElementById('notification-settings-form');
    changePasswordForm = document.getElementById('change-password-form');
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            switchTab(targetTab);
        });
    });
    
    // Forms
    personalInfoForm?.addEventListener('submit', handlePersonalInfoUpdate);
    contactInfoForm?.addEventListener('submit', handleContactInfoUpdate);
    notificationSettingsForm?.addEventListener('submit', handleNotificationSettings);
    changePasswordForm?.addEventListener('submit', handlePasswordChange);
    
    // Avatar upload
    document.getElementById('avatar-upload')?.addEventListener('change', handleAvatarUpload);
    
    // Password toggle
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Delete account
    document.getElementById('delete-account-btn')?.addEventListener('click', handleDeleteAccount);
}

/**
 * Load profile data
 */
async function loadProfileData() {
    try {
        // Load user data
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
        
        if (userError) throw userError;
        
        currentUser = userData;
        
        // Update UI
        populateProfileHeader();
        populateForms();
        
        // Load stats
        await loadStats();
        
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('حدث خطأ في تحميل البيانات');
    }
}

/**
 * Populate profile header
 */
function populateProfileHeader() {
    // Avatar
    const initials = getInitials(currentUser.username);
    profileAvatar.textContent = initials;
    
    // Info
    profileName.textContent = currentUser.username;
    profileEmail.textContent = currentUser.email;
    profilePhone.textContent = currentUser.phone || 'غير محدد';
    
    // Email verified badge
    const verifiedBadge = document.getElementById('email-verified-badge');
    if (currentUser.email_verified) {
        verifiedBadge.textContent = 'موثّق';
        verifiedBadge.className = 'badge badge-success';
    } else {
        verifiedBadge.textContent = 'غير موثّق';
        verifiedBadge.className = 'badge badge-warning';
    }
    
    // Dates
    document.getElementById('created-at').textContent = formatDate(currentUser.created_at);
    document.getElementById('updated-at').textContent = formatDate(currentUser.updated_at);
}

/**
 * Populate forms
 */
function populateForms() {
    // Personal info
    document.getElementById('username').value = currentUser.username || '';
    document.getElementById('email').value = currentUser.email || '';
    
    // Contact info
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('national-id').value = currentUser.national_id || '';
}

/**
 * Load stats
 */
async function loadStats() {
    try {
        const { data, error } = await supabase
            .from('submissions')
            .select('status')
            .eq('user_id', currentUser.id);
        
        if (error) throw error;
        
        const total = data.length;
        const approved = data.filter(s => s.status === 'approved').length;
        const pending = data.filter(s => s.status === 'pending').length;
        
        totalSubmissions.textContent = total;
        approvedCount.textContent = approved;
        pendingCount.textContent = pending;
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

/**
 * Switch tab
 */
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Update tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName)?.classList.add('active');
}

/**
 * Handle personal info update
 */
async function handlePersonalInfoUpdate(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const username = formData.get('username');
        
        // Show loading
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
        
        // Update user
        const { data, error } = await supabase
            .from('users')
            .update({ 
                username,
                updated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id)
            .select()
            .single();
        
        if (error) throw error;
        
        currentUser = data;
        populateProfileHeader();
        
        showAlert('success', 'تم حفظ التغييرات بنجاح ✓');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        
    } catch (error) {
        console.error('Error updating profile:', error);
        showAlert('error', 'حدث خطأ: ' + error.message);
        
        // Reset button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> حفظ التغييرات';
    }
}

/**
 * Handle contact info update
 */
async function handleContactInfoUpdate(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const phone = formData.get('phone');
        const national_id = formData.get('national_id');
        
        // Show loading
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
        
        // Update user
        const { data, error } = await supabase
            .from('users')
            .update({ 
                phone,
                national_id,
                updated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id)
            .select()
            .single();
        
        if (error) throw error;
        
        currentUser = data;
        populateProfileHeader();
        
        showAlert('success', 'تم حفظ التغييرات بنجاح ✓');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        
    } catch (error) {
        console.error('Error updating contact info:', error);
        showAlert('error', 'حدث خطأ: ' + error.message);
        
        // Reset button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> حفظ التغييرات';
    }
}

/**
 * Handle notification settings
 */
async function handleNotificationSettings(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const settings = {
            email_enabled: document.getElementById('email-notifications').checked,
            status_change_email: document.getElementById('status-notifications').checked,
            comments_email: document.getElementById('comment-notifications').checked
        };
        
        // Show loading
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
        
        // Update or insert notification preferences
        const { data, error } = await supabase
            .from('notification_preferences')
            .upsert({ 
                user_id: currentUser.id,
                ...settings,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) throw error;
        
        showAlert('success', 'تم حفظ الإعدادات بنجاح ✓');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        
    } catch (error) {
        console.error('Error updating notification settings:', error);
        showAlert('error', 'حدث خطأ: ' + error.message);
        
        // Reset button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> حفظ الإعدادات';
    }
}

/**
 * Handle password change
 */
async function handlePasswordChange(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const currentPassword = formData.get('current_password');
        const newPassword = formData.get('new_password');
        const confirmPassword = formData.get('confirm_password');
        
        // Validate
        if (newPassword !== confirmPassword) {
            showAlert('error', 'كلمة المرور الجديدة غير متطابقة');
            return;
        }
        
        if (newPassword.length < 6) {
            showAlert('error', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }
        
        // Show loading
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التغيير...';
        
        // Update password using Supabase Auth
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        
        if (error) throw error;
        
        showAlert('success', 'تم تغيير كلمة المرور بنجاح ✓');
        
        // Reset form
        e.target.reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        
    } catch (error) {
        console.error('Error changing password:', error);
        showAlert('error', 'حدث خطأ: ' + error.message);
        
        // Reset button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> تغيير كلمة المرور';
    }
}

/**
 * Handle avatar upload
 */
async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('الرجاء اختيار صورة');
            return;
        }
        
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
            return;
        }
        
        alert('سيتم تنفيذ رفع الصورة قريباً');
        
        // TODO: Implement avatar upload to Supabase Storage
        
    } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('حدث خطأ في رفع الصورة');
    }
}

/**
 * Handle delete account
 */
async function handleDeleteAccount() {
    if (!confirm('هل أنت متأكد من حذف حسابك؟\n\nهذا الإجراء نهائي ولا يمكن التراجع عنه!\n\nسيتم حذف جميع بياناتك وأبحاثك.')) {
        return;
    }
    
    if (!confirm('تأكيد نهائي: هل أنت متأكد 100% من حذف حسابك؟')) {
        return;
    }
    
    try {
        // Delete user account
        // This should be handled by backend with proper cascade deletes
        alert('سيتم تنفيذ هذه الميزة قريباً');
        
        // TODO: Implement account deletion
        
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('حدث خطأ في حذف الحساب');
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    document.getElementById('sidebar')?.classList.toggle('active');
}

/**
 * Show alert
 */
function showAlert(type, message) {
    // Remove existing alerts
    document.querySelectorAll('.alert').forEach(alert => alert.remove());
    
    // Create alert
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Insert at the top of active tab content
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        activeTab.insertBefore(alert, activeTab.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

/**
 * Get initials
 */
function getInitials(username) {
    if (!username) return '?';
    const parts = username.split(' ');
    if (parts.length >= 2) {
        return parts[0][0] + parts[1][0];
    }
    return username.substring(0, 2).toUpperCase();
}

/**
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Export functions if needed
export {
    loadProfileData,
    handlePersonalInfoUpdate,
    handlePasswordChange
};

