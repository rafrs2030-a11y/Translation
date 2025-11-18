/**
 * Admin Submissions Management JavaScript
 * إدارة الطلبات للمسؤول
 */

import adminStore from '../stores/adminStore.js';
import authStore from '../stores/authStore.js';
import { handleLogout } from '../utils/logout.js';
import { updateAvatarDisplay, getInitials } from '../utils/avatar-helper.js';
import { requireAdmin } from '../utils/auth-guard.js';
import badgeManager from '../utils/badge-manager.js';

// State
let currentPage = 1;
const itemsPerPage = 10;
let currentFilters = {
    status: '',
    category: '',
    search: ''
};
let currentSubmissionId = null;

// DOM Elements
let tableBody, statusFilter, categoryFilter, searchInput;
let prevPageBtn, nextPageBtn, pageInfo, resultsCount;
let actionModal, actionForm, newStatusSelect, adminCommentTextarea;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAdmin();
    if (!user) return;
    
    initElements();
    initEventListeners();
    await loadSubmissions();
    await badgeManager.initialize();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    tableBody = document.getElementById('submissions-table-body');
    statusFilter = document.getElementById('status-filter');
    categoryFilter = document.getElementById('category-filter');
    searchInput = document.getElementById('search-input');
    
    prevPageBtn = document.getElementById('prev-page');
    nextPageBtn = document.getElementById('next-page');
    pageInfo = document.getElementById('page-info');
    resultsCount = document.getElementById('results-count');
    
    actionModal = document.getElementById('action-modal');
    actionForm = document.getElementById('action-form');
    newStatusSelect = document.getElementById('new-status');
    adminCommentTextarea = document.getElementById('admin-comment');
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
    
    // Filters
    statusFilter?.addEventListener('change', handleFilterChange);
    categoryFilter?.addEventListener('change', handleFilterChange);
    searchInput?.addEventListener('input', debounce(handleFilterChange, 500));
    
    // Pagination
    prevPageBtn?.addEventListener('click', () => changePage(currentPage - 1));
    nextPageBtn?.addEventListener('click', () => changePage(currentPage + 1));
    
    // Modal
    document.getElementById('close-modal')?.addEventListener('click', closeModal);
    document.getElementById('cancel-action')?.addEventListener('click', closeModal);
    actionForm?.addEventListener('submit', handleActionSubmit);
    
    // Export
    document.getElementById('export-btn')?.addEventListener('click', handleExport);
}

/**
 * Load submissions with filters and pagination
 */
async function loadSubmissions() {
    try {
        showLoading();
        
        const params = {
            page: currentPage,
            limit: itemsPerPage,
            ...currentFilters
        };
        
        const result = await adminStore.fetchSubmissions(params);
        
        if (!result || !result.data) {
            showError('لم يتم العثور على طلبات');
            return;
        }
        
        renderSubmissions(result.data);
        updatePagination(result.pagination);
        updateResultsCount(result.pagination.total);
        
    } catch (error) {
        console.error('Error loading submissions:', error);
        showError('حدث خطأ أثناء تحميل الطلبات');
    }
}

/**
 * Render submissions table
 */
