/**
 * Admin Users Management JavaScript
 * إدارة المستخدمين للمسؤول
 */

import adminStore from '../stores/adminStore.js';
import authStore from '../stores/authStore.js';
import { handleLogout } from '../utils/logout.js';
import { supabase } from '../config/supabase.js';
import { requireAdmin } from '../utils/auth-guard.js';
import { getInitials } from '../utils/avatar-helper.js';

// State
let allUsers = [];
let filteredUsers = [];
let currentEditUser = null;

// DOM Elements
let loadingState, errorState, tableContainer, emptyState;
let usersTableBody;
let searchInput, roleFilter, verifiedFilter;
let totalUsersEl, verifiedUsersEl, adminUsersEl;
let addUserModal, editUserModal;
let addUserForm, editUserForm;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAdmin();
    if (!user) return;
    
    // مسح الكاش القديم أولاً - Real-time
    const { clearCacheOnPageLoad } = await import('../utils/admin-cache-clear.js');
    await clearCacheOnPageLoad();
    
    initElements();
    initEventListeners();
    await loadUsers();
    
    // فحص query parameters وتطبيق الفلتر
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    const userIdParam = urlParams.get('user');
    
    if (filterParam === 'unverified' && verifiedFilter) {
        verifiedFilter.value = 'false';
        handleFilterChange();
        
        // إذا كان هناك user ID محدد، التمرير إليه
        if (userIdParam) {
            setTimeout(() => {
                const userRow = document.querySelector(`[data-user-id="${userIdParam}"]`);
                if (userRow) {
                    userRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    userRow.style.backgroundColor = '#fff3cd';
                    setTimeout(() => {
                        userRow.style.backgroundColor = '';
                    }, 3000);
                }
            }, 500);
        }
    }
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
    usersTableBody = document.getElementById('users-table-body');
    
    // Filters
    searchInput = document.getElementById('search-input');
    roleFilter = document.getElementById('role-filter');
    verifiedFilter = document.getElementById('verified-filter');
    
    // Stats
    totalUsersEl = document.getElementById('total-users');
    verifiedUsersEl = document.getElementById('verified-users');
    adminUsersEl = document.getElementById('admin-users');
    
    // Modals
    addUserModal = document.getElementById('add-user-modal');
    editUserModal = document.getElementById('edit-user-modal');
    addUserForm = document.getElementById('add-user-form');
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
    roleFilter?.addEventListener('change', handleFilterChange);
    verifiedFilter?.addEventListener('change', handleFilterChange);
    
    // Add user
    document.getElementById('add-user-btn')?.addEventListener('click', openAddUserModal);
    document.getElementById('close-add-modal')?.addEventListener('click', closeAddUserModal);
    document.getElementById('cancel-add-btn')?.addEventListener('click', closeAddUserModal);
    addUserForm?.addEventListener('submit', handleAddUser);
    
    // Edit user
    document.getElementById('close-edit-modal')?.addEventListener('click', closeEditUserModal);
    document.getElementById('cancel-edit-btn')?.addEventListener('click', closeEditUserModal);
    editUserForm?.addEventListener('submit', handleEditUser);
    
    // Close modals on outside click
    addUserModal?.addEventListener('click', (e) => {
        if (e.target === addUserModal) closeAddUserModal();
    });
    editUserModal?.addEventListener('click', (e) => {
        if (e.target === editUserModal) closeEditUserModal();
    });
}

/**
 * Load users
 */
async function loadUsers() {
    try {
        showLoading(true);
        
        // Fetch users from Supabase
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        allUsers = data || [];
        filteredUsers = [...allUsers];
        
        // Update stats
        updateStats();
        
        // Render users
        renderUsers();
        
        showLoading(false);
        tableContainer.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading users:', error);
        showError('فشل في تحميل المستخدمين: ' + error.message);
    }
}

/**
 * Update stats
 */
function updateStats() {
    const total = allUsers.length;
    const verified = allUsers.filter(u => u.email_verified).length;
    const admins = allUsers.filter(u => u.role === 'admin' || u.role === 'super_admin').length;
    
    totalUsersEl.textContent = total;
    verifiedUsersEl.textContent = verified;
    adminUsersEl.textContent = admins;
}

/**
 * Render users
 */
