/**
 * Researcher Notifications JavaScript
 * إشعارات الباحث
 */

import notificationsStore from '../stores/notificationsStore.js';
import authStore from '../stores/authStore.js';
import { handleLogout } from '../utils/logout.js';
import { requireResearcher } from '../utils/auth-guard.js';

// State
let currentFilter = 'all';
let currentPage = 1;
const itemsPerPage = 20;

// DOM Elements
let notificationsContainer, filterButtons, loadMoreBtn;
let markAllReadBtn, clearAllBtn;
let counters = {};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireResearcher();
    if (!user) return;
    
    initElements();
    initEventListeners();
    await loadNotifications();
    subscribeToRealtime();
});

/**
 * Initialize DOM elements
 */
function initElements() {
    notificationsContainer = document.getElementById('notifications-container');
    filterButtons = document.querySelectorAll('.filter-btn');
    loadMoreBtn = document.getElementById('load-more');
    markAllReadBtn = document.getElementById('mark-all-read');
    clearAllBtn = document.getElementById('clear-all');
    
    // Counter elements
    counters = {
        all: document.getElementById('count-all'),
        unread: document.getElementById('count-unread')
    };
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
    
    // Actions
    markAllReadBtn?.addEventListener('click', handleMarkAllRead);
    clearAllBtn?.addEventListener('click', handleClearAll);
    loadMoreBtn?.addEventListener('click', handleLoadMore);
    
    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    
    // Mobile menu
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', toggleMobileMenu);
}

/**
 * Load notifications
 */
async function loadNotifications(append = false) {
    try {
        if (!append) {
            showLoading();
        }
        
        const filters = {
            page: currentPage,
            limit: itemsPerPage
        };
        
        if (currentFilter !== 'all') {
            if (currentFilter === 'unread') {
                filters.is_read = false;
            } else {
                filters.type = currentFilter;
            }
        }
        
        const result = await notificationsStore.fetchNotifications(filters);
        
        if (!result || !result.data) {
            if (!append) {
                showEmpty();
            }
            return;
        }
        
        if (append) {
            appendNotifications(result.data);
        } else {
            renderNotifications(result.data);
        }
        
        updateCounters(result.counts);
        updateLoadMoreButton(result.hasMore);
        
    } catch (error) {
        console.error('Error loading notifications:', error);
        showError('حدث خطأ أثناء تحميل الإشعارات');
    }
}

/**
 * Render notifications
 */
function renderNotifications(notifications) {
    if (!notifications || notifications.length === 0) {
        showEmpty();
        return;
    }
    
    notificationsContainer.innerHTML = notifications.map(notification => 
        createNotificationHTML(notification)
    ).join('');
    
    // Add click listeners
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', () => handleNotificationClick(item.dataset.id));
    });
}

/**
 * Append notifications
 */
function appendNotifications(notifications) {
    const html = notifications.map(notification => 
        createNotificationHTML(notification)
    ).join('');
    
    notificationsContainer.insertAdjacentHTML('beforeend', html);
    
    // Add click listeners to new items
    document.querySelectorAll('.notification-item[data-id]').forEach(item => {
        if (!item.dataset.listenerAdded) {
            item.addEventListener('click', () => handleNotificationClick(item.dataset.id));
            item.dataset.listenerAdded = 'true';
        }
    });
}

/**
 * Create notification HTML
 */
function createNotificationHTML(notification) {
    const isUnread = !notification.is_read;
    const icon = getNotificationIcon(notification.type);
    const time = formatTimeAgo(notification.created_at);
    
    return `
        <div class="notification-item ${isUnread ? 'unread' : ''}" data-id="${notification.id}">
            <div class="notification-icon ${notification.type}">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-content">
                <h4 class="notification-title">${getNotificationTitle(notification)}</h4>
                <p class="notification-message">${notification.message}</p>
                <div class="notification-meta">
                    <span>
                        <i class="fas fa-clock"></i>
                        ${time}
                    </span>
                    ${notification.submission_id ? `
                        <span>
                            <i class="fas fa-file-alt"></i>
                            ${notification.submission?.reference_number || 'طلب'}
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="notification-actions">
                ${isUnread ? `
                    <button class="btn btn-sm btn-ghost" onclick="window.markAsRead('${notification.id}', event)" title="تعليم كمقروء">
                        <i class="fas fa-check"></i>
                    </button>
                ` : ''}
                <button class="btn btn-sm btn-ghost" onclick="window.deleteNotification('${notification.id}', event)" title="حذف">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
}

/**
 * Handle notification click
 */
async function handleNotificationClick(id) {
    const notification = await notificationsStore.getNotification(id);
    
    if (!notification) return;
    
    // Mark as read
    if (!notification.is_read) {
        await notificationsStore.markAsRead(id);
    }
    
    // Navigate if has submission
    if (notification.submission_id) {
        window.location.href = `/pages/researcher/submission-details.html?id=${notification.submission_id}`;
    }
}

/**
 * Mark notification as read
 */
