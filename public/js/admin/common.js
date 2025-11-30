/**
 * Admin Common JavaScript
 * كود مشترك لجميع صفحات admin
 */

import { initChatDropdown } from '../utils/chat-dropdown.js';
import badgeManager from '../utils/badge-manager.js';
import authStore from '../stores/authStore.js';
import { requireAdmin } from '../utils/auth-guard.js';

let isInitialized = false;

/**
 * Initialize common admin features
 * تهيئة الميزات المشتركة لصفحات admin
 */
export async function initAdminCommon() {
    // Prevent multiple initializations
    if (isInitialized) {
        console.log('Admin common already initialized');
        return;
    }
    
    try {
        // Check admin access
        const user = await requireAdmin();
        if (!user) {
            console.warn('Admin access required');
            return;
        }
        
        console.log('🔄 Initializing admin common features...');
        
        // Initialize chat dropdown with retry
        const chatBtn = document.getElementById('chat-btn');
        if (chatBtn) {
            // Check if already initialized
            if (chatBtn.getAttribute('data-chat-initialized') !== 'true') {
                try {
                    console.log('🔄 Initializing chat dropdown...');
                    await initChatDropdown();
                    chatBtn.setAttribute('data-chat-initialized', 'true');
                    console.log('✅ Chat dropdown initialized');
                } catch (error) {
                    console.error('❌ Error initializing chat dropdown:', error);
                    // Retry after a delay
                    setTimeout(async () => {
                        try {
                            await initChatDropdown();
                            chatBtn.setAttribute('data-chat-initialized', 'true');
                            console.log('✅ Chat dropdown initialized (retry)');
                        } catch (retryError) {
                            console.error('❌ Chat initialization failed after retry:', retryError);
                        }
                    }, 1000);
                }
            } else {
                console.log('✅ Chat already initialized');
            }
        } else {
            console.warn('⚠️ Chat button not found');
        }
        
        // Initialize badge manager (notifications and chat badges)
        try {
            console.log('🔄 Initializing badge manager...');
            await badgeManager.initialize();
            console.log('✅ Badge manager initialized');
        } catch (error) {
            console.error('❌ Error initializing badge manager:', error);
        }
        
        // Setup notifications button
        const notificationsBtn = document.getElementById('notifications-btn');
        if (notificationsBtn) {
            // Remove existing listeners to avoid duplicates
            const newBtn = notificationsBtn.cloneNode(true);
            notificationsBtn.parentNode.replaceChild(newBtn, notificationsBtn);
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/pages/admin/notifications.html';
            });
            console.log('✅ Notifications button configured');
        }
        
        isInitialized = true;
        console.log('✅ Admin common features initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing admin common features:', error);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const isAdminPage = window.location.pathname.includes('/admin/');
        if (isAdminPage) {
            // Small delay to ensure all scripts are loaded
            setTimeout(() => {
                initAdminCommon();
            }, 100);
        }
    });
} else {
    // DOM already loaded
    const isAdminPage = window.location.pathname.includes('/admin/');
    if (isAdminPage) {
        setTimeout(() => {
            initAdminCommon();
        }, 100);
    }
}

