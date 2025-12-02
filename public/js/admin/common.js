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
    if (isInitialized) return;
    
    try {
        const user = await requireAdmin();
        if (!user) return;
        
        // Initialize chat dropdown with retry
        const chatBtn = document.getElementById('chat-btn');
        if (chatBtn && chatBtn.getAttribute('data-chat-initialized') !== 'true') {
            try {
                await initChatDropdown();
                chatBtn.setAttribute('data-chat-initialized', 'true');
            } catch (error) {
                console.error('Error initializing chat dropdown:', error);
                setTimeout(async () => {
                    try {
                        await initChatDropdown();
                        chatBtn.setAttribute('data-chat-initialized', 'true');
                    } catch (retryError) {
                        console.error('Chat initialization failed after retry:', retryError);
                    }
                }, 1000);
            }
        }
        
        // Initialize badge manager
        try {
            await badgeManager.initialize();
        } catch (error) {
            console.error('Error initializing badge manager:', error);
        }
        
        // Setup notifications button
        const notificationsBtn = document.getElementById('notifications-btn');
        if (notificationsBtn) {
            const newBtn = notificationsBtn.cloneNode(true);
            notificationsBtn.parentNode.replaceChild(newBtn, notificationsBtn);
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/pages/admin/notifications.html';
            });
        }
        
        isInitialized = true;
        
    } catch (error) {
        console.error('Error initializing admin common features:', error);
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