function renderSubmissions(submissions) {
    if (!submissions || submissions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>لا توجد طلبات</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = submissions.map(submission => {
        const user = submission.user || {};
        const userName = user.username || submission.full_name || 'غير محدد';
        const userAvatar = user.profile_picture || null;
        
        return `
        <tr data-id="${submission.id}">
            <td>
                <strong>${submission.reference_number}</strong>
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; overflow: hidden;">
                        ${userAvatar 
                            ? `<img src="${userAvatar}" alt="الصورة الشخصية" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                               <div style="display: none; width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem;">
                                   ${getInitials(userName)}
                               </div>`
                            : `<div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem;">
                                   ${getInitials(userName)}
                               </div>`
                        }
                    </div>
                    <span>${submission.full_name}</span>
                </div>
            </td>
            <td>${submission.research_type}</td>
            <td>${submission.category}</td>
            <td>${formatDate(submission.created_at)}</td>
            <td>
                <span class="badge badge-${getStatusClass(submission.status)}">
                    ${getStatusLabel(submission.status)}
                </span>
            </td>
            <td>
                <div class="btn-group">
                    <button 
                        class="btn btn-sm btn-primary"
                        onclick="window.viewSubmission('${submission.id}')"
                        title="عرض التفاصيل"
                    >
                        <i class="fas fa-eye"></i>
                    </button>
                    <button 
                        class="btn btn-sm btn-secondary"
                        onclick="window.changeStatus('${submission.id}')"
                        title="تغيير الحالة"
                    >
                        <i class="fas fa-edit"></i>
                    </button>
                    <a 
                        href="${submission.file_url}"
                        class="btn btn-sm btn-ghost"
                        download
                        title="تحميل الملف"
                    >
                        <i class="fas fa-download"></i>
                    </a>
                </div>
            </td>
        </tr>
        `;
    }).join('');
}

/**
 * View submission details
 */
function viewSubmission(id) {
    window.location.href = `/pages/admin/submission-details.html?id=${id}`;
}

// Attach to window for inline onclick handlers
window.viewSubmission = viewSubmission;

/**
 * Change submission status
 */
function changeStatus(id) {
    currentSubmissionId = id;
    openModal();
}

// Attach to window for inline onclick handlers
window.changeStatus = changeStatus;

/**
 * Open action modal
 */
function openModal() {
    actionModal.classList.add('active');
    actionForm.reset();
}

/**
 * Close action modal
 */
function closeModal() {
    actionModal.classList.remove('active');
    currentSubmissionId = null;
}

/**
 * Handle action form submit
 */
async function handleActionSubmit(e) {
    e.preventDefault();
    
    if (!currentSubmissionId) return;
    
    const newStatus = newStatusSelect.value;
    const comment = adminCommentTextarea.value.trim();
    
    if (!newStatus) {
        alert('يرجى اختيار الحالة الجديدة');
        return;
    }
    
    try {
        const result = await adminStore.updateSubmissionStatus(
            currentSubmissionId,
            newStatus,
            comment
        );
        
        if (result.success) {
            showSuccess('تم تحديث حالة الطلب بنجاح');
            closeModal();
            await loadSubmissions();
        } else {
            showError(result.error || 'فشل تحديث حالة الطلب');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showError('حدث خطأ أثناء تحديث الحالة');
    }
}

/**
 * Handle filter change
 */
function handleFilterChange() {
    currentFilters = {
        status: statusFilter.value,
        category: categoryFilter.value,
        search: searchInput.value.trim()
    };
    
    currentPage = 1;
    loadSubmissions();
}

/**
 * Change page
 */
function changePage(page) {
    currentPage = page;
    loadSubmissions();
}

/**
 * Update pagination
 */
function updatePagination(pagination) {
    if (!pagination) return;
    
    const { page, totalPages } = pagination;
    
    prevPageBtn.disabled = page <= 1;
    nextPageBtn.disabled = page >= totalPages;
    pageInfo.textContent = `صفحة ${page} من ${totalPages}`;
}

/**
 * Update results count
 */
function updateResultsCount(total) {
    resultsCount.textContent = `${total} طلب`;
}

/**
 * Show loading state
 */
function showLoading() {
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                <div class="loading-placeholder">
                    <div class="loading-spinner"></div>
                    <p>جاري التحميل...</p>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Handle export
 */
async function handleExport() {
    try {
        const result = await adminStore.exportSubmissions(currentFilters);
        
        if (result.success) {
            // Create download link
            const url = window.URL.createObjectURL(new Blob([result.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showSuccess('تم تصدير البيانات بنجاح');
        } else {
            showError('فشل تصدير البيانات');
        }
    } catch (error) {
        console.error('Export error:', error);
        showError('حدث خطأ أثناء تصدير البيانات');
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    document.querySelector('.sidebar')?.classList.toggle('active');
}

/**
 * Get status label in Arabic
 */
function getStatusLabel(status) {
    const labels = {
        'pending': 'قيد المراجعة',
        'approved': 'معتمد',
        'rejected': 'مرفوض',
        'needs_revision': 'يحتاج مراجعة',
        'draft': 'مسودة'
    };
    return labels[status] || status;
}

/**
 * Get status CSS class
 */
function getStatusClass(status) {
    const classes = {
        'pending': 'warning',
        'approved': 'success',
        'rejected': 'error',
        'needs_revision': 'info',
        'draft': 'secondary'
    };
    return classes[status] || 'secondary';
}

/**
 * Format date
 */
function formatDate(dateString) {
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

/**
 * Show success message
 */
function showSuccess(message) {
    // TODO: Implement toast notification
    console.log('Success:', message);
    alert(message);
}

/**
 * Show error message
 */
function showError(message) {
    console.error('Error:', message);
    alert(message);
}

// Export functions if needed
export {
    loadSubmissions,
    viewSubmission
};

// Note: changeStatus is available on window object for inline onclick handlers