window.markAsRead = async (id, event) => {
    event?.stopPropagation();
    
    try {
        const result = await notificationsStore.markAsRead(id);
        
        if (result.success) {
            const item = document.querySelector(`[data-id="${id}"]`);
            item?.classList.remove('unread');
            item?.querySelector('.notification-actions')?.remove();
            await loadNotifications();
        }
    } catch (error) {
        console.error('Error marking as read:', error);
    }
};

/**
 * Delete notification
 */
window.deleteNotification = async (id, event) => {
    event?.stopPropagation();
    
    if (!confirm('هل تريد حذف هذا الإشعار؟')) return;
    
    try {
        const result = await notificationsStore.deleteNotification(id);
        
        if (result.success) {
            const item = document.querySelector(`[data-id="${id}"]`);
            item?.remove();
            await loadNotifications();
        }
    } catch (error) {
        console.error('Error deleting notification:', error);
    }
};

/**
 * Handle filter change
 */
function handleFilterChange(e) {
    const btn = e.currentTarget;
    const filter = btn.dataset.filter;
    
    // Update active state
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update filter and reload
    currentFilter = filter;
    currentPage = 1;
    loadNotifications();
}

/**
 * Handle mark all as read
 */
async function handleMarkAllRead() {
    if (!confirm('هل تريد تعليم جميع الإشعارات كمقروءة؟')) return;
    
    try {
        const result = await notificationsStore.markAllAsRead();
        
        if (result.success) {
            await loadNotifications();
            showSuccess('تم تعليم جميع الإشعارات كمقروءة');
        }
    } catch (error) {
        console.error('Error marking all as read:', error);
        showError('حدث خطأ');
    }
}

/**
 * Handle clear all
 */
async function handleClearAll() {
    if (!confirm('هل تريد حذف جميع الإشعارات؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    
    try {
        const result = await notificationsStore.clearAll();
        
        if (result.success) {
            await loadNotifications();
            showSuccess('تم حذف جميع الإشعارات');
        }
    } catch (error) {
        console.error('Error clearing all:', error);
        showError('حدث خطأ');
    }
}

/**
 * Handle load more
 */
function handleLoadMore() {
    currentPage++;
    loadNotifications(true);
}

/**
 * Update counters
 */
function updateCounters(counts) {
    if (!counts) return;
    
    if (counters.all) counters.all.textContent = counts.total || 0;
    if (counters.unread) counters.unread.textContent = counts.unread || 0;
    
    // Update sidebar badge
    const sidebarBadge = document.getElementById('sidebar-notification-count');
    if (sidebarBadge) {
        sidebarBadge.textContent = counts.unread || 0;
        sidebarBadge.style.display = counts.unread > 0 ? 'inline' : 'none';
    }
}

/**
 * Update load more button
 */
function updateLoadMoreButton(hasMore) {
    const pagination = document.getElementById('pagination');
    if (pagination) {
        pagination.style.display = hasMore ? 'flex' : 'none';
    }
}

/**
 * Subscribe to realtime updates
 */
function subscribeToRealtime() {
    notificationsStore.subscribeToNotifications((notification) => {
        // Show toast notification
        showToast(notification.message);
        
        // Reload notifications if on the current filter
        if (currentFilter === 'all' || 
            currentFilter === notification.type || 
            (currentFilter === 'unread' && !notification.is_read)) {
            loadNotifications();
        }
    });
}

/**
 * Get notification icon
 */
function getNotificationIcon(type) {
    const icons = {
        'status_change': 'fa-exchange-alt',
        'comment_added': 'fa-comment',
        'new_submission': 'fa-file-plus',
        'reminder': 'fa-bell',
        'system': 'fa-cog'
    };
    return icons[type] || 'fa-bell';
}

/**
 * Get notification title
 */
function getNotificationTitle(notification) {
    const titles = {
        'status_change': 'تحديث حالة الطلب',
        'comment_added': 'تعليق جديد',
        'new_submission': 'طلب جديد',
        'reminder': 'تذكير',
        'system': 'إشعار النظام'
    };
    return titles[notification.type] || 'إشعار';
}

/**
 * Format time ago
 */
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days === 1) return 'أمس';
    if (days < 7) return `منذ ${days} أيام`;
    
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Show loading
 */
function showLoading() {
    notificationsContainer.innerHTML = `
        <div class="loading-placeholder">
            <div class="loading-spinner"></div>
            <p>جاري التحميل...</p>
        </div>
    `;
}

/**
 * Show empty state
 */
function showEmpty() {
    notificationsContainer.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-bell-slash"></i>
            <h3>لا توجد إشعارات</h3>
            <p>ستظهر إشعاراتك هنا</p>
        </div>
    `;
}

/**
 * Show error
 */
function showError(message) {
    notificationsContainer.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Show toast notification
 */
function showToast(message) {
    // TODO: Implement toast notification system
    console.log('Toast:', message);
}

/**
 * Show success message
 */
function showSuccess(message) {
    alert(message);
}

/**
 * Handle logout
 */
async function handleLogout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        try {
            await authStore.logout();
            window.location.href = '/pages/login.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    document.querySelector('.sidebar')?.classList.toggle('active');
}

// Export if needed
export {
    loadNotifications,
    markAsRead,
    deleteNotification
};

