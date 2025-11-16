/**
 * Admin Dashboard JavaScript
 * لوحة تحكم المسؤول
 */

import adminStore from '../stores/adminStore.js';
import authStore from '../stores/authStore.js';
import { handleLogout } from '../utils/logout.js';
import { requireAdmin } from '../utils/auth-guard.js';

// DOM Elements
let totalSubmissionsEl, pendingSubmissionsEl, approvedSubmissionsEl, rejectedSubmissionsEl;
let pendingListEl, activityListEl;
let adminNameEl, userEmailEl;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAdmin();
    if (!user) return;
    
    initElements();
    initEventListeners();
    await loadDashboardData();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    // Stats
    totalSubmissionsEl = document.getElementById('total-submissions');
    pendingSubmissionsEl = document.getElementById('pending-submissions');
    approvedSubmissionsEl = document.getElementById('approved-submissions');
    rejectedSubmissionsEl = document.getElementById('rejected-submissions');
    
    // Lists
    pendingListEl = document.getElementById('pending-list');
    activityListEl = document.getElementById('activity-list');
    
    // User info
    adminNameEl = document.getElementById('admin-name');
    userEmailEl = document.getElementById('user-email');
    
    // Set user info
    const user = authStore.state.user;
    if (user) {
        adminNameEl.textContent = user.username || 'المسؤول';
        userEmailEl.textContent = user.email;
    }
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
    
    // Notifications
    document.getElementById('notifications-btn')?.addEventListener('click', () => {
        window.location.href = '/pages/admin/notifications.html';
    });
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Chart period selector
    document.getElementById('chart-period')?.addEventListener('change', (e) => {
        loadChartData(e.target.value);
    });
}

/**
 * Load dashboard data
 */
async function loadDashboardData() {
    try {
        // Load statistics
        await loadStatistics();
        
        // Load pending submissions
        await loadPendingSubmissions();
        
        // Load recent activity
        await loadRecentActivity();
        
        // Load status distribution
        await loadStatusDistribution();
        
        // Load chart
        await loadChartData('month');
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('حدث خطأ أثناء تحميل البيانات');
    }
}

/**
 * Load statistics
 */