function renderUsers() {
    if (filteredUsers.length === 0) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    tableContainer.style.display = 'block';
    emptyState.style.display = 'none';
    
    // Store getInitials in local scope for template string
    const getInitialsFn = getInitials;
    
    usersTableBody.innerHTML = filteredUsers.map(user => `
        <tr>
            <td>
                <div class="user-info">
                    <div class="user-avatar-table">
                        ${user.profile_picture 
                            ? `<img src="${user.profile_picture}" alt="الصورة الشخصية" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                               <div style="display: none; width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem;">
                                   ${getInitialsFn(user.username)}
                               </div>`
                            : `<div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem;">
                                   ${getInitialsFn(user.username)}
                               </div>`
                        }
                    </div>
                    <div class="user-details">
                        <h4>${user.username}</h4>
                        <div class="user-email">${user.email}</div>
                    </div>
                </div>
            </td>
            <td>${user.phone}</td>
            <td>
                <select 
                    class="role-select" 
                    data-user-id="${user.id}" 
                    onchange="window.handleRoleChange('${user.id}', this.value)"
                >
                    <option value="researcher" ${user.role === 'researcher' ? 'selected' : ''}>باحث</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>مسؤول</option>
                    <option value="super_admin" ${user.role === 'super_admin' ? 'selected' : ''}>مسؤول أعلى</option>
                </select>
            </td>
            <td>
                <span class="badge badge-${user.email_verified ? 'success' : 'warning'}">
                    ${user.email_verified ? 'موثّق' : 'غير موثّق'}
                </span>
            </td>
            <td>${formatDate(user.created_at)}</td>
            <td>
                <div class="user-actions">
                    <button 
                        class="icon-btn-sm edit" 
                        onclick="window.openEditUser('${user.id}')"
                        title="تعديل"
                    >
                        <i class="fas fa-edit"></i>
                    </button>
                    <button 
                        class="icon-btn-sm delete" 
                        onclick="window.deleteUser('${user.id}')"
                        title="حذف"
                    >
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Handle filter change
 */
function handleFilterChange() {
    const searchTerm = searchInput.value.toLowerCase();
    const roleValue = roleFilter.value;
    const verifiedValue = verifiedFilter.value;
    
    filteredUsers = allUsers.filter(user => {
        // Search
        const matchSearch = !searchTerm || 
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.phone.includes(searchTerm);
        
        // Role
        const matchRole = !roleValue || user.role === roleValue;
        
        // Verified
        const matchVerified = !verifiedValue || 
            user.email_verified.toString() === verifiedValue;
        
        return matchSearch && matchRole && matchVerified;
    });
    
    renderUsers();
}

/**
 * Open add user modal
 */
function openAddUserModal() {
    addUserForm.reset();
    addUserModal.classList.add('active');
}

/**
 * Close add user modal
 */
function closeAddUserModal() {
    addUserModal.classList.remove('active');
}

/**
 * Handle add user
 */
async function handleAddUser(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            national_id: formData.get('national_id'),
            phone: formData.get('phone'),
            role: formData.get('role')
        };
        
        // Show loading
        const submitBtn = document.getElementById('submit-add-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري الإضافة...</span>';
        
        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    username: userData.username,
                    role: userData.role
                }
            }
        });
        
        if (authError) throw authError;
        
        // Create user in public.users table (if using custom table)
        // This might be handled automatically by your database triggers
        
        // Show success
        alert('تم إضافة المستخدم بنجاح ✓');
        
        // Close modal
        closeAddUserModal();
        
        // Reload users
        await loadUsers();
        
    } catch (error) {
        console.error('Error adding user:', error);
        alert('حدث خطأ: ' + error.message);
        
        // Reset button
        const submitBtn = document.getElementById('submit-add-btn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> <span>إضافة</span>';
    }
}

/**
 * Open edit user modal
 */
async function openEditUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    currentEditUser = user;
    
    // Populate form
    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-username').value = user.username;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-national-id').value = user.national_id;
    document.getElementById('edit-phone').value = user.phone;
    document.getElementById('edit-role').value = user.role;
    document.getElementById('edit-email-verified').checked = user.email_verified;
    
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
        const formData = new FormData(e.target);
        
        const updateData = {
            username: formData.get('username'),
            email: formData.get('email'),
            national_id: formData.get('national_id'),
            phone: formData.get('phone'),
            role: formData.get('role'),
            email_verified: document.getElementById('edit-email-verified').checked,
            updated_at: new Date().toISOString()
        };
        
        // Show loading
        const submitBtn = document.getElementById('submit-edit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري الحفظ...</span>';
        
        // Update user بدون طلب صف واحد (لتجنب 406 / Cannot coerce the result to a single JSON object)
        const { error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId);
        
        if (error) throw error;
        
        // Show success
        alert('تم تحديث المستخدم بنجاح ✓');
        
        // Close modal
        closeEditUserModal();
        
        // Reload users
        await loadUsers();
        
    } catch (error) {
        console.error('Error updating user:', error);
        alert('حدث خطأ: ' + error.message);
        
        // Reset button
        const submitBtn = document.getElementById('submit-edit-btn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> <span>حفظ التغييرات</span>';
    }
}

/**
 * Handle role change
 */
async function handleRoleChange(userId, newRole) {
    try {
        if (!confirm(`هل أنت متأكد من تغيير الدور إلى: ${getRoleLabel(newRole)}؟`)) {
            // Reset select
            await loadUsers();
            return;
        }
        
        // Update role
        const { data, error } = await supabase
            .from('users')
            .update({ 
                role: newRole,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);
        
        if (error) throw error;
        
        alert('تم تحديث الدور بنجاح ✓');
        
        // Reload users
        await loadUsers();
        
    } catch (error) {
        console.error('Error changing role:', error);
        alert('حدث خطأ: ' + error.message);
        
        // Reload to reset
        await loadUsers();
    }
}

/**
 * Delete user
 */
async function deleteUser(userId) {
    try {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return;
        
        if (!confirm(`هل أنت متأكد من حذف المستخدم: ${user.username}؟\n\nهذا الإجراء لا يمكن التراجع عنه!`)) {
            return;
        }
        
        // Delete user
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);
        
        if (error) throw error;
        
        alert('تم حذف المستخدم بنجاح ✓');
        
        // Reload users
        await loadUsers();
        
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('حدث خطأ: ' + error.message);
    }
}

/**
 * Get role label
 */
function getRoleLabel(role) {
    const labels = {
        'researcher': 'باحث',
        'admin': 'مسؤول',
        'super_admin': 'مسؤول أعلى'
    };
    return labels[role] || role;
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
 * Show loading
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
 * Show error
 */
function showError(message) {
    loadingState.style.display = 'none';
    tableContainer.style.display = 'none';
    emptyState.style.display = 'none';
    errorState.style.display = 'block';
    document.getElementById('error-message').textContent = message;
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

// Export functions to window for inline handlers
window.openEditUser = openEditUser;
window.deleteUser = deleteUser;
window.handleRoleChange = handleRoleChange;

// Export functions if needed
export {
    loadUsers,
    handleAddUser,
    handleEditUser,
    deleteUser
};

