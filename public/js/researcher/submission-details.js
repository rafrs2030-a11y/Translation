/**
 * Researcher Submission Details JavaScript
 * صفحة تفاصيل البحث للباحث
 */

import submissionsStore from '../stores/submissionsStore.js';
import authStore from '../stores/authStore.js';
import { handleLogout } from '../utils/logout.js';
import { requireResearcher } from '../utils/auth-guard.js';
import { formatDate, formatRelativeTime, formatFileSize, getStatusLabel } from '../utils/helpers.js';
import { initNotificationDropdown } from '../utils/notification-dropdown.js';

// State
let currentSubmissionId = null;
let currentSubmission = null;

// DOM Elements
let loadingState, errorState, contentContainer;
let submissionTitle, referenceNumber;
let researchType, category, mainResearcher, generalSpecialization, detailedSpecialization, createdAt;
let fileName, fileSize, downloadBtn;
let currentStatusBadge, daysPending, statusChanges, lastUpdated;
let adminCommentCard, adminCommentContent;
let historyTimeline;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireResearcher();
    if (!user) return;
    
    initElements();
    initEventListeners();
    await loadSubmissionDetails();
    await initNotificationDropdown();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    // States
    loadingState = document.getElementById('loading-state');
    errorState = document.getElementById('error-state');
    contentContainer = document.getElementById('content-container');
    
    // Header
    submissionTitle = document.getElementById('submission-title');
    referenceNumber = document.getElementById('reference-number');
    
    // Research info
    researchType = document.getElementById('research-type');
    category = document.getElementById('category');
    mainResearcher = document.getElementById('main-researcher');
    generalSpecialization = document.getElementById('general-specialization');
    detailedSpecialization = document.getElementById('detailed-specialization');
    createdAt = document.getElementById('created-at');
    
    // File
    fileName = document.getElementById('file-name');
    fileSize = document.getElementById('file-size');
    downloadBtn = document.getElementById('download-btn');
    
    // Quick info
    currentStatusBadge = document.getElementById('current-status-badge');
    daysPending = document.getElementById('days-pending');
    statusChanges = document.getElementById('status-changes');
    lastUpdated = document.getElementById('last-updated');
    
    // Admin comment
    adminCommentCard = document.getElementById('admin-comment-card');
    adminCommentContent = document.getElementById('admin-comment-content');
    
    // History
    historyTimeline = document.getElementById('history-timeline');
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
    
    // Download button
    downloadBtn?.addEventListener('click', handleDownload);
    
    // Print button
    document.getElementById('print-btn')?.addEventListener('click', handlePrint);
}

/**
 * Load submission details
 */
async function loadSubmissionDetails() {
    try {
        // Get submission ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        currentSubmissionId = urlParams.get('id');
        
        if (!currentSubmissionId) {
            showError('رقم البحث غير موجود');
            return;
        }
        
        // Show loading
        showLoading(true);
        
        // Wait for auth initialization
        await authStore.waitForInitialization();
        
        const user = authStore.getState().user;
        if (!user) {
            window.location.href = '/pages/login.html';
            return;
        }
        
        // Fetch submission details
        const result = await submissionsStore.fetchSubmissionById(currentSubmissionId);
        
        if (!result.success) {
            const errorMessage = result.error || 'فشل في تحميل التفاصيل';
            
            // If error is related to permissions, redirect
            if (errorMessage.includes('غير مصرح') || errorMessage.includes('يجب تسجيل الدخول')) {
                window.location.href = '/pages/login.html';
                return;
            }
            
            throw new Error(errorMessage);
        }
        
        if (!result.data) {
            throw new Error('لم يتم العثور على بيانات البحث');
        }
        
        currentSubmission = result.data;
        
        // Verify that the submission belongs to the logged-in researcher
        if (currentSubmission.user_id !== user.id) {
            showError('ليس لديك صلاحية لعرض هذا الطلب');
            return;
        }
        
        // Populate UI
        populateSubmissionData(currentSubmission);
        
        // Load history
        await loadHistory();
        
        // Show content
        showLoading(false);
        contentContainer.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading submission details:', error);
        showError(error.message || 'حدث خطأ غير متوقع');
    }
}

/**
 * Populate submission data
 */
