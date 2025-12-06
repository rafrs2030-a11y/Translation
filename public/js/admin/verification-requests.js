/**
 * Verification Requests Management JavaScript
 * إدارة طلبات توثيق الحسابات للمسؤول
 */

import authStore from '../stores/authStore.js';
import { handleLogout } from '../utils/logout.js';
import { supabase } from '../config/supabase.js';
import { requireAdmin } from '../utils/auth-guard.js';
import { getInitials } from '../utils/avatar-helper.js';

// State
let allRequests = [];
let filteredRequests = [];
let currentEditUser = null;

// DOM Elements
let loadingState, errorState, tableContainer, emptyState;
let requestsTableBody;
let searchInput, statusFilter, dateFilter;
let pendingCountEl, verifiedCountEl, totalResearchersEl;
let editUserModal, editUserForm;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAdmin();
    if (!user) return;
    
    // مسح الكاش القديم أولاً - Real-time
    const { clearCacheOnPageLoad } = await import('../utils/admin-cache-clear.js');
    await clearCacheOnPageLoad();
    
    initElements();
    initEventListeners();
    await loadVerificationRequests();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    // States
    loadingState = document.getElementById('loading-state');
    errorState = document.getElementById('error-state');
    tableContainer = document.getElementById('table-container');
    emptyState = document.getElementById('empty-state');
    
    // Table
    requestsTableBody = document.getElementById('verification-requests-table-body');
    
    // Filters
    searchInput = document.getElementById('search-input');
    statusFilter = document.getElementById('status-filter');
    dateFilter = document.getElementById('date-filter');
    
    // Stats
    pendingCountEl = document.getElementById('pending-count');
    verifiedCountEl = document.getElementById('verified-count');
    totalResearchersEl = document.getElementById('total-researchers');
    
    // Modals
    editUserModal = document.getElementById('edit-user-modal');
    editUserForm = document.getElementById('edit-user-form');
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
        mobileMenuBtn.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.toggle('active');
        });
    }
    
    // Filters
    searchInput?.addEventListener('input', debounce(handleFilterChange, 500));
    statusFilter?.addEventListener('change', handleFilterChange);
    dateFilter?.addEventListener('change', handleFilterChange);
    
    // Edit user
    document.getElementById('close-edit-modal')?.addEventListener('click', closeEditUserModal);
    document.getElementById('cancel-edit-btn')?.addEventListener('click', closeEditUserModal);
    editUserForm?.addEventListener('submit', handleEditUser);
    
    // Close modals on outside click
    editUserModal?.addEventListener('click', (e) => {
        if (e.target === editUserModal) closeEditUserModal();
    });
}

/**
 * Load verification requests
 */
async function loadVerificationRequests() {
    try {
        showLoading(true);
        console.log('🔄 بدء جلب طلبات التوثيق...');
        
        // مسح الكاش القديم قبل جلب البيانات الجديدة
        try {
            const cacheKeys = [
                'verification_requests',
                'users_cache',
                'admin_users_cache',
                'verification_requests_cache'
            ];
            
            cacheKeys.forEach(key => {
                try {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                } catch (e) {
                    // Ignore cache errors
                }
            });
        } catch (cacheError) {
            console.warn('⚠️ خطأ في مسح الكاش قبل الجلب:', cacheError);
        }
        
        // Fetch all researchers with better error handling
        const { data, error, count } = await supabase
            .from('users')
            .select('*', { count: 'exact' })
            .eq('role', 'researcher')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('❌ خطأ في جلب البيانات:', error);
            throw error;
        }
        
        console.log(`✅ تم جلب ${data?.length || 0} باحث من قاعدة البيانات`);
        
        // معالجة البيانات والتأكد من أن email_verified ليس null
        // email_verified يمكن أن يكون: true, false, null, 1, 0
        allRequests = (data || []).map(user => {
            // معالجة email_verified: إذا كان null أو undefined، اعتباره false
            let emailVerified = false;
            if (user.email_verified === true || user.email_verified === 1 || user.email_verified === 'true') {
                emailVerified = true;
            } else if (user.email_verified === false || user.email_verified === 0 || user.email_verified === 'false') {
                emailVerified = false;
            } else {
                // null أو undefined = false
                emailVerified = false;
            }
            
            return {
                ...user,
                email_verified: emailVerified,
                email: user.email || '',
                username: user.username || 'غير محدد',
                phone: user.phone || null,
                national_id: user.national_id || null,
                created_at: user.created_at || new Date().toISOString()
            };
        });
        
        filteredRequests = [...allRequests];
        
        console.log(`📊 عدد الطلبات: ${allRequests.length}`);
        console.log(`✅ موثّق: ${allRequests.filter(u => u.email_verified).length}`);
        console.log(`⏳ غير موثّق: ${allRequests.filter(u => !u.email_verified).length}`);
        
        // Update stats
        updateStats();
        
        // Render requests
        renderRequests();
        
        showLoading(false);
        
        // التأكد من إظهار الجدول إذا كانت هناك بيانات
        if (allRequests.length > 0) {
            if (tableContainer) tableContainer.style.display = 'block';
            if (emptyState) emptyState.style.display = 'none';
        } else {
            if (tableContainer) tableContainer.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
        }
        
    } catch (error) {
        console.error('❌ خطأ في تحميل طلبات التوثيق:', error);
        showLoading(false);
        showError('فشل في تحميل طلبات التوثيق: ' + (error.message || 'خطأ غير معروف. يرجى التحقق من اتصالك بالإنترنت أو الاتصال بالدعم الفني.'));
    }
}

