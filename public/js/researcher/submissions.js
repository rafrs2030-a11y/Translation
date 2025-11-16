/**
 * Researcher Submissions List JavaScript
 */

import authStore from '../stores/authStore.js';
import submissionsStore from '../stores/submissionsStore.js';
import { formatDate, formatRelativeTime } from '../utils/helpers.js';

// State
let currentPage = 1;
let totalPages = 1;
let filters = {
    status: '',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
};

// DOM Elements
let submissionsList, pagination, totalCount;
let statusFilter, sortFilter, searchInput;
let prevPageBtn, nextPageBtn, pageInfo;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    if (!await requireAuth()) return;
    
    initElements();
    initEventListeners();
    await loadSubmissions();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    submissionsList = document.getElementById('submissions-list');
    pagination = document.getElementById('pagination');
    totalCount = document.getElementById('total-count');
    
    statusFilter = document.getElementById('status-filter');
    sortFilter = document.getElementById('sort-filter');
    searchInput = document.getElementById('search-input');
    
    prevPageBtn = document.getElementById('prev-page');
    nextPageBtn = document.getElementById('next-page');
    pageInfo = document.getElementById('page-info');
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Filters
    statusFilter.addEventListener('change', () => {
        filters.status = statusFilter.value;
        currentPage = 1;
        loadSubmissions();
    });
    
    sortFilter.addEventListener('change', () => {
        const value = sortFilter.value;
        if (value === 'created_at_desc') {
            filters.sortBy = 'created_at';
            filters.sortOrder = 'desc';
        } else if (value === 'created_at_asc') {
            filters.sortBy = 'created_at';
            filters.sortOrder = 'asc';
        } else if (value === 'status') {
            filters.sortBy = 'status';
            filters.sortOrder = 'asc';
        }
        currentPage = 1;
        loadSubmissions();
    });
    
    // Search with debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filters.search = searchInput.value;
            currentPage = 1;
            loadSubmissions();
        }, 500);
    });
    
    // Pagination
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadSubmissions();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadSubmissions();
        }
    });
}

/**
 * Load submissions
 */
async function loadSubmissions() {
    try {
        showLoading();
        
        const result = await submissionsStore.fetchUserSubmissions({
            page: currentPage,
            limit: 10,
            status: filters.status,
            search: filters.search,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder
        });
        
        if (result.success) {
            renderSubmissions(result.data);
            updatePagination(result.pagination);
        } else {
            renderError();
        }
    } catch (error) {
        console.error('Load submissions error:', error);
        renderError();
    }
}

/**
 * Render submissions
 */
function renderSubmissions(submissions) {
    if (!submissions || submissions.length === 0) {
        renderEmpty();
        return;
    }
    
    submissionsList.innerHTML = submissions.map(submission => `
        <div class="submission-item">
            <div class="submission-header">
                <div>
                    <div class="submission-title">${submission.main_researcher || 'بحث جديد'}</div>
                    <div class="submission-ref">
                        <i class="fas fa-hashtag"></i>
                        ${submission.reference_number || '---'}
                    </div>
                </div>
                <span class="badge badge-${getStatusBadgeType(submission.status)}">
                    ${getStatusLabel(submission.status)}
                </span>
            </div>
            
            <div class="submission-meta">
                <span>
                    <i class="fas fa-calendar"></i>
                    ${formatRelativeTime(submission.created_at)}
                </span>
                <span>
                    <i class="fas fa-folder"></i>
                    ${submission.category || 'غير محدد'}
                </span>
                <span>
                    <i class="fas fa-book"></i>
                    ${getResearchTypeLabel(submission.research_type)}
                </span>
                ${submission.admin_comment ? `
                <span>
                    <i class="fas fa-comment"></i>
                    تعليق من المسؤول
                </span>
                ` : ''}
            </div>
            
            <div class="submission-actions">
                <a href="/pages/researcher/submission-details.html?id=${submission.id}" 
                   class="btn btn-primary btn-small">
                    <i class="fas fa-eye"></i>
                    عرض التفاصيل
                </a>
                ${submission.file_url ? `
                <a href="${submission.file_url}" target="_blank" class="btn btn-outline btn-small">
                    <i class="fas fa-download"></i>
                    تحميل الملف
                </a>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    // Update count
    totalCount.textContent = `${submissions.length} طلب`;
}

/**
 * Render empty state
 */
function renderEmpty() {
    submissionsList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-file-alt"></i>
            <h3>لا توجد طلبات</h3>
            <p>لم تقم بتقديم أي طلبات حتى الآن</p>
            <a href="/pages/researcher/submit.html" class="btn btn-primary">
                <i class="fas fa-plus"></i>
                تقديم بحث جديد
            </a>
        </div>
    `;
    pagination.style.display = 'none';
    totalCount.textContent = '0 طلب';
}

/**
 * Render error state
 */
function renderError() {
    submissionsList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>حدث خطأ</h3>
            <p>فشل تحميل الطلبات. يرجى إعادة المحاولة</p>
            <button class="btn btn-primary" onclick="window.location.reload()">
                <i class="fas fa-redo"></i>
                إعادة المحاولة
            </button>
        </div>
    `;
    pagination.style.display = 'none';
}

/**
 * Show loading
 */
function showLoading() {
    submissionsList.innerHTML = `
        <div class="loading-placeholder">
            <div class="loading-spinner"></div>
            <p>جاري التحميل...</p>
        </div>
    `;
}

/**
 * Update pagination
 */
function updatePagination(paginationData) {
    if (!paginationData) return;
    
    totalPages = paginationData.totalPages || 1;
    currentPage = paginationData.currentPage || 1;
    
    // Update buttons
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
    
    // Update info
    pageInfo.textContent = `صفحة ${currentPage} من ${totalPages}`;
    
    // Show pagination if more than 1 page
    pagination.style.display = totalPages > 1 ? 'flex' : 'none';
}

/**
 * Helper functions
 */

function getStatusLabel(status) {
    const labels = {
        'pending': 'قيد المراجعة',
        'approved': 'مقبول',
        'rejected': 'مرفوض',
        'needs_revision': 'يحتاج مراجعة',
        'draft': 'مسودة'
    };
    return labels[status] || status;
}

function getStatusBadgeType(status) {
    const types = {
        'pending': 'warning',
        'approved': 'success',
        'rejected': 'error',
        'needs_revision': 'info',
        'draft': 'primary'
    };
    return types[status] || 'primary';
}

function getResearchTypeLabel(type) {
    const labels = {
        'scientific_paper': 'ورقة علمية',
        'masters_thesis': 'رسالة ماجستير',
        'phd_dissertation': 'أطروحة دكتوراه',
        'book': 'كتاب'
    };
    return labels[type] || type;
}

async function requireAuth() {
    const isLoggedIn = await authStore.isLoggedIn();
    if (!isLoggedIn) {
        window.location.href = '/pages/login.html';
        return false;
    }
    return true;
}

