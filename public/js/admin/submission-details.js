/**
 * Admin Submission Details JavaScript
 * صفحة تفاصيل البحث للمسؤول
 */

import adminStore from '../stores/adminStore.js';
import authStore from '../stores/authStore.js';
import { handleLogout } from '../utils/logout.js';
import { updateAvatarDisplay, getInitials } from '../utils/avatar-helper.js';

// State
let currentSubmissionId = null;
let currentSubmission = null;

// DOM Elements
let loadingState, errorState, contentContainer;
let submissionTitle, referenceNumber;
let fullName, email, country, gender, idNumber, createdAt;
let researchType, category, mainResearcher, generalSpecialization, detailedSpecialization;
let fileName, fileSize, downloadBtn;
let currentStatusBadge, daysPending, statusChanges;
let statusChangeForm, adminComment;
let historyTimeline;
let researcherAvatar, researcherName;
let applicantAvatar, applicantUsername, applicantEmail, applicantPhone, applicantNationalId, applicantUserId;
let applicantHeaderLabel, applicantIndividualFields, applicantOrganizationFields;
let applicantOrganizationName, applicantOrganizationType;
let applicantEmailOrg, applicantPhoneOrg, applicantUserIdOrg;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    if (!await checkAuth()) return;
    
    initElements();
    initEventListeners();
    await loadSubmissionDetails();
});

/**
 * Check authentication
 */