/**
 * Update stats
 */
function updateStats() {
    const total = allRequests.length;
    // التأكد من معالجة القيم null/undefined بشكل صحيح
    const verified = allRequests.filter(u => {
        return u.email_verified === true || u.email_verified === 1 || u.email_verified === 'true';
    }).length;
    const pending = total - verified;
    
    console.log(`📈 الإحصائيات - الإجمالي: ${total}, موثّق: ${verified}, معلق: ${pending}`);
    
    if (totalResearchersEl) {
        totalResearchersEl.textContent = total;
        totalResearchersEl.style.opacity = '1';
    }
    if (verifiedCountEl) {
        verifiedCountEl.textContent = verified;
        verifiedCountEl.style.opacity = '1';
    }
    if (pendingCountEl) {
        pendingCountEl.textContent = pending;
        pendingCountEl.style.opacity = '1';
    }
}

/**
 * Render requests
 */
function renderRequests() {
    if (!requestsTableBody) {
        console.error('Table body element not found!');
        return;
    }
    
    if (filteredRequests.length === 0) {
        if (tableContainer) tableContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (tableContainer) tableContainer.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    
    const getInitialsFn = getInitials;
    
    // Escape HTML to prevent XSS
    const escapeHtml = (text) => {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    
    console.log(`🎨 بدء عرض ${filteredRequests.length} طلب في الجدول...`);
    
    if (filteredRequests.length === 0) {
        console.warn('⚠️ لا توجد طلبات للعرض');
        if (tableContainer) tableContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    requestsTableBody.innerHTML = filteredRequests.map((user, index) => {
        try {
            const username = escapeHtml(user.username || 'غير محدد');
            const email = escapeHtml(user.email || '-');
            const phone = user.phone ? escapeHtml(String(user.phone)) : null;
            const nationalId = user.national_id ? escapeHtml(String(user.national_id)) : null;
            const createdDate = formatDate(user.created_at);
            // معالجة حالة email_verified بشكل صحيح (قد يكون null, false, true, أو 0/1)
            const isVerified = user.email_verified === true || user.email_verified === 1 || user.email_verified === 'true';
            const initials = getInitialsFn(user.username || 'غير محدد');
            const userId = user.id || '';
            
            if (!userId) {
                console.warn(`⚠️ طلب بدون ID في الفهرس ${index}:`, user);
            }
            
            return `
        <tr data-user-id="${userId}">
            <td>
                <div class="user-info">
                    <div class="user-avatar-table">
                        ${user.profile_picture 
                            ? `<img src="${escapeHtml(user.profile_picture)}" alt="الصورة الشخصية" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                               <div style="display: none; width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; align-items: center; justify-content: center; font-weight: 700; font-size: 1.125rem;">
                                   ${escapeHtml(initials)}
                               </div>`
                            : `<div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.125rem;">
                                   ${escapeHtml(initials)}
                               </div>`
                        }
                    </div>
                    <div class="user-details">
                        <h4>${username}</h4>
                    </div>
                </div>
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-envelope" style="color: var(--text-secondary); font-size: 0.875rem;"></i>
                    <span>${email}</span>
                </div>
            </td>
            <td>
                ${phone ? `<div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-phone" style="color: var(--text-secondary); font-size: 0.875rem;"></i>
                    <span>${phone}</span>
                </div>` : '<span style="color: var(--text-light);">-</span>'}
            </td>
            <td>
                ${nationalId ? `<span style="font-family: monospace; direction: ltr; display: inline-block;">${nationalId}</span>` : '<span style="color: var(--text-light);">-</span>'}
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary);">
                    <i class="fas fa-calendar-alt" style="font-size: 0.875rem;"></i>
                    <span>${createdDate}</span>
                </div>
            </td>
            <td>
                <span class="badge badge-${isVerified ? 'success' : 'warning'}">
                    ${isVerified ? '<i class="fas fa-check-circle"></i> موثّق' : '<i class="fas fa-clock"></i> غير موثّق'}
                </span>
            </td>
            <td>
                <div class="user-actions">
                    <button 
                        class="icon-btn-sm edit" 
                        onclick="openEditUser('${userId}')"
                        title="تعديل حالة التوثيق"
                    >
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
        `;
        } catch (err) {
            console.error(`❌ خطأ في عرض الطلب في الفهرس ${index}:`, err, user);
            return '';
        }
    }).filter(html => html.trim().length > 0).join('');
    
    console.log(`✅ تم عرض ${filteredRequests.length} طلب بنجاح في الجدول`);
}

/**
 * Handle filter change
 */
function handleFilterChange() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const dateValue = dateFilter.value;
    
    filteredRequests = allRequests.filter(user => {
        // Search
        const matchSearch = !searchTerm || 
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            (user.phone && user.phone.includes(searchTerm));
        
        // Status - معالجة أفضل للحالات المختلفة
        let matchStatus = true;
        if (statusValue === 'verified') {
            matchStatus = user.email_verified === true || user.email_verified === 1 || user.email_verified === 'true';
        } else if (statusValue === 'unverified') {
            matchStatus = !(user.email_verified === true || user.email_verified === 1 || user.email_verified === 'true');
        }
        
        // Date filter
        let matchDate = true;
        if (dateValue) {
            const userDate = new Date(user.created_at);
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            if (dateValue === 'today') {
                matchDate = userDate >= today;
            } else if (dateValue === 'week') {
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                matchDate = userDate >= weekAgo;
            } else if (dateValue === 'month') {
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                matchDate = userDate >= monthAgo;
            }
        }
        
        return matchSearch && matchStatus && matchDate;
    });
    
    renderRequests();
}

/**
 * Open edit user modal
 */
window.openEditUser = async function(userId) {
    const user = allRequests.find(u => u.id === userId);
    if (!user) return;
    
    currentEditUser = user;
    
    // مسح الكاش القديم قبل فتح النافذة لضمان البيانات المحدثة
    try {
        const cacheKeys = [
            `user_${userId}`,
            `user_${userId}_cache`,
            'verification_requests',
            'users_cache'
        ];
        
        cacheKeys.forEach(key => {
            try {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            } catch (e) {
                // Ignore cache errors
            }
        });
    } catch (cacheError) {
        console.warn('⚠️ خطأ في مسح الكاش:', cacheError);
    }
    
    // Populate form
    const emailVerified = user.email_verified === true || user.email_verified === 1 || user.email_verified === 'true';
    
    document.getElementById('edit-user-id').value = user.id || '';
    document.getElementById('edit-username').value = user.username || '';
    document.getElementById('edit-email').value = user.email || '';
    document.getElementById('edit-phone').value = user.phone || '';
    document.getElementById('edit-national-id').value = user.national_id || '';
    document.getElementById('edit-email-verified').checked = emailVerified;
    
    console.log(`📋 فتح نافذة التعديل للمستخدم: ${user.username}, حالة التوثيق الحالية: ${emailVerified}`);
    
    // Show modal
    editUserModal.classList.add('active');
}

/**
 * Close edit user modal
 */
function closeEditUserModal() {
    editUserModal.classList.remove('active');
    currentEditUser = null;
}

/**
 * Handle edit user
 */
async function handleEditUser(e) {
    e.preventDefault();
    
    try {
        const userId = document.getElementById('edit-user-id').value;
        const emailVerified = document.getElementById('edit-email-verified').checked;
        const username = document.getElementById('edit-username').value.trim();
        const phone = document.getElementById('edit-phone').value.trim();
        const nationalId = document.getElementById('edit-national-id').value.trim();
        
        if (!userId) {
            throw new Error('معرف المستخدم غير موجود');
        }
        
        // Validate required fields
        if (!username) {
            showError('اسم المستخدم مطلوب');
            return;
        }
        
        console.log(`🔄 بدء تحديث بيانات المستخدم: ${userId}`);
        console.log('📝 البيانات الجديدة:', {
            email_verified: emailVerified,
            username,
            phone,
            national_id: nationalId
        });
        
        // Show loading
        const submitBtn = document.getElementById('submit-edit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري الحفظ...</span>';
        
        // تحديث بيانات المستخدم في قاعدة البيانات
        const emailVerifiedValue = emailVerified === true || emailVerified === 'true' || emailVerified === 1;
        const updateData = { 
            email_verified: emailVerifiedValue,
            username: username,
            phone: phone || null,
            national_id: nationalId || null,
            updated_at: new Date().toISOString()
        };
        
        // Get current user for audit
        const { data: { user: currentAdmin } } = await supabase.auth.getUser();
        
        // Get old values for audit log
        const oldValues = {
            email_verified: currentEditUser?.email_verified || false,
            username: currentEditUser?.username || '',
            phone: currentEditUser?.phone || null,
            national_id: currentEditUser?.national_id || null
        };
        
        // التحقق من أن المستخدم الحالي هو admin
        const { data: { user: currentAdminUser } } = await supabase.auth.getUser();
        if (!currentAdminUser) {
            throw new Error('يجب تسجيل الدخول كمشرف لتعديل بيانات المستخدمين');
        }
        
        // التحقق من role في جدول users
        const { data: adminCheck, error: adminCheckError } = await supabase
            .from('users')
            .select('role')
            .eq('id', currentAdminUser.id)
            .single();
        
        if (adminCheckError || !adminCheck) {
            console.error('❌ خطأ في التحقق من صلاحيات المشرف:', adminCheckError);
            throw new Error('فشل التحقق من صلاحيات المشرف');
        }
        
        if (adminCheck.role !== 'admin' && adminCheck.role !== 'super_admin') {
            throw new Error('ليس لديك صلاحية لتعديل بيانات المستخدمين');
        }
        
        console.log('✅ التحقق من صلاحيات المشرف ناجح:', adminCheck.role);
        
        // استخدام backend API بدلاً من التحديث المباشر
        // هذا يتجاوز RLS باستخدام service role key في backend
        console.log('🔄 محاولة تحديث المستخدم عبر API:', {
            userId,
            updateData,
            adminId: currentAdminUser.id,
            adminRole: adminCheck.role
        });
        
        // الحصول على session token
        const { data: sessionData } = await supabase.auth.getSession();
        const authToken = sessionData?.session?.access_token;
        
        if (!authToken) {
            throw new Error('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول مرة أخرى.');
        }
        
        // تحديث البيانات عبر backend API
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                username,
                phone,
                national_id: nationalId,
                email_verified: emailVerifiedValue
            })
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.success) {
            console.error('❌ خطأ في تحديث المستخدم:', result);
            throw new Error(result.error || 'فشل تحديث بيانات المستخدم');
        }
        
        const updatedUser = result.user;
        console.log('✅ تم تحديث المستخدم بنجاح عبر API:', updatedUser);
        
        // Log audit action
        try {
            const diff = {};
            if (oldValues.email_verified !== emailVerifiedValue) {
                diff.email_verified = { old: oldValues.email_verified, new: emailVerifiedValue };
            }
            if (oldValues.username !== username) {
                diff.username = { old: oldValues.username, new: username };
            }
            if (oldValues.phone !== phone) {
                diff.phone = { old: oldValues.phone, new: phone };
            }
            if (oldValues.national_id !== nationalId) {
                diff.national_id = { old: oldValues.national_id, new: nationalId };
            }
            
            if (Object.keys(diff).length > 0) {
                await supabase
                    .from('audit_log')
                    .insert([{
                        admin_id: currentAdmin?.id,
                        action: 'update_user',
                        entity_type: 'user',
                        entity_id: userId,
                        details: {
                            changes: diff,
                            verification_changed: oldValues.email_verified !== emailVerifiedValue
                        }
                    }]);
            }
        } catch (auditError) {
            console.warn('⚠️ لم يتم تسجيل الإجراء في audit_log:', auditError);
        }
        
        // Clear cache comprehensively to ensure fresh data
        try {
            const { clearPageCache, clearAdminCache } = await import('../utils/admin-cache-clear.js');
            
            // مسح كاش صفحة verification-requests
            await clearPageCache('verification-requests');
            
            // مسح كاش شامل للمستخدمين
            const cacheKeys = [
                'verification_requests',
                'users_cache',
                'admin_users_cache',
                'verification_requests_cache',
                'users_list',
                'researchers_list',
                'all_users',
                'filtered_users'
            ];
            
            cacheKeys.forEach(key => {
                try {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                } catch (e) {
                    // Ignore cache errors
                }
            });
            
            // مسح كاش شامل لصفحات الإدمن (مع الحفاظ على auth tokens)
            await clearAdminCache({ 
                silent: true, 
                clearAll: false, 
                preserveAuth: true 
            });
            
            console.log('✅ تم مسح الكاش القديم بشكل شامل');
        } catch (cacheError) {
            console.warn('⚠️ خطأ في مسح الكاش:', cacheError);
        }
        
        // إعادة جلب البيانات للتأكد من أن كل شيء محدث
        await loadVerificationRequests();
        
        // Close modal
        closeEditUserModal();
        
        // Show success message
        const statusText = emailVerified ? 'موثّق' : 'غير موثّق';
        showSuccess(`تم تحديث بيانات المستخدم بنجاح - حالة التوثيق: ${statusText}`);
        
        // Create notification for user if verified
        if (emailVerified && oldValues.email_verified !== emailVerifiedValue) {
            try {
                const { error: notifError } = await supabase
                    .from('notifications')
                    .insert([{
                        user_id: userId,
                        type: 'system',
                        message: 'تم توثيق حسابك بنجاح. يمكنك الآن استخدام جميع ميزات المنصة.',
                        is_read: false
                    }]);
                
                if (notifError) {
                    console.warn('⚠️ لم يتم إنشاء الإشعار:', notifError);
                } else {
                    console.log('✅ تم إنشاء إشعار للمستخدم بنجاح');
                }
            } catch (notifError) {
                console.error('❌ خطأ في إنشاء الإشعار:', notifError);
                // لا نوقف العملية إذا فشل إنشاء الإشعار
            }
        }
        
    } catch (error) {
        console.error('❌ خطأ في تحديث بيانات المستخدم:', error);
        showError('حدث خطأ أثناء تحديث البيانات: ' + (error.message || 'خطأ غير معروف'));
        
        // Reset button
        const submitBtn = document.getElementById('submit-edit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> <span>حفظ التغييرات</span>';
        }
    }
}

