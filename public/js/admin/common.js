/**
 * Admin Common JavaScript
 * كود مشترك لجميع صفحات admin
 */

import { initChatDropdown } from '../utils/chat-dropdown.js';
import badgeManager from '../utils/badge-manager.js';
import authStore from '../stores/authStore.js';
import { requireAdmin } from '../utils/auth-guard.js';

/**
 * Initialize common admin features
 * تهيئة الميزات المشتركة لصفحات admin
 */
export async function initAdminCommon() {
    try {
        // Check admin access
        const user = await requireAdmin();
        if (!user) return;
        
        // Initialize chat dropdown
        const chatBtn = document.getElementById('chat-btn');
        if (chatBtn) {
            try {
                await initChatDropdown();
                console.log('✅ Chat initialized');
            } catch (error) {
                console.error('Error initializing chat:', error);
            }
        }
        
        // Initialize badge manager (notifications and chat badges)
        try {
            await badgeManager.initialize();
            console.log('✅ Badge manager initialized');
        } catch (error) {
            console.error('Error initializing badge manager:', error);
        }
        
        // Setup notifications button
        const notificationsBtn = document.getElementById('notifications-btn');
        if (notificationsBtn && !notificationsBtn.onclick) {
            notificationsBtn.addEventListener('click', () => {
                window.location.href = '/pages/admin/notifications.html';
            });
        }
        
    } catch (error) {
        console.error('Error initializing admin common features:', error);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on an admin page
    const isAdminPage = window.location.pathname.includes('/admin/');
    if (isAdminPage) {
        initAdminCommon();
    }
});

