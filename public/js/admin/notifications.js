/**
 * Admin Notifications Page JavaScript
 * صفحة إشعارات المسؤول
 */

import notificationsStore from '../stores/notificationsStore.js';
import authStore from '../stores/authStore.js';
import { requireAdmin } from '../utils/auth-guard.js';

// State
let currentFilter = 'all';
let currentPage = 1;
let hasMore = false;

// DOM Elements
let notificationsContainer;
let filterButtons;
let markAllReadBtn;
let clearAllBtn;
let loadMoreBtn;
let logoutBtn;
let mobileMenuBtn;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAdmin();
    if (!user) return;
    
    initElements();
    initEventListeners();
    await loadNotifications();
    
    // Initialize realtime subscriptions
    notificationsStore.initialize();
    
    // Subscribe to notification updates
    notificationsStore.subscribe(handleStoreUpdate);
});

/**
 * Initialize DOM elements
 */
function initElements() {
    notificationsContainer = document.getElementById('notifications-container');
    filterButtons = document.querySelectorAll('.filter-btn');
    markAllReadBtn = document.getElementById('mark-all-read');
    clearAllBtn = document.getElementById('clear-all');
    loadMoreBtn = document.getElementById('load-more');
    logoutBtn = document.getElementById('logout-btn');
    mobileMenuBtn = document.getElementById('mobile-menu-btn');
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => handleFilterChange(btn.dataset.filter));
    });
    
    // Mark all as read
    markAllReadBtn?.addEventListener('click', handleMarkAllAsRead);
    
    // Clear all
    clearAllBtn?.addEventListener('click', handleClearAll);
    
    // Load more
    loadMoreBtn?.addEventListener('click', handleLoadMore);
    
    // Logout
    logoutBtn?.addEventListener('click', handleLogout);
    
    // Mobile menu
    mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
}

/**
 * Load notifications
 */
async function loadNotifications() {
    showLoading();
    
    const filters = {};
    
    if (currentFilter === 'unread') {
        filters.is_read = false;
    } else if (currentFilter !== 'all') {
        filters.type = currentFilter;
    }
    
    filters.page = currentPage;
    filters.limit = 20;
    
    const result = await notificationsStore.fetchNotifications(filters);
    
    if (result.success) {
        hasMore = result.hasMore;
        renderNotifications(result.data);
        updateCounts(result.counts);
        updateLoadMoreButton();
    } else {
        showError('فشل تحميل الإشعارات');
    }
}

/**
 * Render notifications
 */