async function checkAuth() {
    // انتظار انتهاء التهيئة
    await authStore.waitForInitialization();
    
    const isLoggedIn = authStore.isLoggedIn();
    const user = authStore.getState().user;
    
    if (!isLoggedIn || !user) {
        window.location.href = '/pages/login.html';
        return false;
    }
    
    // التحقق من الصلاحيات (admin أو super_admin)
    if (user.role !== 'admin' && user.role !== 'super_admin') {
        window.location.href = '/pages/login.html';
        return false;
    }
    
    return true;
}

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
    
    // Researcher info
    researcherAvatar = document.getElementById('researcher-avatar');
    researcherName = document.getElementById('researcher-name');
    fullName = document.getElementById('full-name');
    email = document.getElementById('email');
    country = document.getElementById('country');
    gender = document.getElementById('gender');
    idNumber = document.getElementById('id-number');
    createdAt = document.getElementById('created-at');
    
    // Applicant info
    applicantAvatar = document.getElementById('applicant-avatar');
    applicantUsername = document.getElementById('applicant-username');
    applicantEmail = document.getElementById('applicant-email');
    applicantPhone = document.getElementById('applicant-phone');
    applicantNationalId = document.getElementById('applicant-national-id');
    applicantUserId = document.getElementById('applicant-user-id');
    applicantHeaderLabel = document.getElementById('applicant-header-label');
    applicantIndividualFields = document.getElementById('applicant-individual-fields');
    applicantOrganizationFields = document.getElementById('applicant-organization-fields');
    applicantOrganizationName = document.getElementById('applicant-organization-name');
    applicantOrganizationType = document.getElementById('applicant-organization-type');
    applicantEmailOrg = document.getElementById('applicant-email-org');
    applicantPhoneOrg = document.getElementById('applicant-phone-org');
    applicantUserIdOrg = document.getElementById('applicant-user-id-org');
    
    // Research info
    researchType = document.getElementById('research-type');
    category = document.getElementById('category');
    mainResearcher = document.getElementById('main-researcher');
    generalSpecialization = document.getElementById('general-specialization');
    detailedSpecialization = document.getElementById('detailed-specialization');
    
    // File
    fileName = document.getElementById('file-name');
    fileSize = document.getElementById('file-size');
    downloadBtn = document.getElementById('download-btn');
    
    // Quick info
    currentStatusBadge = document.getElementById('current-status-badge');
    daysPending = document.getElementById('days-pending');
    statusChanges = document.getElementById('status-changes');
    
    // Form
    statusChangeForm = document.getElementById('status-change-form');
    adminComment = document.getElementById('admin-comment');
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
    
    // Status options
    document.querySelectorAll('.status-option').forEach(option => {
        option.addEventListener('click', () => {
            const radio = option.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Update UI
            document.querySelectorAll('.status-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
        });
    });
    
    // Status change form
    statusChangeForm?.addEventListener('submit', handleStatusChange);
    
    // Download button
    downloadBtn?.addEventListener('click', handleDownload);
    
    // Print button
    document.getElementById('print-btn')?.addEventListener('click', handlePrint);
    
    // Export PDF button
    document.getElementById('export-pdf-btn')?.addEventListener('click', handleExportPDF);
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
        
        // التأكد من أن المستخدم محمل
        await authStore.waitForInitialization();
        
        // Fetch submission details
        const result = await adminStore.fetchSubmissionDetails(currentSubmissionId);
        
        if (!result.success) {
            const errorMessage = result.error || 'فشل في تحميل التفاصيل';
            
            // إذا كان الخطأ متعلق بالصلاحيات، إعادة توجيه
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
    submissionTitle.textContent = submission.main_researcher;
    referenceNumber.textContent = submission.reference_number;
    
    // Researcher info with avatar
    if (submission.user) {
        const user = submission.user;
        if (researcherName) researcherName.textContent = user.username || submission.full_name || '-';
        
        // Update avatar
        if (researcherAvatar) {
            updateAvatarDisplay(researcherAvatar, user, { size: 60, fontSize: '1.5rem' });
        }
    } else {
        if (researcherName) researcherName.textContent = submission.full_name || '-';
    }
    
    // Applicant info (user account information)
    // التحقق من نوع الحساب من بيانات المستخدم أولاً (account_type)
    const user = submission.user;
    const userAccountType = user?.account_type;
    const submitterType = submission.submitter_type || userAccountType || 'أفراد';
    
    // تحديد نوع الحساب: إذا كان حساب المستخدم "أعمال" أو نوع مقدم الطلب "أعمال"
    const isOrganization = userAccountType === 'أعمال' || submitterType === 'أعمال' || submitterType !== 'أفراد';
    
    if (user) {
        // Update applicant avatar
        if (applicantAvatar) {
            updateAvatarDisplay(applicantAvatar, user, { size: 60, fontSize: '1.5rem' });
        }
        
        if (isOrganization) {
            // Show organization fields for applicant
            if (applicantIndividualFields) applicantIndividualFields.style.display = 'none';
            if (applicantOrganizationFields) applicantOrganizationFields.style.display = 'block';
            
            // Update header label and icon
            if (applicantHeaderLabel) applicantHeaderLabel.textContent = 'اسم الجهة';
            if (applicantAvatar) {
                const icon = applicantAvatar.querySelector('i');
                if (icon) icon.className = 'fas fa-building';
            }
            
            // Populate organization information from user account (dynamic)
            // استخدام بيانات المؤسسة من حساب المستخدم أولاً (ديناميكي) - اعتماد بيانات مسجل الدخول
            // Priority: user account data > submission data
            if (applicantUsername) applicantUsername.textContent = user.organization_name || submission.organization_name || user.username || '-';
            if (applicantOrganizationName) applicantOrganizationName.textContent = user.organization_name || submission.organization_name || '-';
            if (applicantOrganizationType) applicantOrganizationType.textContent = user.organization_type || submission.organization_type || '-';
            if (applicantEmailOrg) applicantEmailOrg.textContent = user.email || submission.email || '-';
            if (applicantPhoneOrg) applicantPhoneOrg.textContent = user.phone || '-';
            if (applicantUserIdOrg) applicantUserIdOrg.textContent = user.id || '-';
        } else {
            // Show individual fields for applicant
            if (applicantIndividualFields) applicantIndividualFields.style.display = 'block';
            if (applicantOrganizationFields) applicantOrganizationFields.style.display = 'none';
            
            // Update header label and icon
            if (applicantHeaderLabel) applicantHeaderLabel.textContent = 'اسم المستخدم';
            if (applicantAvatar) {
                const icon = applicantAvatar.querySelector('i');
                if (icon) icon.className = 'fas fa-user';
            }
            
            // Populate individual information
            if (applicantUsername) applicantUsername.textContent = user.username || '-';
            if (applicantEmail) applicantEmail.textContent = user.email || '-';
            if (applicantPhone) applicantPhone.textContent = user.phone || '-';
            if (applicantNationalId) applicantNationalId.textContent = user.national_id || '-';
            if (applicantUserId) applicantUserId.textContent = user.id || '-';
        }
    } else {
        // If no user data, show placeholder
        if (applicantIndividualFields) applicantIndividualFields.style.display = isOrganization ? 'none' : 'block';
        if (applicantOrganizationFields) applicantOrganizationFields.style.display = isOrganization ? 'block' : 'none';
        
        if (isOrganization) {
            if (applicantHeaderLabel) applicantHeaderLabel.textContent = 'اسم الجهة';
            if (applicantAvatar) {
                const icon = applicantAvatar.querySelector('i');
                if (icon) icon.className = 'fas fa-building';
            }
            // استخدام بيانات المؤسسة من submission (إذا لم تكن متوفرة في user)
            if (applicantUsername) applicantUsername.textContent = submission.organization_name || 'غير متوفر';
            if (applicantOrganizationName) applicantOrganizationName.textContent = submission.organization_name || '-';
            if (applicantOrganizationType) applicantOrganizationType.textContent = submission.organization_type || '-';
            if (applicantEmailOrg) applicantEmailOrg.textContent = submission.email || '-';
            if (applicantPhoneOrg) applicantPhoneOrg.textContent = '-';
            if (applicantUserIdOrg) applicantUserIdOrg.textContent = '-';
        } else {
            if (applicantHeaderLabel) applicantHeaderLabel.textContent = 'اسم المستخدم';
            if (applicantAvatar) {
                const icon = applicantAvatar.querySelector('i');
                if (icon) icon.className = 'fas fa-user';
            }
            if (applicantUsername) applicantUsername.textContent = 'غير متوفر';
            if (applicantEmail) applicantEmail.textContent = '-';
            if (applicantPhone) applicantPhone.textContent = '-';
            if (applicantNationalId) applicantNationalId.textContent = '-';
            if (applicantUserId) applicantUserId.textContent = '-';
        }
    }
    
    // Submitter type (reuse the variable defined above)
    const submitterTypeEl = document.getElementById('submitter-type');
    if (submitterTypeEl) {
        submitterTypeEl.textContent = submitterType;
    }
    
    // Show/hide fields based on submitter type
    const individualFields = document.getElementById('individual-info-fields');
    const organizationFields = document.getElementById('organization-info-fields');
    
    if (submitterType === 'أفراد') {
        // Show individual fields
        if (individualFields) individualFields.style.display = 'block';
        if (organizationFields) organizationFields.style.display = 'none';
        
        fullName.textContent = submission.full_name || '-';
        email.textContent = submission.email || '-';
        country.textContent = submission.country || '-';
        gender.textContent = submission.gender || '-';
        idNumber.textContent = submission.id_number || '-';
        createdAt.textContent = formatDate(submission.created_at);
    } else {
        // Show organization fields
        if (individualFields) individualFields.style.display = 'none';
        if (organizationFields) organizationFields.style.display = 'block';
        
        const orgNameEl = document.getElementById('organization-name');
        const orgTypeEl = document.getElementById('organization-type');
        const emailOrgEl = document.getElementById('email-org');
        const countryOrgEl = document.getElementById('country-org');
        const createdAtOrgEl = document.getElementById('created-at-org');
        
        if (orgNameEl) orgNameEl.textContent = submission.organization_name || '-';
        if (orgTypeEl) orgTypeEl.textContent = submission.organization_type || '-';
        if (emailOrgEl) emailOrgEl.textContent = submission.email || '-';
        if (countryOrgEl) countryOrgEl.textContent = submission.country || '-';
        if (createdAtOrgEl) createdAtOrgEl.textContent = formatDate(submission.created_at);
    }
    
    // Research info
    researchType.textContent = submission.research_type || '-';
    category.textContent = submission.category || '-';
    mainResearcher.textContent = submission.main_researcher || '-';
    generalSpecialization.textContent = submission.general_specialization || '-';
    detailedSpecialization.textContent = submission.detailed_specialization || '-';
    
    // File
    fileName.textContent = submission.file_name || 'research.pdf';
    fileSize.textContent = formatFileSize(submission.file_size);
    
    // Quick info
    const statusLabel = getStatusLabel(submission.status);
    const statusClass = getStatusClass(submission.status);
    currentStatusBadge.textContent = statusLabel;
    currentStatusBadge.className = `badge badge-lg badge-${statusClass}`;
    
    // Calculate days pending
    const days = calculateDaysPending(submission.created_at);
    daysPending.textContent = days;
    
    // Set current status radio
    const currentStatusRadio = document.getElementById(`status-${submission.status.replace('_', '-')}`);
    if (currentStatusRadio) {
        currentStatusRadio.checked = true;
        currentStatusRadio.closest('.status-option').classList.add('selected');
    }
    
    // Populate admin comment if exists
    if (submission.admin_comment) {
        adminComment.value = submission.admin_comment;
    }
}

/**
 * Load history
 */
async function loadHistory() {
    try {
        // For now, create a basic history from submission data
        // In production, you would fetch from status_history table
        const history = [
            {
                type: 'created',
                title: 'تم إنشاء البحث',
                description: `قدّم الباحث ${currentSubmission.full_name} البحث`,
                time: currentSubmission.created_at,
                user: currentSubmission.full_name
            }
        ];
        
        if (currentSubmission.status !== 'pending') {
            history.push({
                type: 'status-change',
                title: `تم تغيير الحالة إلى: ${getStatusLabel(currentSubmission.status)}`,
                description: currentSubmission.admin_comment || 'لا يوجد تعليق',
                time: currentSubmission.updated_at,
                user: 'المسؤول'
            });
        }
        
        // Render history
        renderHistory(history);
        
        // Update status changes count
        statusChanges.textContent = history.length - 1;
        
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

/**
 * Render history timeline
 */
function renderHistory(history) {
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
 * Handle status change
 */
async function handleStatusChange(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const newStatus = formData.get('status');
        const comment = formData.get('comment');
        
        if (!newStatus) {
            alert('الرجاء اختيار الحالة الجديدة');
            return;
        }
        
        // Confirm
        if (!confirm(`هل أنت متأكد من تغيير الحالة إلى: ${getStatusLabel(newStatus)}؟`)) {
            return;
        }
        
        // Show loading
        const submitBtn = document.getElementById('submit-status-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري الحفظ...</span>';
        
        // Update status
        const result = await adminStore.updateSubmissionStatus(currentSubmissionId, newStatus, comment);
        
        if (!result.success) {
            throw new Error(result.error || 'فشل في تحديث الحالة');
        }
        
        // Show success
        alert('تم تحديث الحالة بنجاح ✓');
        
        // Reload page
        window.location.reload();
        
    } catch (error) {
        console.error('Error updating status:', error);
        alert('حدث خطأ: ' + error.message);
        
        // Reset button
        const submitBtn = document.getElementById('submit-status-btn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> <span>حفظ التغييرات</span>';
    }
}

/**
 * Handle download
 */
function handleDownload() {
    if (currentSubmission && currentSubmission.file_url) {
        window.open(currentSubmission.file_url, '_blank');
    }
}

/**
 * Handle print
 */
function handlePrint() {
    window.print();
}

/**
 * Handle export PDF
 */
function handleExportPDF() {
    alert('سيتم تنفيذ هذه الميزة قريباً');
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
 * Get status label
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
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Format relative time
 */
function formatRelativeTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    
    return formatDate(dateString);
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
 * Format file size
 */
function formatFileSize(bytes) {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
}

// Export functions if needed
export {
    loadSubmissionDetails,
    handleStatusChange
};