async function loadStatistics() {
    try {
        const stats = await adminStore.getStatistics();
        
        if (stats) {
            totalSubmissionsEl.textContent = stats.total || 0;
            pendingSubmissionsEl.textContent = stats.pending || 0;
            approvedSubmissionsEl.textContent = stats.approved || 0;
            rejectedSubmissionsEl.textContent = stats.rejected || 0;
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

/**
 * Load pending submissions
 */
async function loadPendingSubmissions() {
    try {
        const result = await adminStore.fetchSubmissions({ status: 'pending', limit: 5 });
        const submissions = result?.data || [];
        
        if (!submissions || submissions.length === 0) {
            pendingListEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>لا توجد طلبات قيد المراجعة</p>
                </div>
            `;
            return;
        }
        
        pendingListEl.innerHTML = submissions.map(submission => `
            <div class="submission-item">
                <div class="submission-info">
                    <h4>${submission.full_name}</h4>
                    <p class="text-secondary">
                        <i class="fas fa-graduation-cap"></i>
                        ${submission.research_type} - ${submission.category}
                    </p>
                    <span class="badge badge-sm badge-warning">
                        ${formatDate(submission.created_at)}
                    </span>
                </div>
                <div class="submission-actions">
                    <a href="/pages/admin/submission-details.html?id=${submission.id}" 
                       class="btn btn-sm btn-primary">
                        <i class="fas fa-eye"></i>
                        عرض
                    </a>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading pending submissions:', error);
        pendingListEl.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>خطأ في تحميل الطلبات</p>
            </div>
        `;
    }
}

/**
 * Load recent activity
 */
async function loadRecentActivity() {
    try {
        const activities = await adminStore.getAuditLog({ limit: 10 });
        
        if (!activities || activities.length === 0) {
            activityListEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>لا يوجد نشاط حديث</p>
                </div>
            `;
            return;
        }
        
        activityListEl.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${getActivityIconClass(activity.action)}">
                    <i class="fas ${getActivityIcon(activity.action)}"></i>
                </div>
                <div class="activity-details">
                    <p>${getActivityMessage(activity)}</p>
                    <span class="activity-time">${formatTimeAgo(activity.created_at)}</span>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading recent activity:', error);
        activityListEl.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>خطأ في تحميل النشاط</p>
            </div>
        `;
    }
}

/**
 * Load status distribution
 */
async function loadStatusDistribution() {
    try {
        const stats = await adminStore.getStatistics();
        
        if (!stats) return;
        
        const total = stats.total || 1; // Prevent division by zero
        
        const pending = ((stats.pending || 0) / total * 100).toFixed(1);
        const approved = ((stats.approved || 0) / total * 100).toFixed(1);
        const needsRevision = ((stats.needs_revision || 0) / total * 100).toFixed(1);
        const rejected = ((stats.rejected || 0) / total * 100).toFixed(1);
        
        // Update bars
        document.querySelector('[data-status="pending"]').style.width = `${pending}%`;
        document.querySelector('[data-status="approved"]').style.width = `${approved}%`;
        document.querySelector('[data-status="needs-revision"]').style.width = `${needsRevision}%`;
        document.querySelector('[data-status="rejected"]').style.width = `${rejected}%`;
        
        // Update percentages
        document.getElementById('pending-percent').textContent = `${pending}%`;
        document.getElementById('approved-percent').textContent = `${approved}%`;
        document.getElementById('revision-percent').textContent = `${needsRevision}%`;
        document.getElementById('rejected-percent').textContent = `${rejected}%`;
        
    } catch (error) {
        console.error('Error loading status distribution:', error);
    }
}

/**
 * Load chart data
 */
async function loadChartData(period = 'month') {
    try {
        const chartData = await adminStore.getChartData(period);
        
        if (!chartData) return;
        
        // Here you would integrate with a charting library like Chart.js
        // For now, we'll just log the data
        console.log('Chart data:', chartData);
        
        // TODO: Implement chart rendering with Chart.js or similar
        
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

/**
 * Get activity icon
 */
function getActivityIcon(action) {
    const icons = {
        'status_change': 'fa-exchange-alt',
        'comment_added': 'fa-comment',
        'user_created': 'fa-user-plus',
        'submission_created': 'fa-file-plus',
        'default': 'fa-circle'
    };
    return icons[action] || icons.default;
}

/**
 * Get activity icon class
 */
function getActivityIconClass(action) {
    const classes = {
        'status_change': 'activity-icon-info',
        'comment_added': 'activity-icon-success',
        'user_created': 'activity-icon-primary',
        'submission_created': 'activity-icon-warning',
        'default': 'activity-icon-secondary'
    };
    return classes[action] || classes.default;
}

/**
 * Get activity message
 */
function getActivityMessage(activity) {
    const messages = {
        'status_change': `تم تغيير حالة الطلب إلى ${getStatusLabel(activity.details?.new_status)}`,
        'comment_added': 'تم إضافة تعليق جديد',
        'user_created': 'تم إنشاء مستخدم جديد',
        'submission_created': 'تم تقديم طلب جديد'
    };
    return messages[activity.action] || activity.action;
}

/**
 * Get status label in Arabic
 */
function getStatusLabel(status) {
    const labels = {
        'pending': 'قيد المراجعة',
        'approved': 'معتمد',
        'rejected': 'مرفوض',
        'needs_revision': 'يحتاج مراجعة'
    };
    return labels[status] || status;
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'اليوم';
    if (days === 1) return 'أمس';
    if (days < 7) return `منذ ${days} أيام`;
    
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format time ago
 */
function formatTimeAgo(dateString) {
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
 * Show error message
 */
function showError(message) {
    // You can implement a toast notification system here
    console.error(message);
    alert(message);
}

// Export functions if needed
export {
    loadDashboardData,
    loadStatistics,
    loadPendingSubmissions,
    loadRecentActivity
};

