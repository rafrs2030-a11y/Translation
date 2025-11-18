/**
 * Notification Dropdown Component
 * مكون قائمة الإشعارات المنسدلة
 */

import notificationsStore from '../stores/notificationsStore.js';
import { formatRelativeTime } from './helpers.js';
import authStore from '../stores/authStore.js';

let notificationDropdown = null;
let notificationBtn = null;
let notificationBadge = null;
let notificationsContainer = null;
let isInitialized = false;

/**
 * Get notifications page URL based on user role
 */
function getNotificationsPageUrl() {
    try {
        const user = authStore.getState().user;
        if (user && (user.role === 'admin' || user.role === 'super_admin')) {
            return '/pages/admin/notifications.html';
        }
    } catch (error) {
        console.error('Error getting user role:', error);
    }
    return '/pages/researcher/notifications.html';
}

/**
 * Initialize notification dropdown
 */
export async function initNotificationDropdown() {
    if (isInitialized) return;
    
    notificationBtn = document.getElementById('notifications-btn');
    notificationBadge = document.getElementById('notification-badge');
    
    if (!notificationBtn) return;
    
    // Initialize notifications store for badge updates only
    await notificationsStore.initialize();
    
    // Subscribe to store updates for badge
    notificationsStore.subscribe(handleStoreUpdate);
    
    // Setup event listeners (navigate to page on click)
    setupEventListeners();
    
    // Load initial badge count (only if user is logged in)
    const user = authStore.getState().user;
    if (user) {
        await updateBadge();
    }
    
    isInitialized = true;
}

/**
 * Create dropdown HTML
 */
function createDropdown() {
    const notificationsUrl = getNotificationsPageUrl();
    const dropdownHTML = `
        <div id="notification-dropdown" class="notification-dropdown" style="display: none;">
            <div class="notification-dropdown-header">
                <h3>الإشعارات</h3>
                <button class="btn btn-ghost btn-sm" id="mark-all-read-btn" style="display: none;">
                    <i class="fas fa-check-double"></i>
                    تعليم الكل كمقروء
                </button>
            </div>
            <div class="notification-dropdown-body" id="notification-dropdown-list">
                <div class="notification-loading">
                    <div class="loading-spinner"></div>
                    <p>جاري التحميل...</p>
                </div>
            </div>
            <div class="notification-dropdown-footer">
                <a href="${notificationsUrl}" class="btn btn-outline btn-sm">
                    عرض جميع الإشعارات
                </a>
            </div>
        </div>
    `;
    
    // Insert after notifications button (inside topbar-actions container)
    const topbarActions = notificationBtn.closest('.topbar-actions');
    if (topbarActions) {
        topbarActions.insertAdjacentHTML('beforeend', dropdownHTML);
    } else {
        // Fallback: insert after button
        notificationBtn.insertAdjacentHTML('afterend', dropdownHTML);
    }
}

// Store click outside handler for cleanup
let clickOutsideHandler = null;

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Navigate to notifications page on click
    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const notificationsUrl = getNotificationsPageUrl();
        window.location.href = notificationsUrl;
    });
    
    // No need for dropdown listeners since we're navigating directly
}

/**
 * Toggle dropdown
 */
function toggleDropdown() {
    if (!notificationDropdown) return;
    
    const isVisible = notificationDropdown.style.display !== 'none';
    
    if (isVisible) {
        closeDropdown();
    } else {
        openDropdown();
    }
}

/**
 * Open dropdown
 */
function openDropdown() {
    if (!notificationDropdown) return;
    
    notificationDropdown.style.display = 'block';
    loadNotifications();
}

/**
 * Close dropdown
 */
function closeDropdown() {
    if (!notificationDropdown) return;
    notificationDropdown.style.display = 'none';
}

/**
 * Load notifications
 */
async function loadNotifications() {
    if (!notificationsContainer) return;
    
    try {
        const result = await notificationsStore.fetchNotifications({ limit: 10 });
        
        if (result.success && result.data) {
            renderNotifications(result.data);
            updateMarkAllReadButton(result.counts?.unread > 0);
        } else {
            renderEmpty();
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
        renderError();
    }
}

/**
 * Render notifications
 */
function renderNotifications(notifications) {
    if (!notificationsContainer) return;
    
    if (!notifications || notifications.length === 0) {
        renderEmpty();
        return;
    }
    
    notificationsContainer.innerHTML = notifications.map(notification => 
        createNotificationItem(notification)
    ).join('');
    
    // Add click listeners
    notificationsContainer.querySelectorAll('.notification-dropdown-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.stopPropagation();
            const notificationId = item.dataset.id;
            if (notificationId) {
                await handleNotificationClick(notificationId);
            }
        });
    });
}

/**
 * Create notification item HTML
 */
