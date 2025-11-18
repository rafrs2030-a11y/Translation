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
    if (chatBtn) {
        await initChatDropdown();
    }
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initChatIfExists();
});

