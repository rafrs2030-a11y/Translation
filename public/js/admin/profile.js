/**
 * Admin Profile JavaScript
 * الملف الشخصي للمسؤول
 */

import authStore from '../stores/authStore.js';
import { handleLogout } from '../utils/logout.js';
import { supabase, STORAGE_BUCKETS } from '../config/supabase.js';
import { requireAdmin } from '../utils/auth-guard.js';
import { initNotificationDropdown } from '../utils/notification-dropdown.js';

// State
let currentUser = null;

// DOM Elements
let profileAvatar, profileName, profileEmail, profilePhone;
let roleBadge, totalReviewed, accountStatus;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    currentUser = await requireAdmin();
    if (!currentUser) return;
    
    // مسح الكاش القديم أولاً - Real-time
    const { clearCacheOnPageLoad } = await import('../utils/admin-cache-clear.js');
    await clearCacheOnPageLoad();
    
    // مسح كاش الإشعارات بشكل إضافي
    try {
        const cacheKeys = [
            'notification_preferences',
            'notifications',
            'notifications_unread',
            'notifications_last_fetch',
            'notification_cache'
        ];
        
        cacheKeys.forEach(key => {
            try {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            } catch (e) {
                // Ignore individual cache errors
            }
        });
        
        console.log('✅ Cleared notification cache on page load');
    } catch (cacheError) {
        console.warn('Could not clear notification cache:', cacheError);
    }
    
    initElements();
    initEventListeners();
    await loadProfileData();
    await initNotificationDropdown();
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
    roleBadge = document.getElementById('role-badge');
    totalReviewed = document.getElementById('total-reviewed');
    accountStatus = document.getElementById('account-status');
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
    document.getElementById('personal-info-form')?.addEventListener('submit', handlePersonalInfoUpdate);
    document.getElementById('contact-info-form')?.addEventListener('submit', handleContactInfoUpdate);
    document.getElementById('notification-settings-form')?.addEventListener('submit', handleNotificationSettings);
    document.getElementById('change-password-form')?.addEventListener('submit', handlePasswordChange);
    
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
    
    // Verify account
    document.getElementById('verify-account-btn')?.addEventListener('click', handleVerifyAccount);
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

        // Load notification preferences
        await loadNotificationPreferences();
        
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
    updateAvatarDisplay();
    
    // Info
    profileName.textContent = currentUser.username;
    profileEmail.textContent = currentUser.email;
    profilePhone.textContent = currentUser.phone || 'غير محدد';
      
      // تحديث بريد المستخدم في الشريط العلوي ليظهر البريد الحقيقي بدلاً من النص الافتراضي
      const topbarUserEmail = document.getElementById('user-email');
      if (topbarUserEmail) {
          topbarUserEmail.textContent = currentUser.email || topbarUserEmail.textContent;
      }
    
    // Role
    const roleLabel = currentUser.role === 'super_admin' ? 'مسؤول رئيسي' : 'مسؤول';
    roleBadge.textContent = roleLabel;
    document.getElementById('user-role').textContent = roleLabel;
    
    // Email verified badge
    const verifiedBadge = document.getElementById('email-verified-badge');
    if (currentUser.email_verified) {
        verifiedBadge.textContent = 'موثّق';
        verifiedBadge.className = 'badge badge-success';
    } else {
        verifiedBadge.textContent = 'غير موثّق';
        verifiedBadge.className = 'badge badge-warning';
    }
    
    // Verify account button state
    const verifyBtn = document.getElementById('verify-account-btn');
    if (verifyBtn) {
        if (currentUser.email_verified) {
            verifyBtn.disabled = true;
            verifyBtn.classList.add('btn-disabled');
            verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> الحساب موثّق بالفعل';
        } else {
            verifyBtn.disabled = false;
            verifyBtn.classList.remove('btn-disabled');
            verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> توثيق الحساب';
        }
    }
    
    // Account status
    accountStatus.textContent = 'نشط';
    
    // Dates
    document.getElementById('created-at').textContent = formatDate(currentUser.created_at);
    document.getElementById('updated-at').textContent = formatDate(currentUser.updated_at);
}

/**
 * Update avatar display
 */
