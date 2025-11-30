/**
 * Initialize Chat on All Pages
 * تهيئة الدردشة على جميع الصفحات
 */

import { initChatDropdown } from './chat-dropdown.js';

/**
 * Initialize chat if chat button exists
 */
export async function initChatIfExists() {
    const chatBtn = document.getElementById('chat-btn');
    if (!chatBtn) {
        return false;
    }
    
    // Check if already initialized
    if (chatBtn.getAttribute('data-chat-initialized') === 'true') {
        return true;
    }
    
    try {
        await initChatDropdown();
        chatBtn.setAttribute('data-chat-initialized', 'true');
        return true;
    } catch (error) {
        console.error('Error initializing chat:', error);
        return false;
    }
}