function renderNotifications(notifications) {
    if (notifications.length === 0) {
        notificationsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bell-slash"></i>
                <h3>لا توجد إشعارات</h3>
                <p>لم تتلق أي إشعارات بعد</p>
            </div>
        `;
        return;
    }
    
    const notificationsHTML = notifications.map(notification => {
        return renderNotificationItem(notification);
    }).join('');
    
    notificationsContainer.innerHTML = notificationsHTML;
}

/**
 * Render single notification item
 */
function renderNotificationItem(notification) {
    const icon = getNotificationIcon(notification.type);
    const timeAgo = formatTimeAgo(notification.created_at);
    const unreadClass = notification.is_read ? '' : 'unread';
    
    return `
        <div class="notification-item ${unreadClass}" data-id="${notification.id}">
            <div class="notification-icon ${notification.type}">
                <i class="${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-header">
                    <h4 class="notification-title">${notification.title}</h4>
                    <span class="notification-time">${timeAgo}</span>
                </div>
                <p class="notification-message">${notification.message}</p>
                ${notification.submission ? `
                    <div class="notification-meta">
                        <span><i class="fas fa-hashtag"></i> ${notification.submission.reference_number}</span>
                    </div>
                ` : ''}
                <div class="notification-actions">
                    ${notification.submission_id ? `
                        <button class="btn-view" onclick="viewSubmission('${notification.submission_id}')">
                            <i class="fas fa-eye"></i> عرض الطلب
                        </button>
                    ` : ''}
                    ${!notification.is_read ? `
                        <button class="btn-mark-read" onclick="markAsRead('${notification.id}')">
                            <i class="fas fa-check"></i> تعليم كمقروء
                        </button>
                    ` : ''}
                    <button class="btn-delete" onclick="deleteNotification('${notification.id}')">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get notification icon
 */
function getNotificationIcon(type) {
    const icons = {
        new_submission: 'fas fa-file-plus',
        status_change: 'fas fa-exchange-alt',
        comment_added: 'fas fa-comment',
        system: 'fas fa-cog',
        reminder: 'fas fa-clock',
    };
    return icons[type] || 'fas fa-bell';
}

/**
 * Format time ago
 */
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'منذ لحظات';
    if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`;
    if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`;
    if (seconds < 604800) return `منذ ${Math.floor(seconds / 86400)} يوم`;
    if (seconds < 2592000) return `منذ ${Math.floor(seconds / 604800)} أسبوع`;
    return `منذ ${Math.floor(seconds / 2592000)} شهر`;
}

/**
 * Update counts
 */
function updateCounts(counts) {
    document.getElementById('count-all').textContent = counts.total;
    document.getElementById('count-unread').textContent = counts.unread;
    
    const sidebarBadge = document.getElementById('sidebar-notification-count');
    if (sidebarBadge) {
        sidebarBadge.textContent = counts.unread;
        sidebarBadge.style.display = counts.unread > 0 ? 'flex' : 'none';
    }
}

/**
 * Handle filter change
 */
async function handleFilterChange(filter) {
    currentFilter = filter;
    currentPage = 1;
    
    // Update active filter button
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    await loadNotifications();
}

/**
 * Handle mark all as read
 */
async function handleMarkAllAsRead() {
    if (!confirm('هل تريد تعليم جميع الإشعارات كمقروءة؟')) return;
    
    const result = await notificationsStore.markAllAsRead();
    
    if (result.success) {
        showSuccess('تم تعليم جميع الإشعارات كمقروءة');
        await loadNotifications();
    } else {
        showError('فشل تعليم الإشعارات كمقروءة');
    }
}

/**
 * Handle clear all
 */
async function handleClearAll() {
    if (!confirm('هل تريد حذف جميع الإشعارات؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    
    const result = await notificationsStore.clearAll();
    
    if (result.success) {
        showSuccess('تم حذف جميع الإشعارات');
        await loadNotifications();
    } else {
        showError('فشل حذف الإشعارات');
    }
}

/**
 * Handle load more
 */
async function handleLoadMore() {
    currentPage++;
    await loadNotifications();
}

/**
 * View submission
 */
window.viewSubmission = function(submissionId) {
    window.location.href = `/pages/admin/submission-details.html?id=${submissionId}`;
};

/**
 * Mark as read
 */
window.markAsRead = async function(notificationId) {
    const result = await notificationsStore.markAsRead(notificationId);
    
    if (result.success) {
        const notificationItem = document.querySelector(`[data-id="${notificationId}"]`);
        if (notificationItem) {
            notificationItem.classList.remove('unread');
            const markReadBtn = notificationItem.querySelector('.btn-mark-read');
            if (markReadBtn) markReadBtn.remove();
        }
        await loadNotifications();
    } else {
        showError('فشل تعليم الإشعار كمقروء');
    }
};

/**
 * Delete notification
 */
window.deleteNotification = async function(notificationId) {
    if (!confirm('هل تريد حذف هذا الإشعار؟')) return;
    
    const result = await notificationsStore.deleteNotification(notificationId);
    
    if (result.success) {
        const notificationItem = document.querySelector(`[data-id="${notificationId}"]`);
        if (notificationItem) {
            notificationItem.remove();
        }
        await loadNotifications();
    } else {
        showError('فشل حذف الإشعار');
    }
};

/**
 * Handle store update
 */
function handleStoreUpdate(state) {
    // Update sidebar badge
    const sidebarBadge = document.getElementById('sidebar-notification-count');
    if (sidebarBadge) {
        sidebarBadge.textContent = state.unreadCount;
        sidebarBadge.style.display = state.unreadCount > 0 ? 'flex' : 'none';
    }
}

/**
 * Update load more button
 */
function updateLoadMoreButton() {
    const pagination = document.getElementById('pagination');
    if (pagination) {
        pagination.style.display = hasMore ? 'flex' : 'none';
    }
}

/**
 * Show loading
 */
function showLoading() {
    notificationsContainer.innerHTML = `
        <div class="loading-placeholder">
            <div class="loading-spinner"></div>
            <p>جاري تحميل الإشعارات...</p>
        </div>
    `;
}

/**
 * Show error
 */
function showError(message) {
    notificationsContainer.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-circle" style="color: var(--error-color);"></i>
            <h3>حدث خطأ</h3>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Show success message
 */
function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(alert);
    
    setTimeout(() => alert.remove(), 3000);
}

/**
 * Handle logout
 */
async function handleLogout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        await authStore.logout();
        window.location.href = '/pages/login.html';
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('active');
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    notificationsStore.unsubscribeFromRealtime();
});