function createNotificationItem(notification) {
    const isUnread = !notification.is_read;
    const icon = getNotificationIcon(notification.type);
    const time = formatRelativeTime(notification.created_at);
    const title = notification.title || getNotificationTitle(notification) || 'إشعار جديد';
    const message = notification.message || '';
    
    // Escape HTML to prevent XSS
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    
    return `
        <div class="notification-dropdown-item ${isUnread ? 'unread' : ''}" data-id="${notification.id}">
            <div class="notification-dropdown-icon ${notification.type || 'system'}">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-dropdown-content">
                <h4 class="notification-dropdown-title">${escapeHtml(title)}</h4>
                <p class="notification-dropdown-message">${escapeHtml(message)}</p>
                <span class="notification-dropdown-time">${time}</span>
            </div>
            ${isUnread ? '<div class="notification-dropdown-unread-dot"></div>' : ''}
        </div>
    `;
}

/**
 * Handle notification click
 */
async function handleNotificationClick(notificationId) {
    if (!notificationId) return;
    
    try {
        const notification = await notificationsStore.getNotification(notificationId);
        
        // Mark as read if not already read
        if (notification && !notification.is_read) {
            await notificationsStore.markAsRead(notificationId);
        }
        
        // Always navigate to notifications page
        const notificationsUrl = getNotificationsPageUrl();
        window.location.href = notificationsUrl;
    } catch (error) {
        console.error('Error handling notification click:', error);
        // Still navigate to notifications page even if there's an error
        const notificationsUrl = getNotificationsPageUrl();
        window.location.href = notificationsUrl;
    }
}

/**
 * Mark all as read
 */
async function markAllAsRead() {
    const result = await notificationsStore.markAllAsRead();
    
    if (result.success) {
        await loadNotifications();
    }
}

/**
 * Render empty state
 */
function renderEmpty() {
    if (!notificationsContainer) return;
    
    notificationsContainer.innerHTML = `
        <div class="notification-empty">
            <i class="fas fa-bell-slash"></i>
            <p>لا توجد إشعارات</p>
        </div>
    `;
}

/**
 * Render error state
 */
function renderError() {
    if (!notificationsContainer) return;
    
    notificationsContainer.innerHTML = `
        <div class="notification-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>حدث خطأ أثناء تحميل الإشعارات</p>
        </div>
    `;
}

/**
 * Update badge count
 */
async function updateBadge() {
    try {
        // التحقق من وجود المستخدم قبل جلب الإشعارات
        const user = authStore.getState().user;
        if (!user) {
            // إذا لم يكن المستخدم مسجل دخول، إخفاء الشارة
            handleStoreUpdate({ unreadCount: 0 });
            return;
        }
        
        const result = await notificationsStore.fetchNotifications({ limit: 1 });
        if (result && result.counts) {
            handleStoreUpdate({ unreadCount: result.counts.unread || 0 });
        }
    } catch (error) {
        // تجاهل خطأ "المستخدم غير مسجل الدخول" بشكل صامت
        if (error.message && error.message.includes('غير مسجل الدخول')) {
            handleStoreUpdate({ unreadCount: 0 });
            return;
        }
        console.error('Error updating badge:', error);
    }
}

/**
 * Handle store updates
 */
function handleStoreUpdate(state) {
    // Update badge
    if (notificationBadge) {
        const unreadCount = state.unreadCount || 0;
        if (unreadCount > 0) {
            notificationBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            notificationBadge.style.display = '';
        } else {
            notificationBadge.style.display = 'none';
        }
    }
    
    // Update sidebar badge if exists
    const sidebarBadge = document.getElementById('sidebar-notification-count');
    if (sidebarBadge) {
        const unreadCount = state.unreadCount || 0;
        if (unreadCount > 0) {
            sidebarBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            sidebarBadge.style.display = '';
        } else {
            sidebarBadge.style.display = 'none';
        }
    }
}

/**
 * Update mark all read button visibility
 */
function updateMarkAllReadButton(hasUnread) {
    const markAllReadBtn = document.getElementById('mark-all-read-btn');
    if (markAllReadBtn) {
        markAllReadBtn.style.display = hasUnread ? 'block' : 'none';
    }
}

/**
 * Get notification icon
 */
function getNotificationIcon(type) {
    const icons = {
        'status_change': 'fa-exchange-alt',
        'comment_added': 'fa-comment',
        'new_submission': 'fa-file-alt',
        'system': 'fa-info-circle',
        'reminder': 'fa-clock',
        'approval': 'fa-check-circle',
        'rejection': 'fa-times-circle'
    };
    return icons[type] || 'fa-bell';
}

/**
 * Get notification title
 */
function getNotificationTitle(notification) {
    const titles = {
        'status_change': 'تغيير حالة',
        'comment_added': 'تعليق جديد',
        'new_submission': 'طلب جديد',
        'system': 'إشعار نظام',
        'reminder': 'تذكير',
        'approval': 'موافقة',
        'rejection': 'رفض'
    };
    return titles[notification.type] || 'إشعار جديد';
}

/**
 * Cleanup
 */
export function cleanupNotificationDropdown() {
    if (clickOutsideHandler) {
        document.removeEventListener('click', clickOutsideHandler);
        clickOutsideHandler = null;
    }
    
    if (notificationDropdown) {
        notificationDropdown.remove();
    }
    
    notificationDropdown = null;
    notificationBtn = null;
    notificationBadge = null;
    notificationsContainer = null;
    isInitialized = false;
}

// Remove unused functions since we're not using dropdown anymore
// Keeping them for potential future use but they won't be called

