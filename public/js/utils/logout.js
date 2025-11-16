/**
 * Logout Utility
 * وظيفة تسجيل الخروج العامة
 */

import { authStore } from '../stores/authStore.js';

/**
 * Handle logout
 * @returns {Promise<void>}
 */
export async function handleLogout() {
    // Show confirmation
    if (!confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        return;
    }

    try {
        console.log('Logging out...');
        
        // Show loading (if there's a button)
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.disabled = true;
            logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري تسجيل الخروج...</span>';
        }

        // Call authStore logout
        await authStore.logout();
        
        console.log('Logout successful, redirecting...');
        
        // Redirect to login page
        window.location.href = '/pages/login.html';
        
    } catch (error) {
        console.error('Logout error:', error);
        
        // Show error message
        alert('حدث خطأ أثناء تسجيل الخروج. سيتم تسجيل خروجك محلياً.');
        
        // Force logout locally
        localStorage.removeItem('token');
        sessionStorage.clear();
        
        // Redirect anyway
        window.location.href = '/pages/login.html';
    }
}

/**
 * Setup logout button
 * @param {string} buttonId - ID of logout button
 */
export function setupLogoutButton(buttonId = 'logout-btn') {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', handleLogout);
        console.log('Logout button setup complete');
    }
}

/**
 * Auto-setup logout on DOMContentLoaded
 */
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        setupLogoutButton();
    });
}