function updateAvatarDisplay() {
    if (currentUser.profile_picture) {
        // Show image
        profileAvatar.innerHTML = `<img src="${currentUser.profile_picture}" alt="الصورة الشخصية" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
            <label class="avatar-upload-btn" for="avatar-upload" title="تغيير الصورة">
                <i class="fas fa-camera"></i>
                <input type="file" id="avatar-upload" accept="image/*" style="display: none;">
            </label>`;
    } else {
        // Show initials
        const initials = getInitials(currentUser.username);
        profileAvatar.innerHTML = `${initials}
            <label class="avatar-upload-btn" for="avatar-upload" title="تغيير الصورة">
                <i class="fas fa-camera"></i>
                <input type="file" id="avatar-upload" accept="image/*" style="display: none;">
            </label>`;
    }
    
    // Re-attach event listener
    document.getElementById('avatar-upload')?.addEventListener('change', handleAvatarUpload);
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
        // Count reviewed submissions (approved, rejected, needs_revision)
        const { data, error } = await supabase
            .from('submissions')
            .select('status')
            .in('status', ['approved', 'rejected', 'needs_revision']);
        
        if (error) throw error;
        
        const reviewed = data.length;
        totalReviewed.textContent = reviewed;
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

/**
 * Load notification preferences and update checkboxes
 */
async function loadNotificationPreferences() {
    try {
        // Clear any cached preferences first to ensure fresh data
        try {
            const cacheKeys = [
                'notification_preferences',
                'notifications',
                'notifications_unread',
                'notifications_last_fetch',
                'notification_cache'
            ];
            
            cacheKeys.forEach(key => {
                try {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                } catch (e) {
                    // Ignore individual cache errors
                }
            });
        } catch (cacheError) {
            // Ignore cache errors
        }
        
        let { data, error } = await supabase
            .from('notification_preferences')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();

        // If there's a real error (not just "no rows"), log it but don't break the page
        if (error) {
            console.error('Error loading notification preferences:', error);
            return;
        }

        // If preferences don't exist, create default ones
        if (!data) {
            console.log('No notification preferences found, creating default preferences for admin...');
            try {
                const { data: newPrefs, error: createError } = await supabase
                    .from('notification_preferences')
                    .insert({
                        user_id: currentUser.id,
                        email_enabled: true,
                        in_app_enabled: true,
                        status_change_email: true,
                        comments_email: true,
                        reminders_email: true,
                        news_email: true
                    })
                    .select()
                    .single();
                
                if (createError) {
                    console.error('Error creating default preferences:', createError);
                    // Continue with default values (data will remain null)
                } else {
                    console.log('✅ Created default notification preferences for admin');
                    // Use the newly created preferences
                    data = newPrefs;
                }
            } catch (createErr) {
                console.error('Exception creating default preferences:', createErr);
            }
        }

        // Update checkboxes based on saved preferences
        // Default to true if preferences don't exist
        const emailEnabled = data?.email_enabled ?? true;
        const statusChangeEmail = data?.status_change_email ?? true;
        const commentsEmail = data?.comments_email ?? true;

        const emailNotifications = document.getElementById('email-notifications');
        const statusNotifications = document.getElementById('status-notifications');
        const commentNotifications = document.getElementById('comment-notifications');

        if (emailNotifications) {
            emailNotifications.checked = emailEnabled;
        }
        if (statusNotifications) {
            statusNotifications.checked = statusChangeEmail;
        }
        if (commentNotifications) {
            commentNotifications.checked = commentsEmail;
        }
        
        console.log('✅ Notification preferences loaded:', {
            email_enabled: emailEnabled,
            status_change_email: statusChangeEmail,
            comments_email: commentsEmail,
            created: !data ? 'new' : 'existing'
        });
    } catch (error) {
        console.error('Error loading notification preferences:', error);
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
        
        // Check if preferences exist first, then update or insert
        const { data: existingPrefs } = await supabase
            .from('notification_preferences')
            .select('id')
            .eq('user_id', currentUser.id)
            .maybeSingle();
        
        let data, error;
        
        if (existingPrefs) {
            // Update existing preferences
            const result = await supabase
                .from('notification_preferences')
                .update({ 
                    ...settings,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', currentUser.id)
                .select()
                .single();
            data = result.data;
            error = result.error;
        } else {
            // Insert new preferences
            const result = await supabase
                .from('notification_preferences')
                .insert({ 
                    user_id: currentUser.id,
                    ...settings,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();
            data = result.data;
            error = result.error;
        }
        
        if (error) throw error;
        
        // Clear notification preferences cache to force reload from database
        try {
            // Clear all possible cache keys related to notifications
            const cacheKeys = [
                'notification_preferences',
                'notifications',
                'notifications_unread',
                'notifications_last_fetch',
                'notification_cache'
            ];
            
            cacheKeys.forEach(key => {
                try {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                } catch (e) {
                    // Ignore individual cache errors
                }
            });
            
            console.log('✅ Cleared notification preferences cache');
        } catch (cacheError) {
            console.warn('Could not clear cache:', cacheError);
        }
        
        // Reload preferences to ensure UI is in sync
        await loadNotificationPreferences();
        
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
 * Check if avatars bucket exists
 */
async function checkBucketExists() {
    try {
        // Try to access the bucket directly by attempting to list files
        // This is more reliable than listBuckets() which may require admin permissions
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKETS.AVATARS)
            .list('', {
                limit: 1,
                offset: 0
            });
        
        // If we can list (even if empty), bucket exists
        // Error means bucket doesn't exist or no access
        if (error) {
            // Check if it's specifically a "Bucket not found" error
            if (error.message && error.message.includes('Bucket not found')) {
                return false;
            }
            // Other errors might be permission issues, but bucket might exist
            // Return true to allow upload attempt (will fail with clearer error if bucket doesn't exist)
            return true;
        }
        
        return true;
    } catch (error) {
        console.warn('Could not check bucket existence:', error);
        // On error, assume bucket exists and let upload attempt fail with clearer message
        return true;
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
            showAlert('error', 'الرجاء اختيار صورة صحيحة');
            return;
        }
        
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showAlert('error', 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
            return;
        }
        
        // Check if bucket exists
        const bucketExists = await checkBucketExists();
        if (!bucketExists) {
            showAlert('error', `
                <div style="line-height: 1.6;">
                    <strong>⚠️ مجلد التخزين غير موجود</strong><br><br>
                    <strong>الحل السريع:</strong><br>
                    <ol style="margin: 10px 0; padding-right: 20px; text-align: right;">
                        <li>اذهب إلى <strong>Supabase Dashboard</strong></li>
                        <li>انتقل إلى <strong>SQL Editor</strong></li>
                        <li>افتح ملف <code>database/setup_avatars_bucket.sql</code></li>
                        <li>انسخ الكود والصقه في SQL Editor</li>
                        <li>اضغط <strong>Run</strong></li>
                    </ol>
                    <br>
                    <strong>أو يدوياً:</strong><br>
                    <ol style="margin: 10px 0; padding-right: 20px; text-align: right;">
                        <li>اذهب إلى <strong>Storage</strong> في Supabase Dashboard</li>
                        <li>انقر <strong>"New bucket"</strong></li>
                        <li>الاسم: <code>avatars</code></li>
                        <li>فعّل <strong>"Public bucket"</strong></li>
                        <li>احفظ</li>
                    </ol>
                    <br>
                    <small>📖 راجع ملف <code>docs/AVATAR_SETUP.md</code> للتفاصيل الكاملة</small>
                </div>
            `);
            return;
        }
        
        // Show loading
        profileAvatar.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i>';
        
        // Get file extension
        const fileExt = file.name.split('.').pop();
        const fileName = `avatar_${Date.now()}.${fileExt}`;
        const filePath = `${currentUser.id}/${fileName}`;
        
        // Delete old avatar if exists
        if (currentUser.profile_picture) {
            try {
                // Extract path from public URL
                // URL format: https://[project].supabase.co/storage/v1/object/public/avatars/[user_id]/[filename]
                const urlParts = currentUser.profile_picture.split('/');
                const publicIndex = urlParts.findIndex(part => part === 'public');
                if (publicIndex !== -1 && urlParts.length > publicIndex + 2) {
                    const oldPath = urlParts.slice(publicIndex + 2).join('/');
                    await supabase.storage
                        .from(STORAGE_BUCKETS.AVATARS)
                        .remove([oldPath]);
                }
            } catch (err) {
                console.warn('Could not delete old avatar:', err);
            }
        }
        
        // Upload new avatar
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKETS.AVATARS)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });
        
        if (uploadError) throw uploadError;
        
        // Get public URL - construct it manually since getPublicUrl may not work as expected
        // For public buckets, the URL format is: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
        const supabaseUrl = 'https://rzenhmmwocctvonwhnrj.supabase.co';
        const finalUrl = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKETS.AVATARS}/${filePath}`;
        
        // Update user record
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ 
                profile_picture: finalUrl,
                updated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id)
            .select()
            .single();
        
        if (updateError) throw updateError;
        
        // Update current user
        currentUser = updatedUser;
        
        // Update display
        updateAvatarDisplay();
        
        showAlert('success', 'تم رفع الصورة الشخصية بنجاح ✓');
        
    } catch (error) {
        console.error('Error uploading avatar:', error);
        
        // Check if bucket doesn't exist
        if (error.message && error.message.includes('Bucket not found')) {
            showAlert('error', `
                <div style="line-height: 1.6;">
                    <strong>⚠️ مجلد التخزين غير موجود</strong><br><br>
                    <strong>الحل السريع:</strong><br>
                    <ol style="margin: 10px 0; padding-right: 20px; text-align: right;">
                        <li>اذهب إلى <strong>Supabase Dashboard</strong></li>
                        <li>انتقل إلى <strong>SQL Editor</strong></li>
                        <li>افتح ملف <code>database/setup_avatars_bucket.sql</code></li>
                        <li>انسخ الكود والصقه في SQL Editor</li>
                        <li>اضغط <strong>Run</strong></li>
                    </ol>
                    <br>
                    <strong>أو يدوياً:</strong><br>
                    <ol style="margin: 10px 0; padding-right: 20px; text-align: right;">
                        <li>اذهب إلى <strong>Storage</strong> في Supabase Dashboard</li>
                        <li>انقر <strong>"New bucket"</strong></li>
                        <li>الاسم: <code>avatars</code></li>
                        <li>فعّل <strong>"Public bucket"</strong></li>
                        <li>احفظ</li>
                    </ol>
                    <br>
                    <small>📖 راجع ملف <code>docs/AVATAR_SETUP.md</code> للتفاصيل الكاملة</small>
                </div>
            `);
        } else {
            showAlert('error', 'حدث خطأ في رفع الصورة: ' + error.message);
        }
        updateAvatarDisplay();
    }
}

/**
 * Handle delete account
 */
async function handleDeleteAccount() {
    if (!confirm('هل أنت متأكد من حذف حسابك؟\n\nهذا الإجراء نهائي ولا يمكن التراجع عنه!\n\nسيتم حذف جميع بياناتك.')) {
        return;
    }
    
    if (!confirm('تأكيد نهائي: هل أنت متأكد 100% من حذف حسابك؟')) {
        return;
    }
    
    try {
        // Delete user account
        // This should be handled by backend with proper cascade deletes
        alert('سيتم تنفيذ هذه الميزة قريباً');
        
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('حدث خطأ في حذف الحساب');
    }
}

/**
 * Handle account verification
 */
async function handleVerifyAccount() {
    try {
        if (currentUser.email_verified) {
            showAlert('success', 'الحساب موثّق بالفعل ✓');
            return;
        }

        const verifyBtn = document.getElementById('verify-account-btn');
        if (verifyBtn) {
            verifyBtn.disabled = true;
            const originalHTML = verifyBtn.innerHTML;
            verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التوثيق...';

            const { data, error } = await supabase
                .from('users')
                .update({
                    email_verified: true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', currentUser.id)
                .select()
                .single();

            if (error) throw error;

            currentUser = data;
            populateProfileHeader();
            showAlert('success', 'تم توثيق الحساب بنجاح ✓');

            verifyBtn.innerHTML = originalHTML;
        }
    } catch (error) {
        console.error('Error verifying account:', error);
        showAlert('error', 'حدث خطأ أثناء توثيق الحساب: ' + error.message);

        const verifyBtn = document.getElementById('verify-account-btn');
        if (verifyBtn) {
            verifyBtn.disabled = false;
            verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> توثيق الحساب';
        }
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
    
    // Check if message contains HTML
    if (message.includes('<')) {
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <div style="flex: 1;">${message}</div>
        `;
    } else {
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
    }
    
    // Insert at the top of active tab content
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        activeTab.insertBefore(alert, activeTab.firstChild);
        
        // Auto remove after 10 seconds for error messages with instructions
        const timeout = message.includes('<') ? 15000 : 5000;
        setTimeout(() => {
            alert.remove();
        }, timeout);
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