/**
 * Refresh list
 */
window.refreshList = async function() {
    // مسح الكاش قبل التحديث
    try {
        const { clearPageCache } = await import('../utils/admin-cache-clear.js');
        await clearPageCache('verification-requests');
        
        // مسح مفاتيح الكاش الإضافية
        const cacheKeys = [
            'verification_requests',
            'users_cache',
            'admin_users_cache',
            'verification_requests_cache'
        ];
        
        cacheKeys.forEach(key => {
            try {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            } catch (e) {
                // Ignore cache errors
            }
        });
        
        console.log('✅ تم مسح الكاش قبل تحديث القائمة');
    } catch (cacheError) {
        console.warn('⚠️ خطأ في مسح الكاش:', cacheError);
    }
    
    await loadVerificationRequests();
}

/**
 * Debug function - يمكن استخدامها في console للتحقق من البيانات
 */
window.debugVerificationRequests = function() {
    console.log('📊 حالة طلبات التوثيق:');
    console.log('الطلبات الكاملة:', allRequests);
    console.log('الطلبات المفلترة:', filteredRequests);
    console.log('عدد الإجمالي:', allRequests.length);
    console.log('عدد المفلترة:', filteredRequests.length);
    return {
        all: allRequests,
        filtered: filteredRequests,
        stats: {
            total: allRequests.length,
            verified: allRequests.filter(u => u.email_verified).length,
            pending: allRequests.filter(u => !u.email_verified).length
        }
    };
}

/**
 * Show loading state
 */
function showLoading(show) {
    if (show) {
        loadingState.style.display = 'flex';
        errorState.style.display = 'none';
        tableContainer.style.display = 'none';
        emptyState.style.display = 'none';
    } else {
        loadingState.style.display = 'none';
    }
}

/**
 * Show error state
 */
function showError(message) {
    console.error('❌ عرض رسالة الخطأ:', message);
    if (loadingState) loadingState.style.display = 'none';
    if (errorState) {
        errorState.style.display = 'flex';
        const errorMessageEl = document.getElementById('error-message');
        if (errorMessageEl) {
            errorMessageEl.textContent = message || 'حدث خطأ غير معروف';
        }
    }
    if (tableContainer) tableContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'none';
}

/**
 * Show success message
 */
function showSuccess(message) {
    // Remove existing alerts
    document.querySelectorAll('.alert').forEach(alert => alert.remove());
    
    // Create alert
    const alert = document.createElement('div');
    alert.className = 'alert success';
    alert.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Insert at the top of page content
    const pageContent = document.querySelector('.page-content');
    if (pageContent) {
        pageContent.insertBefore(alert, pageContent.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

/**
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

