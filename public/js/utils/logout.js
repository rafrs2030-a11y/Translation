/**
 * Logout Utility
 * وظيفة تسجيل الخروج العامة
 */

import authStore from '../stores/authStore.js';

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
        const logoutLink = document.getElementById('logout-link');
        
        if (logoutBtn) {
            logoutBtn.disabled = true;
            logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري تسجيل الخروج...</span>';
        }
        
        if (logoutLink) {
            logoutLink.style.pointerEvents = 'none';
            logoutLink.style.opacity = '0.6';
        }

        // Call authStore logout
        const result = await authStore.logout();
        
        if (!result.success) {
            throw new Error(result.error || 'فشل تسجيل الخروج');
        }
        
        console.log('Logout successful, redirecting...');
        
        // تنظيف إضافي للتأكد
        try {
            // تنظيف جميع مفاتيح Supabase
            const supabaseKeys = Object.keys(localStorage).filter(key => 
                key.startsWith('sb-') || 
                key.startsWith('supabase.') ||
                key.includes('supabase')
            );
            supabaseKeys.forEach(key => localStorage.removeItem(key));
            
            sessionStorage.clear();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('session');
            localStorage.removeItem('auth');
        } catch (cleanupError) {
            console.warn('Cleanup warning:', cleanupError);
        }
        
        // Redirect to login page with cache busting
        window.location.replace('/pages/login.html');
        
    } catch (error) {
        console.error('Logout error:', error);
        
        // Force logout locally even if there was an error
        try {
            const supabaseKeys = Object.keys(localStorage).filter(key => 
                key.startsWith('sb-') || 
                key.startsWith('supabase.') ||
                key.includes('supabase')
            );
            supabaseKeys.forEach(key => localStorage.removeItem(key));
            
            sessionStorage.clear();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('session');
            localStorage.removeItem('auth');
        } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
        }
        
        // Show error message
        alert('حدث خطأ أثناء تسجيل الخروج. سيتم تسجيل خروجك محلياً.');
        
        // Redirect anyway
        window.location.replace('/pages/login.html');
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

