/**
 * Researcher Common JavaScript
 * كود مشترك لجميع صفحات researcher
 */

import { initChatDropdown } from '../utils/chat-dropdown.js';
import badgeManager from '../utils/badge-manager.js';
import authStore from '../stores/authStore.js';
import { requireResearcher } from '../utils/auth-guard.js';
import { 
    clearCacheOnPageLoad, 
    startAutoCacheClearing,
    clearResearcherCache 
} from '../utils/researcher-cache-clear.js';

let isInitialized = false;
let cacheClearingInitialized = false;

/**
 * Initialize common researcher features
 * تهيئة الميزات المشتركة لصفحات researcher
 */
export async function initResearcherCommon() {
    if (isInitialized) return;
    
    try {
        const user = await requireResearcher();
        if (!user) return;
        
        // Initialize cache clearing system - Real-time
        if (!cacheClearingInitialized) {
            try {
                // مسح الكاش عند تحميل الصفحة
                await clearCacheOnPageLoad();
                
                // بدء مسح الكاش التلقائي كل 5 دقائق
                startAutoCacheClearing(5);
                
                // مسح الكاش عند التنقل بين الصفحات
                const links = document.querySelectorAll('a[href*="/researcher/"]');
                links.forEach(link => {
                    link.addEventListener('click', async (e) => {
                        // مسح الكاش قبل الانتقال
                        await clearResearcherCache({ silent: true, clearAll: false, preserveAuth: true });
                    });
                });
                
                cacheClearingInitialized = true;
                console.log('✅ تم تفعيل نظام مسح الكاش التلقائي (Real-time) لجميع صفحات الباحث');
            } catch (error) {
                console.error('Error initializing cache clearing:', error);
            }
        }
        
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
                window.location.href = '/pages/researcher/notifications.html';
            });
        }
        
        isInitialized = true;
        
    } catch (error) {
        console.error('Error initializing researcher common features:', error);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const isResearcherPage = window.location.pathname.includes('/researcher/');
        if (isResearcherPage) {
            // Small delay to ensure all scripts are loaded
            setTimeout(() => {
                initResearcherCommon();
            }, 100);
        }
    });
} else {
    // DOM already loaded
    const isResearcherPage = window.location.pathname.includes('/researcher/');
    if (isResearcherPage) {
        setTimeout(() => {
            initResearcherCommon();
        }, 100);
    }
}

