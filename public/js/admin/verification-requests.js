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
        
        // Fetch all researchers
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'researcher')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        allRequests = data || [];
        filteredRequests = [...allRequests];
        
        // Update stats
        updateStats();
        
        // Render requests
        renderRequests();
        
        showLoading(false);
        tableContainer.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading verification requests:', error);
        showError('فشل في تحميل طلبات التوثيق: ' + error.message);
    }
}

/**
 * Update stats
 */
function updateStats() {
    const total = allRequests.length;
    const verified = allRequests.filter(u => u.email_verified).length;
    const pending = total - verified;
    
    if (totalResearchersEl) totalResearchersEl.textContent = total;
    if (verifiedCountEl) verifiedCountEl.textContent = verified;
    if (pendingCountEl) pendingCountEl.textContent = pending;
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
    
    requestsTableBody.innerHTML = filteredRequests.map(user => {
        const username = escapeHtml(user.username || 'غير محدد');
        const email = escapeHtml(user.email || '-');
        const phone = user.phone ? escapeHtml(user.phone) : null;
        const nationalId = user.national_id ? escapeHtml(user.national_id) : null;
        const createdDate = formatDate(user.created_at);
        const isVerified = user.email_verified === true;
        const initials = getInitialsFn(user.username || 'غير محدد');
        const userId = user.id;
        
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
    }).join('');
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
        
        // Status
        let matchStatus = true;
        if (statusValue === 'verified') {
            matchStatus = user.email_verified === true;
        } else if (statusValue === 'unverified') {
            matchStatus = user.email_verified === false;
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
window.openEditUser = function(userId) {
    const user = allRequests.find(u => u.id === userId);
    if (!user) return;
    
    currentEditUser = user;
    
    // Populate form
    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-username').value = user.username;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-phone').value = user.phone || '';
    document.getElementById('edit-national-id').value = user.national_id || '';
    document.getElementById('edit-email-verified').checked = user.email_verified || false;
    
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
        
        // Show loading
        const submitBtn = document.getElementById('submit-edit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري الحفظ...</span>';
        
        // Update user
        const { data, error } = await supabase
            .from('users')
            .update({ 
                email_verified: emailVerified,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();
        
        if (error) throw error;
        
        // Update local state
        const index = allRequests.findIndex(u => u.id === userId);
        if (index !== -1) {
            allRequests[index] = data;
            handleFilterChange();
        }
        
        // Update stats
        updateStats();
        
        // Close modal
        closeEditUserModal();
        
        // Show success message
        showSuccess('تم تحديث حالة التوثيق بنجاح');
        
        // Create notification for user if verified
        if (emailVerified) {
            try {
                await supabase
                    .from('notifications')
                    .insert([{
                        user_id: userId,
                        type: 'system',
                        message: 'تم توثيق حسابك بنجاح. يمكنك الآن استخدام جميع ميزات المنصة.',
                        is_read: false
                    }]);
            } catch (notifError) {
                console.error('Error creating notification:', notifError);
            }
        }
        
    } catch (error) {
        console.error('Error updating user:', error);
        showError('حدث خطأ أثناء تحديث حالة التوثيق: ' + error.message);
        
        // Reset button
        const submitBtn = document.getElementById('submit-edit-btn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> <span>حفظ التغييرات</span>';
    }
}

/**
 * Refresh list
 */
window.refreshList = function() {
    loadVerificationRequests();
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
    loadingState.style.display = 'none';
    errorState.style.display = 'flex';
    document.getElementById('error-message').textContent = message;
    tableContainer.style.display = 'none';
    emptyState.style.display = 'none';
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