function populateSubmissionData(submission) {
    // Header
    submissionTitle.textContent = submission.main_researcher || 'تفاصيل البحث';
    referenceNumber.textContent = submission.reference_number || 'REF-000000';
    
    // Research info
    researchType.textContent = getResearchTypeLabel(submission.research_type) || '-';
    category.textContent = submission.category || '-';
    mainResearcher.textContent = submission.main_researcher || '-';
    generalSpecialization.textContent = submission.general_specialization || '-';
    detailedSpecialization.textContent = submission.detailed_specialization || '-';
    createdAt.textContent = formatDate(submission.created_at, true) || '-';
    
    // File
    if (submission.file_url) {
        fileName.textContent = submission.file_name || 'research.pdf';
        fileSize.textContent = formatFileSize(submission.file_size) || '0 MB';
        downloadBtn.style.display = 'block';
    } else {
        fileName.textContent = 'لا يوجد ملف';
        fileSize.textContent = '-';
        downloadBtn.style.display = 'none';
    }
    
    // Quick info
    const statusLabel = getStatusLabel(submission.status);
    const statusClass = getStatusClass(submission.status);
    currentStatusBadge.textContent = statusLabel;
    currentStatusBadge.className = `badge badge-lg badge-${statusClass}`;
    
    // Calculate days pending
    const days = calculateDaysPending(submission.created_at);
    daysPending.textContent = days;
    
    // Last updated
    if (submission.updated_at) {
        lastUpdated.textContent = formatRelativeTime(submission.updated_at);
    } else {
        lastUpdated.textContent = formatRelativeTime(submission.created_at);
    }
    
    // Admin comment
    if (submission.admin_comment) {
        adminCommentContent.textContent = submission.admin_comment;
        adminCommentCard.style.display = 'block';
    } else {
        adminCommentCard.style.display = 'none';
    }
}

/**
 * Load history
 */
async function loadHistory() {
    try {
        // Create a basic history from submission data
        // In production, you would fetch from status_history table
        const history = [
            {
                type: 'created',
                title: 'تم تقديم البحث',
                description: `تم تقديم البحث بنجاح`,
                time: currentSubmission.created_at,
                user: 'أنت'
            }
        ];
        
        if (currentSubmission.status !== 'pending' && currentSubmission.status !== 'draft') {
            history.push({
                type: 'status-change',
                title: `تم تغيير الحالة إلى: ${getStatusLabel(currentSubmission.status)}`,
                description: currentSubmission.admin_comment || 'تم تحديث حالة البحث',
                time: currentSubmission.updated_at || currentSubmission.created_at,
                user: 'المسؤول'
            });
        }
        
        if (currentSubmission.admin_comment) {
            history.push({
                type: 'comment',
                title: 'تعليق من المسؤول',
                description: currentSubmission.admin_comment,
                time: currentSubmission.updated_at || currentSubmission.created_at,
                user: 'المسؤول'
            });
        }
        
        // Render history
        renderHistory(history);
        
        // Update status changes count
        statusChanges.textContent = history.filter(h => h.type === 'status-change').length;
        
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

/**
 * Render history timeline
 */
function renderHistory(history) {
    if (!history || history.length === 0) {
        historyTimeline.innerHTML = `
            <div style="text-align: center; padding: var(--spacing-lg); color: var(--text-secondary);">
                لا يوجد سجل تغييرات
            </div>
        `;
        return;
    }
    
    historyTimeline.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-icon ${item.type}">
                <i class="fas ${getHistoryIcon(item.type)}"></i>
            </div>
            <div class="history-content">
                <div class="history-header">
                    <div class="history-title">${item.title}</div>
                    <div class="history-time">${formatRelativeTime(item.time)}</div>
                </div>
                <div class="history-description">${item.description}</div>
                <div class="history-meta">
                    <span><i class="fas fa-user"></i> ${item.user}</span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Handle download
 */
function handleDownload() {
    if (currentSubmission && currentSubmission.file_url) {
        window.open(currentSubmission.file_url, '_blank');
    } else {
        alert('لا يوجد ملف للتحميل');
    }
}

/**
 * Handle print
 */
function handlePrint() {
    window.print();
}

/**
 * Show loading
 */
function showLoading(show) {
    if (show) {
        loadingState.style.display = 'block';
        errorState.style.display = 'none';
        contentContainer.style.display = 'none';
    } else {
        loadingState.style.display = 'none';
    }
}

/**
 * Show error
 */
function showError(message) {
    loadingState.style.display = 'none';
    contentContainer.style.display = 'none';
    errorState.style.display = 'block';
    document.getElementById('error-message').textContent = message;
}

/**
 * Get status class
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
 * Get history icon
 */
function getHistoryIcon(type) {
    const icons = {
        'created': 'fa-plus',
        'status-change': 'fa-exchange-alt',
        'comment': 'fa-comment'
    };
    return icons[type] || 'fa-circle';
}

/**
 * Calculate days pending
 */
function calculateDaysPending(dateString) {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days;
}

/**
 * Get research type label
 */
function getResearchTypeLabel(type) {
    const labels = {
        'scientific_paper': 'ورقة علمية',
        'masters_thesis': 'رسالة ماجستير',
        'phd_dissertation': 'أطروحة دكتوراه',
        'book': 'كتاب'
    };
    return labels[type] || type;
}

// Export functions if needed
export {
    loadSubmissionDetails
};

